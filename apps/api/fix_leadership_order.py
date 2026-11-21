import httpx

API_BASE = "https://nkar-woo-lan-api.vercel.app/api/v1"
ADMIN_EMAIL = "admin@nkarwoolan.org"
ADMIN_PASSWORD = "Admin@Nkar2026!"

# Old conflicting/duplicate IDs from the API output
IDS_TO_DELETE = {
    "3473ab9f-0646-4de6-ba5d-74107101bd97",  # Fon Molo I (1880 - 1905)
    "7e96fec9-3ed8-4342-a829-a379814715ce",  # Fon Molo II (1905 - 1940)
    "9ac40b98-ab90-4e0d-9b26-6bf33683db01",  # Fon Tume Ntani II (1982 - Present)
}

# Canonical chronological order (1 -> 25) from earliest (1170) to present
CANONICAL_ORDER = [
    "Fon Gwarmbi I",
    "Fon Gambo I",
    "Fon Beh",
    "Fon Gwarmbi II",
    "Fon Gambo II",
    "Fon Mbih Nkar",
    "Fon Bambo",
    "Fon Nunu I",
    "Fon Forchuh I",
    "Fon Mapiri",
    "Fon Mbunmbu",
    "Fon Forchuh II",
    "Fon Nunu II",
    "Fon Sembe",
    "Fon Fungung",
    "Fon Tumantir",
    "Fon Ngungmbi",
    "Fon Tayouh",
    "Fon Kilai",
    "Fon Somndjom II",
    "Fon Shiynteng",
    "Fon Ntani I",
    "Fon Mohlo I",
    "Fon Tumi Ntani II",
    "HRM Fon Mohlo II",
]


def main() -> None:
    with httpx.Client(timeout=60.0) as client:
        auth = client.post(
            f"{API_BASE}/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        auth.raise_for_status()
        auth_body = auth.json()
        token = auth_body.get("access_token") or auth_body.get("data", {}).get("access_token")
        client.headers["Authorization"] = f"Bearer {token}"

        items = client.get(f"{API_BASE}/leadership/admin/items?page_size=50").json()["data"]

        for item in items:
            if item["id"] in IDS_TO_DELETE:
                delete_resp = client.delete(f"{API_BASE}/leadership/admin/items/{item['id']}")
                delete_resp.raise_for_status()
                print(f"[DELETED] {item['name']} ({item['id']})")

        refreshed = client.get(f"{API_BASE}/leadership/admin/items?page_size=50").json()["data"]
        by_name = {item["name"]: item for item in refreshed}

        for idx, name in enumerate(CANONICAL_ORDER, start=1):
            item = by_name.get(name)
            if not item:
                print(f"[WARN] Missing from DB: {name}")
                continue
            patch = client.patch(
                f"{API_BASE}/leadership/admin/items/{item['id']}",
                json={"order_index": idx, "status": "published"},
            )
            patch.raise_for_status()
            print(f"[ORDERED #{idx}] {name}")


if __name__ == "__main__":
    main()