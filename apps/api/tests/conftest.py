"""Pytest test configuration and fixtures."""

import os
import sys

# Ensure apps/api directory is on pythonpath
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest_asyncio.fixture(scope="session")
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture(scope="session")
async def admin_token(client: AsyncClient) -> str:
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "admin@nkarwoolan.org", "password": "Admin@Nkar2026!"},
    )
    assert response.status_code == 200, f"Login failed: {response.text}"
    data = response.json()
    return data["access_token"]
