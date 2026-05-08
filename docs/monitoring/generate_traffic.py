import urllib.request
import time
import random

endpoints = [
    "http://localhost:3000/",
    "http://localhost:3001/health",
    "http://localhost:3002/health",
    "http://localhost:3002/api/books/",
    "http://localhost:3002/api/books/categories",
    "http://localhost:3002/api/books/?search=python",
    "http://localhost:3002/api/books/?search=java",
    "http://localhost:3002/api/books/?category=Programming"
]

print("🚀 Bắt đầu tạo traffic giả lập cho MicroBooks...")
print("Ấn Ctrl+C để dừng lại.\n")

count = 0
while True:
    url = random.choice(endpoints)
    try:
        start_time = time.time()
        with urllib.request.urlopen(url, timeout=5) as response:
            status = response.getcode()
            duration = (time.time() - start_time) * 1000
            print(f"[{count}] GET {url} - Status: {status} ({duration:.2f}ms)")
    except Exception as e:
        print(f"[{count}] GET {url} - Error: {e}")
    
    count += 1
    time.sleep(random.uniform(0.5, 2.0))
