from uuid import UUID
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.contacts.models import ContactSubmission
from app.modules.contacts.schemas import ContactSubmissionCreate, ContactSubmissionUpdate
from app.shared.enums import ContactStatus


async def list_contact_submissions(
    db: AsyncSession,
    status_filter: ContactStatus | None = None,
    q: str | None = None,
    skip: int = 0,
    limit: int = 20,
):
    conditions = []
    if status_filter:
        conditions.append(ContactSubmission.status == status_filter)
    if q:
        conditions.append(
            or_(
                ContactSubmission.sender_name.ilike(f"%{q}%"),
                ContactSubmission.sender_email.ilike(f"%{q}%"),
                ContactSubmission.subject.ilike(f"%{q}%"),
                ContactSubmission.message.ilike(f"%{q}%"),
            )
        )

    total = await db.scalar(select(func.count()).select_from(ContactSubmission).where(*conditions)) or 0
    query = (
        select(ContactSubmission)
        .where(*conditions)
        .order_by(ContactSubmission.created_date.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.scalars(query)).all()
    return list(rows), total


async def get_contact_by_id(db: AsyncSession, item_id: UUID) -> ContactSubmission | None:
    return await db.get(ContactSubmission, item_id)


async def create_contact_submission(
    db: AsyncSession,
    payload: ContactSubmissionCreate,
) -> ContactSubmission:
    data = payload.model_dump(exclude_unset=True)
    item = ContactSubmission(**data)
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


async def update_contact_submission(
    db: AsyncSession,
    item: ContactSubmission,
    payload: ContactSubmissionUpdate,
) -> ContactSubmission:
    data = payload.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(item, field, val)

    await db.commit()
    await db.refresh(item)
    return item


async def delete_contact_submission(db: AsyncSession, item: ContactSubmission) -> None:
    await db.delete(item)
    await db.commit()
