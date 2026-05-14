import urllib.request
import urllib.parse
import traceback

url = 'http://127.0.0.1:8000/api/v1/auth/login'
data = urllib.parse.urlencode({'username': 'test@example.com', 'password': 'password'}).encode()
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/x-www-form-urlencoded'})

try:
    resp = urllib.request.urlopen(req)
    print('status', resp.status)
    print(resp.read().decode())
except Exception:
    traceback.print_exc()
