"""Media upload and management routes using Cloudinary."""

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.api.dependencies import require_admin
from app.modules.media.schemas import MediaDeleteRequest, MediaUploadResponse
from app.modules.media.service import delete_file_from_cloudinary, upload_file_to_cloudinary
from app.shared.responses import Envelope

router = APIRouter(prefix="/media", tags=["media"])


@router.post("/upload", response_model=Envelope[MediaUploadResponse], status_code=status.HTTP_201_CREATED)
async def upload_media_file(
    file: UploadFile = File(...),
    folder: str | None = Form(None),
    resource_type: str = Form("auto"),
    actor: dict = Depends(require_admin),
):
    """Uploads an image, document, or video to Cloudinary.
    
    Protected endpoint: Requires active administrator/editor credentials.
    Returns metadata including public secure URL to attach to entity records.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail={"code": "INVALID_FILE", "message": "No file uploaded"})

    result = await upload_file_to_cloudinary(file, folder=folder, resource_type=resource_type)
    return {"success": True, "data": result}


@router.delete("/destroy", response_model=Envelope[dict])
async def delete_media_file(
    payload: MediaDeleteRequest,
    actor: dict = Depends(require_admin),
):
    """Deletes an uploaded asset from Cloudinary using its public_id."""
    result = await delete_file_from_cloudinary(payload.public_id, resource_type=payload.resource_type)
    return {"success": True, "data": result}
