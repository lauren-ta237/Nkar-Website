from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.core.config import settings
from app.shared.enums import UserRole

bearer = HTTPBearer(auto_error=False)


def require_admin(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)) -> dict:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail={"code": "AUTH_REQUIRED", "message": "Authentication required"}
        )
    try:
        claims = jwt.decode(credentials.credentials, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id = UUID(str(claims["sub"]))
        if claims.get("type") != "access":
            raise ValueError("wrong token type")
        role = UserRole(str(claims["role"]))
    except (JWTError, KeyError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail={"code": "INVALID_TOKEN", "message": "Invalid authentication token"}
        ) from exc
        
    if role not in {UserRole.SUPER_ADMIN, UserRole.CONTENT_EDITOR}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail={"code": "FORBIDDEN", "message": "Insufficient permissions"}
        )
    return {"user_id": user_id, "role": role}