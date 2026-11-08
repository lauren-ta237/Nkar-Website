from pydantic import EmailStr, Field
from app.modules.base import Metadata, ModuleModel
from app.shared.enums import SimpleStatus

class ContributionCreate(ModuleModel):
    contributor_name: str = Field(min_length=2, max_length=150)
    contributor_email: EmailStr
    amount_cfa: int = Field(gt=0)
    purpose: str | None = Field(default=None, max_length=255)
    reference: str | None = Field(default=None, max_length=100)
    status: SimpleStatus = SimpleStatus.DRAFT

class ContributionResponse(ContributionCreate, Metadata):
    pass
