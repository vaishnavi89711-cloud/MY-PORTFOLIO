import subprocess, time, json, urllib.request, urllib.parse, socket, base64, os

chrome_path = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
cmd = [chrome_path, '--headless=new', '--remote-debugging-port=9336', '--remote-allow-origins=*', '--no-sandbox', '--window-size=375,812', 'http://127.0.0.1:3000/']
proc = subprocess.Popen(cmd)
time.sleep(2)
try:
    tabs = json.loads(urllib.request.urlopen('http://127.0.0.1:9336/json').read())
    target = [t for t in tabs if '3000' in t.get('url', '')][0]
    ws_url = target['webSocketDebuggerUrl']
    parsed = urllib.parse.urlparse(ws_url)
    s = socket.socket()
    s.connect((parsed.hostname, parsed.port))
    key = base64.b64encode(os.urandom(16)).decode()
    req = f'GET {parsed.path} HTTP/1.1\r\nHost: localhost:{parsed.port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n'
    s.sendall(req.encode())
    resp = s.recv(1024).decode()
    
    js_code = """
    (() => {
        const bodyW = document.body.scrollWidth;
        const viewW = window.innerWidth;
        const wide = [];
        document.querySelectorAll('*').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.right > viewW + 1 && el !== document.documentElement && el !== document.body) {
                wide.push({
                    tag: el.tagName,
                    id: el.id,
                    cls: typeof el.className === 'string' ? el.className.split(' ')[0] : '',
                    right: Math.round(r.right),
                    w: Math.round(r.width)
                });
            }
        });
        return JSON.stringify({ bodyW, viewW, wide: wide.slice(0, 30) });
    })()
    """
    length = len(payload)
    mask = os.urandom(4)
    if length <= 125:
        header = bytearray([0x81, 0x80 | length])
    else:
        header = bytearray([0x81, 0x80 | 126]) + length.to_bytes(2, "big")
    header += mask
    masked = bytearray([payload[i] ^ mask[i % 4] for i in range(length)])
    s.sendall(header + masked)
    
    raw = b''
    while b'bodyW' not in raw:
        chunk = s.recv(4096)
        if not chunk: break
        raw += chunk
    
    text = raw.decode('utf-8', errors='ignore')
    idx = text.find('{"bodyW')
    if idx != -1:
        # find closing
        end = text.rfind('"}')
        extracted = text[idx:end].encode('utf-8').decode('unicode_escape')
        print("OVERFLOW RESULTS:")
        print(extracted)
    else:
        print("Raw response:", text)
finally:
    proc.terminate()
