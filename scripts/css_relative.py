"""Fetch files referenced by relative url() in local CSS, saving them at the same relative location."""
import os, re, sys, requests, urllib.parse
OUT = sys.argv[1]; S = requests.Session()
def remote_for(local):  # local root-relative path -> original URL
    if local.startswith('/assets/hapi/'): return 'https://hapi.mmcreation.com/assets/' + local[len('/assets/hapi/'):]
    return 'https://www.insaho.fr' + local
n = 0; miss = []
for root, _, fs in os.walk(os.path.join(OUT, 'assets')):
    for f in fs:
        if not f.endswith('.css'): continue
        fn = os.path.join(root, f); local_dir = '/' + os.path.relpath(root, OUT) + '/'
        for v in set(re.findall(r'''url\(\s*['"]?([^'")]+)['"]?\s*\)''', open(fn, errors='replace').read())):
            if v.startswith(('data:', '#', 'http', '//', '/')): continue
            loc = urllib.parse.urljoin(local_dir, v.split('?')[0].split('#')[0])
            dest = OUT + urllib.parse.unquote(loc)
            if os.path.exists(dest): continue
            r = S.get(remote_for(loc), timeout=60)
            if r.status_code != 200: miss.append((r.status_code, loc)); continue
            os.makedirs(os.path.dirname(dest), exist_ok=True); open(dest, 'wb').write(r.content); n += 1
print('fetched', n); [print(' MISS', m) for m in miss]
