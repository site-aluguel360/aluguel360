from pathlib import Path

from django.apps import apps
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.users.models import User


ADMIN_EMAILS = {"admin@admin", "admin@admin.com"}


class Command(BaseCommand):
    help = "Apaga os dados locais, preserva a conta administrativa e limpa os arquivos de mídia."

    @transaction.atomic
    def handle(self, *args, **options):
        admin_users = list(User.objects.filter(email__in=ADMIN_EMAILS))
        if not admin_users:
            raise CommandError("Conta administrativa admin@admin/admin@admin.com não encontrada; limpeza abortada.")
        if len(admin_users) > 1:
            raise CommandError("Mais de uma conta administrativa foi encontrada; limpeza abortada.")

        admin = admin_users[0]
        deleted = {}

        # Delete application data first. Auth permission tables are preserved so
        # the existing admin access remains intact.
        preserved_models = {
            User,
            apps.get_model("contenttypes", "ContentType"),
            apps.get_model("auth", "Permission"),
            apps.get_model("auth", "Group"),
            apps.get_model("sessions", "Session"),
        }
        for model in reversed(apps.get_models()):
            if model in preserved_models or not model._meta.managed:
                continue
            try:
                result = model.objects.all().delete()
                deleted[model._meta.label] = result[0]
            except Exception as exc:
                raise CommandError(f"Falha ao limpar {model._meta.label}: {exc}") from exc

        removed_users, _ = User.objects.exclude(pk=admin.pk).delete()
        deleted["users.User"] = removed_users

        media_root = Path(getattr(settings, "MEDIA_ROOT", ""))
        removed_files = 0
        if media_root.exists():
            for path in sorted(media_root.rglob("*"), reverse=True):
                if path.is_file():
                    path.unlink()
                    removed_files += 1
            for path in sorted(media_root.rglob("*"), reverse=True):
                if path.is_dir():
                    try:
                        path.rmdir()
                    except OSError:
                        pass

        self.stdout.write(self.style.SUCCESS(
            f"Banco limpo. Preservado: {admin.email}. "
            f"Usuários removidos: {removed_users}. Arquivos locais removidos: {removed_files}."
        ))
        self.stdout.write(f"Resumo: {deleted}")
