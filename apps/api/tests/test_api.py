"""Comprehensive API test suite for NKAR WOO LÀN.

Tests core service endpoints:
- Health and status
- Authentication (login, token validation, invalid credentials)
- Public reads across modules (News, Events, Heritage, Leadership, Gallery, Publications, Projects)
- Contact submission
- Admin authentication & RBAC protection (Audit log access)
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "nkar-woo-lan-api"


@pytest.mark.asyncio
async def test_auth_login_success(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "admin@nkarwoolan.org", "password": "Admin@Nkar2026!"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@nkarwoolan.org"
    assert data["user"]["role"] == "super_admin"


@pytest.mark.asyncio
async def test_auth_login_invalid_password(client: AsyncClient):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "admin@nkarwoolan.org", "password": "WrongPassword123!"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["detail"]["code"] == "INVALID_CREDENTIALS"


@pytest.mark.asyncio
async def test_public_news_list(client: AsyncClient):
    response = await client.get("/api/v1/news")
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert len(res["data"]) >= 3
    assert "meta" in res
    assert res["meta"]["page"] == 1
    assert res["meta"]["total_items"] >= 3
    # Check that published fields are cleanly structured
    first = res["data"][0]
    assert "title" in first
    assert "slug" in first
    assert "content" in first
    assert "views" in first


@pytest.mark.asyncio
async def test_public_events_list(client: AsyncClient):
    response = await client.get("/api/v1/events")
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert len(res["data"]) >= 2
    first = res["data"][0]
    assert "start_datetime" in first
    assert "location" in first


@pytest.mark.asyncio
async def test_public_heritage_list(client: AsyncClient):
    response = await client.get("/api/v1/heritage")
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert len(res["data"]) >= 3
    first = res["data"][0]
    assert "category" in first
    assert "images" in first


@pytest.mark.asyncio
async def test_public_leadership_order(client: AsyncClient):
    response = await client.get("/api/v1/leadership")
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    leaders = res["data"]
    assert len(leaders) >= 4
    # Verify sequential ordering of reigns
    names = [l["name"] for l in leaders]
    assert "Fon Molo I" in names[0]
    assert "Fon Tume Ntani II" in names[-1]


@pytest.mark.asyncio
async def test_public_gallery_items(client: AsyncClient):
    response = await client.get("/api/v1/gallery")
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert len(res["data"]) >= 4
    first = res["data"][0]
    assert first["media_url"].startswith("http")


@pytest.mark.asyncio
async def test_public_publications_list(client: AsyncClient):
    response = await client.get("/api/v1/publications")
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert len(res["data"]) >= 3
    first = res["data"][0]
    assert first["document_url"].startswith("http")
    assert first["file_type"] == "pdf"


@pytest.mark.asyncio
async def test_public_projects_list(client: AsyncClient):
    response = await client.get("/api/v1/projects")
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert len(res["data"]) >= 2
    first = res["data"][0]
    assert first["progress_percentage"] >= 0
    assert first["status"] == "ongoing"


@pytest.mark.asyncio
async def test_submit_contact_message(client: AsyncClient):
    payload = {
        "sender_name": "Test Diaspora Member",
        "sender_email": "test.member@example.org",
        "phone": "+237 600 000 000",
        "subject": "Inquiry on Village Development",
        "message": "Greetings from Maryland. Please share instructions on joining the water committee fundraising.",
    }
    response = await client.post("/api/v1/contacts", json=payload)
    assert response.status_code == 201
    res = response.json()
    assert res["success"] is True
    assert res["data"]["sender_email"] == "test.member@example.org"
    assert res["data"]["status"] == "unread"


@pytest.mark.asyncio
async def test_news_pagination_and_filter(client: AsyncClient):
    # Test query search
    res_search = await client.get("/api/v1/news?q=Cultural")
    assert res_search.status_code == 200
    search_data = res_search.json()
    assert search_data["success"] is True
    assert search_data["meta"]["total_items"] >= 1
    assert any("Cultural" in item["title"] for item in search_data["data"])

    # Test pagination limits
    res_page = await client.get("/api/v1/news?page=1&page_size=1")
    assert res_page.status_code == 200
    page_data = res_page.json()
    assert len(page_data["data"]) == 1
    assert page_data["meta"]["page"] == 1
    assert page_data["meta"]["page_size"] == 1
    assert page_data["meta"]["has_next"] is True


@pytest.mark.asyncio
async def test_media_upload_unauthorized(client: AsyncClient):
    # Media upload requires admin credentials
    response = await client.post(
        "/api/v1/media/upload",
        files={"file": ("test.png", b"fake-image-bytes", "image/png")},
    )
    assert response.status_code in (401, 403)


@pytest.mark.asyncio
async def test_media_upload_no_mock_credential_check(client: AsyncClient, admin_token: str):
    # Real execution: when Cloudinary is not configured with real credentials,
    # the endpoint strictly returns 500 STORAGE_NOT_CONFIGURED (no mocks or fallback URLs)
    response = await client.post(
        "/api/v1/media/upload",
        files={"file": ("test.png", b"fake-image-bytes", "image/png")},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    # Since CLOUDINARY_API_KEY/SECRET are empty in test env, must cleanly fail with 500 and STORAGE_NOT_CONFIGURED
    assert response.status_code == 500
    data = response.json()
    assert data["detail"]["code"] == "STORAGE_NOT_CONFIGURED"


@pytest.mark.asyncio
async def test_audit_logs_rbac_protection(client: AsyncClient, admin_token: str):
    # Unauthenticated access must be rejected
    unauth_res = await client.get("/api/v1/audit")
    assert unauth_res.status_code in (401, 403)

    # Super admin access must succeed
    auth_res = await client.get(
        "/api/v1/audit",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert auth_res.status_code == 200
    res = auth_res.json()
    assert res["success"] is True
    assert len(res["data"]) >= 1
    assert res["data"][0]["action"] == "INITIALIZE_SYSTEM"
