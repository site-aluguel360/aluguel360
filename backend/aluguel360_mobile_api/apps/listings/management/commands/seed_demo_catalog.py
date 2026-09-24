from datetime import timedelta

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.listings.models import Listing, ListingStatus
from apps.properties.models import Property, PropertyRoom, PropertyStatus
from apps.users.models import User, UserRole


DEMO_OWNER_EMAIL = "proprietario.demo@aluguel360.test"
DEMO_OWNER_PASSWORD = "Demo@Aluguel3602026!"


DEMO_PROPERTIES = [
    {
        "key": "home-apartamento-vista-panoramica",
        "tipo": "APARTAMENTO",
        "area_m2": 80,
        "cep": "88015000",
        "logradouro": "Rua Pássaros",
        "numero": "350",
        "bairro": "Agronômica",
        "cidade": "Florianópolis",
        "estado": "SC",
        "titulo": "Apartamento com Vista Panorâmica - Alto do Horizonte",
        "descricao": "Apartamento amplo, iluminado e bem localizado, com vista panorâmica, ambientes confortáveis e acesso rápido aos principais serviços da região.",
        "aluguel": "3600.00",
        "quartos": 4,
        "views_count": 156,
        "quality_score": 8.5,
    },
    {
        "key": "home-casa-rustica-serra",
        "tipo": "CASA",
        "area_m2": 65,
        "cep": "88060000",
        "logradouro": "Estrada das Palmeiras",
        "numero": "KM 4, Lote 15",
        "bairro": "Serra das Palmeiras",
        "cidade": "Florianópolis",
        "estado": "SC",
        "titulo": "Casa Rústica - Serra das Palmeiras",
        "descricao": "Casa rústica em ambiente tranquilo cercado pela natureza, ideal para quem busca conforto, privacidade e qualidade de vida.",
        "aluguel": "2050.00",
        "quartos": 2,
        "views_count": 124,
        "quality_score": 7.8,
    },
    {
        "key": "home-casa-terrea-jardim-flores",
        "tipo": "CASA",
        "area_m2": 110,
        "cep": "88070000",
        "logradouro": "Rua do Encanto",
        "numero": "128",
        "bairro": "Jardim das Flores",
        "cidade": "Florianópolis",
        "estado": "SC",
        "titulo": "Casa Térrea Aconchegante - Bairro Jardim das Flores",
        "descricao": "Casa térrea aconchegante, com ambientes amplos, iluminação natural e localização residencial próxima a comércio e serviços.",
        "aluguel": "2300.00",
        "quartos": 3,
        "views_count": 98,
        "quality_score": 7.5,
    },
]


class Command(BaseCommand):
    help = "Cria ou atualiza os imóveis e anúncios de demonstração do catálogo local."

    @transaction.atomic
    def handle(self, *args, **options):
        owner = User.objects.filter(email=DEMO_OWNER_EMAIL).first()
        if not owner:
            owner = User.objects.create_user(
                email=DEMO_OWNER_EMAIL,
                nome="Proprietário Demo Aluguel360",
                cpf="99999999999",
                senha=DEMO_OWNER_PASSWORD,
                telefone="48999999999",
                role=UserRole.PROPRIETARIO,
                email_verificado=True,
            )
            self.stdout.write(f"Usuário demo criado: {DEMO_OWNER_EMAIL}")
        elif not owner.is_active:
            raise CommandError(f"O usuário demo {DEMO_OWNER_EMAIL} existe, mas está inativo.")

        now = timezone.now()
        expires_at = now + timedelta(days=90)
        created_listings = 0
        updated_listings = 0
        retired_legacy_listings = 0

        for data in DEMO_PROPERTIES:
            legacy_properties = Property.objects.filter(
                features__demo_seed_key=data["key"],
            ).exclude(owner=owner)
            legacy_listings = Listing.objects.filter(
                property__in=legacy_properties,
                status=ListingStatus.PUBLICADO,
            )
            retired_legacy_listings += legacy_listings.update(status=ListingStatus.EXPIRADO)
            legacy_properties.update(deleted_at=now, status=PropertyStatus.INATIVO)

            property_obj = Property.objects.filter(
                owner=owner,
                features__demo_seed_key=data["key"],
            ).first()
            property_defaults = {
                "tipo": data["tipo"],
                "area_m2": data["area_m2"],
                "cep": data["cep"],
                "logradouro": data["logradouro"],
                "numero": data["numero"],
                "bairro": data["bairro"],
                "cidade": data["cidade"],
                "estado": data["estado"],
                "status": PropertyStatus.ATIVO,
                "features": {
                    "demo_seed_key": data["key"],
                    "mobiliado": False,
                    "pets": True,
                },
            }
            if property_obj:
                for field, value in property_defaults.items():
                    setattr(property_obj, field, value)
                property_obj.save()
            else:
                property_obj = Property.objects.create(owner=owner, **property_defaults)

            PropertyRoom.objects.update_or_create(
                property=property_obj,
                tipo="quartos",
                defaults={"quantidade": data["quartos"]},
            )

            listing = Listing.objects.filter(property=property_obj, titulo=data["titulo"]).first()
            listing_defaults = {
                "owner": owner,
                "descricao": data["descricao"],
                "extra_info": "Dados locais de demonstração para validação do catálogo público.",
                "aluguel": data["aluguel"],
                "negociavel": False,
                "status": ListingStatus.PUBLICADO,
                "views_count": data["views_count"],
                "quality_score": data["quality_score"],
                "published_at": listing.published_at if listing and listing.published_at else now,
                "expires_at": expires_at,
            }
            if listing:
                for field, value in listing_defaults.items():
                    setattr(listing, field, value)
                listing.save()
                updated_listings += 1
            else:
                Listing.objects.create(property=property_obj, titulo=data["titulo"], **listing_defaults)
                created_listings += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Catálogo demo pronto: {created_listings} anúncios criados, "
                f"{updated_listings} anúncios atualizados, "
                f"{retired_legacy_listings} anúncios legados retirados. "
                f"Proprietário: {owner.email}"
            )
        )
