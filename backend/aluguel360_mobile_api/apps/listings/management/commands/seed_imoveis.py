"""
Management command: seed_imoveis
=================================
Popula o banco local com os proprietários e imóveis definidos em
SEEDS/seeds_banco.json.

Uso:
    python manage.py seed_imoveis

Pré-requisito:
    Executar reset_demo_database antes (preserva admin@admin) ou rodar
    em banco vazio. O comando é idempotente: pode ser chamado mais de uma
    vez sem duplicar dados.
"""
from __future__ import annotations

import json
from datetime import timedelta
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.listings.models import Listing, ListingStatus
from apps.media.models import Media, MediaType
from apps.media.storage import get_media_storage
from apps.properties.models import Property, PropertyRoom, PropertyStatus
from apps.users.models import Address, User, UserRole


# ── Caminho do JSON de seeds ─────────────────────────────────────────────────
if Path("/app/SEEDS_TEMP").exists():
    SEEDS_JSON = Path("/app/SEEDS_TEMP/seeds_banco.json")
    SEEDS_IMOVEIS_DIR = Path("/app/SEEDS_TEMP/SEEDS/imoveis")
else:
    SEEDS_JSON = Path(settings.BASE_DIR).parents[2] / "SEEDS" / "seeds_banco.json"
    SEEDS_IMOVEIS_DIR = Path(settings.BASE_DIR).parents[2] / "SEEDS" / "SEEDS" / "imoveis"


