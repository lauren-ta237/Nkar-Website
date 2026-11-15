"""Cloudinary object storage service for uploading images, documents, and videos."""

import asyncio
from typing import Any

import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile, status

from app.core.config import settings


def _configure_cloudinary() -> None:
    """Configures Cloudinary SDK. Raises 500 error if credentials are not configured."""
    if not (settings.cloudinary_cloud_name and settings.cloudinary_api_key and settings.cloudinary_api_secret):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "code": "STORAGE_NOT_CONFIGURED",
                "message": "Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured.",
            },
        )

    cloudinary.config(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
        secure=True,
    )


async def upload_file_to_cloudinary(
    file: UploadFile,
    folder: str | None = None,
    resource_type: str = "auto",
) -> dict[str, Any]:
    """Uploads an incoming file directly to Cloudinary and returns real asset metadata including public URL."""
    _configure_cloudinary()
    target_folder = folder or settings.cloudinary_folder
    original_filename = file.filename or "upload"
    file_bytes = await file.read()
    file_size = len(file_bytes)

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "EMPTY_FILE", "message": "Uploaded file is empty."},
        )

    try:
        result = await asyncio.to_thread(
            cloudinary.uploader.upload,
            file_bytes,
            folder=target_folder,
            resource_type=resource_type,
            use_filename=True,
            unique_filename=True,
        )
        return {
            "url": result.get("url"),
            "secure_url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "resource_type": result.get("resource_type"),
            "format": result.get("format"),
            "bytes": result.get("bytes", file_size),
            "original_filename": original_filename,
            "folder": target_folder,
        }
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={"code": "UPLOAD_FAILED", "message": f"Cloudinary upload failed: {str(exc)}"},
        ) from exc


async def delete_file_from_cloudinary(public_id: str, resource_type: str = "image") -> dict[str, Any]:
    """Deletes an asset from Cloudinary by its public ID."""
    _configure_cloudinary()

    try:
        result = await asyncio.to_thread(
            cloudinary.uploader.destroy,
            public_id,
            resource_type=resource_type,
        )
        if result.get("result") not in ("ok", "not found"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"code": "DELETE_FAILED", "message": f"Cloudinary deletion failed: {result}"},
            )
        return result
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={"code": "DELETE_FAILED", "message": f"Cloudinary deletion failed: {str(exc)}"},
        ) from exc
