from datetime import timedelta
from pathlib import Path

from django.conf import settings
from django.core.files import File

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.listings.models import Listing, ListingStatus
from apps.properties.models import Property, PropertyRoom, PropertyStatus
from apps.users.models import User, UserRole
from apps.media.models import Media, MediaType
from apps.media.storage import get_media_storage

DEMO_USERS = [
    {"email": "proprietario.demo@aluguel360.test", "nome": "Carlos Alberto Silva", "cpf": "12345678910", "telefone": "86998123456"},
    {"email": "ana.souza@aluguel360.test", "nome": "Ana Beatriz Souza", "cpf": "23456789021", "telefone": "48998887766"},
    {"email": "marcos.lima@aluguel360.test", "nome": "Marcos Eduardo Lima", "cpf": "34567890132", "telefone": "48997776655"},
]
DEMO_PASSWORD = "Demo@Aluguel3602026!"

DEMO_PROPERTIES = [
    {"key": "mock-apartamento-centro", "asset": "property_1.png", "tipo": "APARTAMENTO", "area_m2": 60, "cep": "83540000", "logradouro": "Rua Barão do Rio Branco", "numero": "476", "bairro": "Cidade Nova", "cidade": "Curitiba", "estado": "PR", "titulo": "Apartamento Moderno - Centro", "descricao": "Apartamento com dormitório, varanda, cozinha americana e área de serviço.", "aluguel": "1900.00", "quartos": 1, "views_count": 156, "quality_score": 8.5},
    {"key": "mock-casa-serra", "asset": "property_2.png", "tipo": "CASA", "area_m2": 95, "cep": "88060000", "logradouro": "Estrada das Palmeiras", "numero": "15", "bairro": "Serra das Palmeiras", "cidade": "Florianópolis", "estado": "SC", "titulo": "Casa Rústica - Serra das Palmeiras", "descricao": "Casa tranquila cercada pela natureza, ideal para conforto e privacidade.", "aluguel": "2050.00", "quartos": 2, "views_count": 124, "quality_score": 7.8},
    {"key": "mock-casa-jardim", "asset": "property_3.png", "tipo": "CASA", "area_m2": 110, "cep": "88070000", "logradouro": "Rua do Encanto", "numero": "128", "bairro": "Jardim das Flores", "cidade": "Florianópolis", "estado": "SC", "titulo": "Casa Térrea Aconchegante - Jardim das Flores", "descricao": "Casa térrea com ambientes amplos, iluminação natural e localização residencial.", "aluguel": "2300.00", "quartos": 3, "views_count": 98, "quality_score": 7.5},
]


class Command(BaseCommand):
    help = "Cria usuários, imóveis e anúncios locais de demonstração."

    @transaction.atomic
    def handle(self, *args, **options):
        users = []
        for data in DEMO_USERS:
            user, created = User.objects.get_or_create(
                email=data["email"],
                defaults={"nome": data["nome"], "telefone": data["telefone"], "role": UserRole.PROPRIETARIO, "email_verificado": True},
            )
            if created:
                user.set_password(DEMO_PASSWORD)
                user.cpf_hash = User.hash_cpf(data["cpf"])
                user.save(update_fields=["password", "cpf_hash"])
            users.append(user)

        now = timezone.now()
        expires_at = now + timedelta(days=90)
        created_listings = 0
        updated_listings = 0
        for index, data in enumerate(DEMO_PROPERTIES):
            owner = users[index % len(users)]
            prop, _ = Property.objects.update_or_create(
                owner=owner,
                features__demo_seed_key=data["key"],
                defaults={
                    "tipo": data["tipo"], "area_m2": data["area_m2"], "cep": data["cep"], "logradouro": data["logradouro"],
                    "numero": data["numero"], "bairro": data["bairro"], "cidade": data["cidade"], "estado": data["estado"],
                    "status": PropertyStatus.ATIVO, "features": {"demo_seed_key": data["key"], "mobiliado": False, "pets": True},
                },
            )
            PropertyRoom.objects.update_or_create(property=prop, tipo="quartos", defaults={"quantidade": data["quartos"]})
            listing, created = Listing.objects.update_or_create(
                property=prop,
                titulo=data["titulo"],
                defaults={
                    "owner": owner, "descricao": data["descricao"], "extra_info": "Dados locais de demonstração baseados nos mocks do frontend.",
                    "aluguel": data["aluguel"], "negociavel": False, "status": ListingStatus.PUBLICADO,
                    "views_count": data["views_count"], "quality_score": data["quality_score"], "published_at": now, "expires_at": expires_at,
                },
            )
            media_name = data["asset"]
            media_path = Path(settings.BASE_DIR) / "seed_media" / media_name
            if media_path.exists() and not Media.objects.filter(listing=listing, nome=media_name).exists():
                with media_path.open("rb") as media_file:
                    stored = get_media_storage().save(File(media_file, name=media_name), user_id=str(owner.id), media_type=MediaType.FOTO)
                Media.objects.create(
                    user=owner, property=prop, listing=listing, tipo=MediaType.FOTO,
                    url=stored.url, url_optimized=stored.url, thumbnail_url=stored.url,
                    public_id=stored.public_id, nome=media_name, tamanho_mb=media_path.stat().st_size / (1024 * 1024),
                    formato=media_path.suffix.lstrip(".").lower(), is_highlight=True,
                )
            created_listings += int(created)
            updated_listings += int(not created)

        self.stdout.write(self.style.SUCCESS(f"Dados demo carregados: {len(users)} usuários, {created_listings} anúncios criados, {updated_listings} atualizados."))
