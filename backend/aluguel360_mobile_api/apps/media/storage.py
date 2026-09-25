"""Storage abstraction for uploaded media.

Local storage is the only active backend in the current project.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

from django.conf import settings
from django.core.files.storage import default_storage
from django.utils.text import get_valid_filename


@dataclass(frozen=True)
class StoredMedia:
    name: str
    url: str
    public_id: str


class LocalMediaStorage:
    """Persist uploads in MEDIA_ROOT using Django's configured storage."""

    def save(self, uploaded_file, *, user_id: str, media_type: str) -> StoredMedia:
        suffix = Path(uploaded_file.name or "arquivo").suffix.lower()
        filename = get_valid_filename(Path(uploaded_file.name or "arquivo").stem)[:80]
        name = f"media/{user_id}/{media_type.lower()}/{uuid4()}_{filename}{suffix}"
        stored_name = default_storage.save(name, uploaded_file)
        return StoredMedia(
            name=stored_name,
            url=default_storage.url(stored_name),
            public_id=stored_name,
        )

    def delete(self, public_id: str) -> None:
        if public_id:
            default_storage.delete(public_id)


def get_media_storage():
    return LocalMediaStorage()