class Command(BaseCommand):
    help = (
        "Carrega proprietários e imóveis do seeds_banco.json no banco local. "
        "Idempotente: usa update_or_create em todas as entidades."
    )

    @transaction.atomic
    def handle(self, *args, **options):
        # ── 1. Carregar JSON ──────────────────────────────────────────────────
        if not SEEDS_JSON.exists():
            raise CommandError(
                f"Arquivo de seeds não encontrado: {SEEDS_JSON}\n"
                "Certifique-se de que o arquivo SEEDS/seeds_banco.json existe na raiz do projeto."
            )

        with SEEDS_JSON.open(encoding="utf-8") as f:
            data = json.load(f)

        self.stdout.write(f"Carregando seeds de: {SEEDS_JSON}")

        now = timezone.now()
        expires_at = now + timedelta(days=90)

        # Mapa ref → instância de User, preenchido na etapa de proprietários
        owner_map: dict[str, User] = {}

        stats = {
            "proprietarios_criados": 0,
            "proprietarios_atualizados": 0,
            "enderecos_criados": 0,
            "properties_criados": 0,
            "rooms_criados": 0,
            "listings_criados": 0,
            "midias_criadas": 0,
        }

        # ── 2. Proprietários ──────────────────────────────────────────────────
        self.stdout.write(self.style.MIGRATE_HEADING("\n→ Criando proprietários..."))

        for p in data["proprietarios"]:
            ref = p["_ref"]
            cpf_hash = User.hash_cpf(p["cpf_raw_para_seed"])

            user, created = User.objects.update_or_create(
                email=p["email"],
                defaults={
                    "nome": p["nome"],
                    "cpf_hash": cpf_hash,
                    "telefone": p.get("telefone"),
                    "data_nascimento": p.get("data_nascimento"),
                    "role": UserRole.PROPRIETARIO,
                    "email_verificado": p.get("email_verificado", True),
                    "is_active": p.get("is_active", True),
                    "is_staff": p.get("is_staff", False),
                },
            )
            if created:
                user.set_password(data["meta"]["senha_padrao"])
                user.save(update_fields=["password"])
                stats["proprietarios_criados"] += 1
            else:
                stats["proprietarios_atualizados"] += 1

            owner_map[ref] = user

            # Endereço primário
            addr = p.get("endereco_primario")
            if addr:
                _, addr_created = Address.objects.update_or_create(
                    user=user,
                    is_primary=True,
                    defaults={
                        "cep": addr["cep"],
                        "logradouro": addr["logradouro"],
                        "numero": addr["numero"],
                        "bairro": addr["bairro"],
                        "cidade": addr["cidade"],
                        "estado": addr["estado"],
                        "complemento": addr.get("complemento", ""),
                    },
                )
                if addr_created:
                    stats["enderecos_criados"] += 1

            self.stdout.write(
                f"  {'✔ Criado' if created else '↺ Atualizado'}: "
                f"{user.nome} <{user.email}>"
            )

        # ── 3. Imóveis ────────────────────────────────────────────────────────
        self.stdout.write(self.style.MIGRATE_HEADING("\n→ Criando imóveis..."))

        for imovel in data["imoveis"]:
            seed_id = imovel["seed_id"]
            owner_ref = imovel["owner_ref"]

            if owner_ref not in owner_map:
                raise CommandError(
                    f"owner_ref '{owner_ref}' do imóvel '{seed_id}' não foi encontrado "
                    "nos proprietários carregados. Verifique o seeds_banco.json."
                )

            owner = owner_map[owner_ref]
            prop_data = imovel["property"]
            listing_data = imovel["listing"]

            # ── 3a. Property ──────────────────────────────────────────────────
            prop, prop_created = Property.objects.update_or_create(
                owner=owner,
                features__seed_id=seed_id,
                defaults={
                    "tipo": prop_data["tipo"],
                    "area_m2": prop_data["area_m2"],
                    "cep": prop_data["cep"],
                    "logradouro": prop_data["logradouro"],
                    "numero": prop_data["numero"],
                    "bairro": prop_data["bairro"],
                    "cidade": prop_data["cidade"],
                    "estado": prop_data["estado"],
                    "complemento": prop_data.get("complemento", ""),
                    "referencia": prop_data.get("referencia", ""),
                    "status": PropertyStatus.ATIVO,
                    "features": {
                        "seed_id": seed_id,
                        **prop_data.get("features", {}),
                    },
                },
            )
            if prop_created:
                stats["properties_criados"] += 1

            # ── 3b. Rooms ─────────────────────────────────────────────────────
            for room in imovel.get("rooms", []):
                _, r_created = PropertyRoom.objects.update_or_create(
                    property=prop,
                    tipo=room["tipo"],
                    defaults={"quantidade": room["quantidade"]},
                )
                if r_created:
                    stats["rooms_criados"] += 1

            # ── 3c. Listing ───────────────────────────────────────────────────
            listing, listing_created = Listing.objects.update_or_create(
                property=prop,
                owner=owner,
                defaults={
                    "titulo": listing_data["titulo"],
                    "descricao": listing_data["descricao"],
                    "extra_info": listing_data.get("extra_info", ""),
                    "aluguel": listing_data["aluguel"],
                    "negociavel": listing_data.get("negociavel", False),
                    "condominio_valor": listing_data.get("condominio_valor"),
                    "condominio_incluido": listing_data.get("condominio_incluido", False),
                    "iptu_valor": listing_data.get("iptu_valor"),
                    "iptu_incluido": listing_data.get("iptu_incluido", False),
                    "outras_taxas": listing_data.get("outras_taxas", ""),
                    "garantia": listing_data["garantia"],
                    "status": ListingStatus.PUBLICADO,
                    "views_count": listing_data.get("views_count", 0),
                    "favorites_count": listing_data.get("favorites_count", 0),
                    "quality_score": listing_data.get("quality_score"),
                    "published_at": now,
                    "expires_at": expires_at,
                },
            )
            if listing_created:
                stats["listings_criados"] += 1

            # ── 3d. Mídias ────────────────────────────────────────────────────
            seed_dir = SEEDS_IMOVEIS_DIR / seed_id
            storage = get_media_storage()

            for midia in imovel.get("midias", []):
                arquivo_rel = midia["arquivo"]        # ex.: "midias/capa01.jpg"
                arquivo_path = seed_dir / arquivo_rel  # caminho absoluto físico
                nome = Path(arquivo_rel).name

                # Idempotência: não duplicar mídias já carregadas para este listing
                if Media.objects.filter(listing=listing, nome=nome).exists():
                    continue

                if not arquivo_path.exists():
                    self.stdout.write(
                        self.style.WARNING(
                            f"    ⚠  Arquivo não encontrado, pulando: {arquivo_path}"
                        )
                    )
                    continue

                with arquivo_path.open("rb") as fh:
                    stored = storage.save(
                        File(fh, name=nome),
                        user_id=str(owner.id),
                        media_type=MediaType.FOTO,
                    )

                formato = arquivo_path.suffix.lstrip(".").lower()
                tamanho_mb = arquivo_path.stat().st_size / (1024 * 1024)

                Media.objects.create(
                    user=owner,
                    property=prop,
                    listing=listing,
                    tipo=midia.get("tipo", MediaType.FOTO),
                    url=stored.url,
                    url_optimized=stored.url,
                    thumbnail_url=stored.url,
                    public_id=stored.public_id,
                    nome=nome,
                    tamanho_mb=round(tamanho_mb, 4),
                    formato=formato,
                    is_highlight=midia.get("is_highlight", False),
                    ordem=midia.get("ordem", 0),
                )
                stats["midias_criadas"] += 1

            self.stdout.write(
                f"  {'✔' if prop_created else '↺'} [{prop_data['tipo']}] "
                f"{listing_data['titulo'][:60]} "
                f"(owner: {owner.nome})"
            )

            # Atualizar a cota de armazenamento de mídia do proprietário
            from apps.media.tasks import update_storage_quota
            update_storage_quota(owner.id)

        # ── 4. Relatório final ────────────────────────────────────────────────
        self.stdout.write(self.style.SUCCESS("\n✅ Seeds carregados com sucesso!\n"))
        self.stdout.write(
            self.style.SUCCESS(
                f"  Proprietários criados    : {stats['proprietarios_criados']}\n"
                f"  Proprietários atualizados: {stats['proprietarios_atualizados']}\n"
                f"  Endereços criados        : {stats['enderecos_criados']}\n"
                f"  Imóveis criados          : {stats['properties_criados']}\n"
                f"  Cômodos criados          : {stats['rooms_criados']}\n"
                f"  Anúncios criados         : {stats['listings_criados']}\n"
                f"  Mídias salvas            : {stats['midias_criadas']}"
            )
        )
