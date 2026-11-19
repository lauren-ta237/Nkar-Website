import requests

BASE_URL = "http://127.0.0.1:8000/api/v1"

SEED_EMAIL = "admin@nkarwoolan.org"
SEED_PASSWORD = "Admin@Nkar2026!"

print("=== Nkar Woo Automated Full-Suite API Test ===")
print(f"Using seeded admin email: {SEED_EMAIL}\n")

headers = {}

# 1. Test Login with Seeded Super Admin Credentials
print("--- 1. Testing Login ---")
login_payload = {
    "email": SEED_EMAIL,
    "password": SEED_PASSWORD
}
response = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
print(f"Status: {response.status_code}")
data = response.json()

if response.status_code == 200:
    access_token = data.get("access_token")
    refresh_token = data.get("refresh_token")
    print(f"Got Access Token: {access_token[:15]}...")
    
    headers = {"Authorization": f"Bearer {access_token}"}

    # 2. Test Get Current User (/auth/me)
    print("\n--- 2. Testing GET /auth/me ---")
    res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"Status: {res.status_code}")
    print(res.json())

    # 3. Test Get All Users (/users)
    print("\n--- 3. Testing GET /users ---")
    res = requests.get(f"{BASE_URL}/users", headers=headers)
    print(f"Status: {res.status_code}")
    print(res.json())

    # 4. Test Refresh Token (/auth/refresh)
    print("\n--- 4. Testing POST /auth/refresh ---")
    refresh_payload = {"refresh_token": refresh_token}
    res = requests.post(f"{BASE_URL}/auth/refresh", json=refresh_payload)
    print(f"Status: {res.status_code}")
    print(res.json())

    # Helper for testing module public and admin lists
    def test_module_endpoints(module_name, public_path, admin_path):
        print(f"\n--- Testing Module: {module_name} ---")
        # Public GET
        pub_res = requests.get(f"{BASE_URL}{public_path}")
        print(f"GET {public_path} -> Status: {pub_res.status_code}")
        
        # Admin GET
        admin_res = requests.get(f"{BASE_URL}{admin_path}", headers=headers)
        print(f"GET {admin_path} -> Status: {admin_res.status_code}")

    # 5. Test All Feature Modules (Public + Admin Lists)
    test_module_endpoints("News", "/news", "/news/admin/items")
    test_module_endpoints("Events", "/events", "/events/admin/items")
    test_module_endpoints("Heritage", "/heritage", "/heritage/admin/items")
    test_module_endpoints("Leadership", "/leadership", "/leadership/admin/items")
    test_module_endpoints("Gallery", "/gallery", "/gallery/admin/items")
    test_module_endpoints("Publications", "/publications", "/publications/admin/items")
    test_module_endpoints("Projects", "/projects", "/projects/admin/items")
    
    # Contacts Submissions (Admin only list)
    print("\n--- Testing Module: Contacts ---")
    contacts_res = requests.get(f"{BASE_URL}/contacts/admin/items", headers=headers)
    print(f"GET /contacts/admin/items -> Status: {contacts_res.status_code}")

    # Audit Logs (Super Admin only - should return 200 now!)
    print("\n--- Testing Module: Audit ---")
    audit_res = requests.get(f"{BASE_URL}/audit", headers=headers)
    print(f"GET /audit -> Status: {audit_res.status_code}")

else:
    print("Login failed, skipping authenticated endpoint tests.")
    print(data)