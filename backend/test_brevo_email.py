"""
Quick test: send a transactional email via Brevo API (same as backend).
Run: python test_brevo_email.py
"""
import json
import os
import urllib.request

# Load .env manually
env_path = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                v = v.strip().strip('"').strip("'")
                os.environ.setdefault(k, v)

API_KEY = os.environ.get("BREVO_API_KEY", "")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "info@globaleventstravels.com")
SENDER_NAME = os.environ.get("SENDER_NAME", "Global Events Travels")

def test_send():
    if not API_KEY:
        print("ERROR: BREVO_API_KEY not set in .env")
        return
    if not ADMIN_EMAIL:
        print("ERROR: ADMIN_EMAIL not set in .env")
        return

    payload = {
        "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
        "to": [{"email": ADMIN_EMAIL, "name": "Admin"}],
        "subject": "Test Email - Brevo API Check",
        "htmlContent": "<p>If you receive this, Brevo transactional email is working.</p>",
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.brevo.com/v3/smtp/email",
        data=data,
        headers={
            "accept": "application/json",
            "api-key": API_KEY,
            "content-type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            msg_id = result.get("messageId")
            print("OK - Email sent successfully!")
            print(f"Message ID: {msg_id}")
            print(f"Check inbox: {ADMIN_EMAIL}")
    except urllib.error.HTTPError as e:
        print(f"ERROR - Brevo API failed: {e.code} {e.reason}")
        print(e.read().decode() if e.fp else "")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_send()
