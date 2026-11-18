import requests
import time

BASE_URL = "http://127.0.0.1:8000/api/v1"

# Generate a unique email for every execution so registration always succeeds fresh
unique_id = int(time.time())
test_email = f"laurenta.test.{unique_id}@example.com"

print(f"=== Nkar Woo Automated Full-Suite API Test ===")
print(f"Using test email: {test_email}\n")

headers = {}

# 1. Test Registration
print("--- 1. Testing Registration ---")
reg_payload = {
    "name": "Laurenta Test",
    "email": test_email,
    "password": "l#urenT-123",
    "role": "content_editor"
}
response = requests.post(f"{BASE_URL}/auth/register", json=reg_payload)
print(f"Status: {response.status_code}")
print(response.json())

# 2. Test Login (to grab fresh access and refresh tokens)
print("\n--- 2. Testing Login ---")
login_payload = {
    "email": test_email,
    "password": "l#urenT-123"
}
response = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
print(f"Status: {response.status_code}")
data = response.json()

if response.status_code == 200:
    access_token = data.get("access_token")
    refresh_token = data.get("refresh_token")
    print(f"Got Access Token: {access_token[:15]}...")
    
    headers = {"Authorization": f"Bearer {access_token}"}

    # 3. Test Get Current User (/auth/me)
    print("\n--- 3. Testing GET /auth/me ---")
    res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"Status: {res.status_code}")
    print(res.json())

    # 4. Test Get All Users (/users)
    print("\n--- 4. Testing GET /users ---")
    res = requests.get(f"{BASE_URL}/users", headers=headers)
    print(f"Status: {res.status_code}")
    print(res.json())

    # 5. Test Refresh Token (/auth/refresh)
    print("\n--- 5. Testing POST /auth/refresh ---")
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

    # 6. Test All Feature Modules (Public + Admin Lists)
    test_module_endpoints("News", "/news", "/news/admin/items")
    test_module_endpoints("Events", "/events", "/events/admin/items")
    test_module_endpoints("Heritage", "/heritage", "/heritage/admin/items")
    test_module_endpoints("Leadership", "/leadership", "/leadership/admin/items")
    test_module_endpoints("Gallery", "/gallery", "/gallery/admin/items")
    test_module_endpoints("Publications", "/publications", "/publications/admin/items")
    test_module_endpoints("Projects", "/projects", "/projects/admin/items")
    
    # Contacts Submissions (Admin only list)
    # Contacts Submissions (Admin only list)
    print("\n--- Testing Module: Contacts ---")
    contacts_res = requests.get(f"{BASE_URL}/contacts/admin/items", headers=headers)
    print(f"GET /contacts/admin/items -> Status: {contacts_res.status_code}")
    # Audit Logs (Admin only)
    print("\n--- Testing Module: Audit ---")
    audit_res = requests.get(f"{BASE_URL}/audit", headers=headers)
    print(f"GET /audit -> Status: {audit_res.status_code}")

else:
    print("Login failed, skipping authenticated endpoint tests.")