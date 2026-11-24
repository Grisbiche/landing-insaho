"""Localize a crawled Hapi site: download every asset hosted on hapi.mmcreation.com / insaho.fr
and rewrite URLs to root-relative local paths.  usage: localize.py RAW_DIR OUT_DIR"""
import re, sys, os, html, hashlib, urllib.parse, concurrent.futures, requests, shutil, json, threading
RAW, OUT = sys.argv[1], sys.argv[2]
S = requests.Session(); S.headers['User-Agent'] = 'Mozilla/5.0 (site-migration)'
HOSTS = ('hapi.mmcreation.com', 'www.insaho.fr', 'insaho.fr')
# URL: absolute (http/https or protocol-relative) on our hosts, or root-relative /assets/... ; allow balanced (...) e.g. colorize=rgba(1,2,3,1)
TAIL = r'''(?:[^"'\s<>()\\]|\([^()"'\s<>]*\))*'''
URL_RE = re.compile(r'''(?:https?:)?//(?:hapi\.mmcreation\.com|(?:www\.)?insaho\.fr)''' + TAIL)
REL_RE = re.compile(r'''(?<=["'(])/(?:assets|hapidam)/''' + TAIL)
CT_EXT = {'image/svg+xml':'.svg','image/png':'.png','image/jpeg':'.jpg','image/webp':'.webp','image/gif':'.gif',
          'image/avif':'.avif','text/css':'.css','application/javascript':'.js','text/javascript':'.js',
          'application/pdf':'.pdf','font/woff2':'.woff2','font/woff':'.woff','font/ttf':'.ttf',
          'image/x-icon':'.ico','image/vnd.microsoft.icon':'.ico','application/json':'.json','video/mp4':'.mp4'}
TEXT_EXT = ('.css', '.js', '.json', '.webmanifest')
lock = threading.Lock()
mapping = {}   # absolute url -> local path (or None on failure)
failures = {}

def canon(u, base='https://www.insaho.fr/'):
    u = html.unescape(u)
    if u.startswith('//'): u = 'https:' + u
    u = urllib.parse.urljoin(base, u)
    u = u.replace('http://', 'https://', 1).replace('://insaho.fr', '://www.insaho.fr', 1)
    return u

def is_page(u):
    p = urllib.parse.urlparse(u)
    return p.netloc == 'www.insaho.fr' and (p.path in ('', '/') or (p.path.endswith('.html') and 'manifest' not in p.path))

def local_path(u, ct):
    p = urllib.parse.urlparse(u); path = urllib.parse.unquote(p.path); q = p.query
    q_eff = '&'.join(x for x in q.split('&') if x and not re.match(r'^(v|uuid)=', x))
    stem, ext = os.path.splitext(os.path.basename(path))
    ext_ct = CT_EXT.get(ct.split(';')[0].strip().lower(), '')
    if ext_ct and ext.lower() not in (ext_ct, '.jpeg' if ext_ct == '.jpg' else ext_ct, '.html' if ext_ct=='.json' else ext_ct):
        ext = ext_ct if not ext or ext == '.html' and ext_ct != '.json' else (ext + ext_ct if ext not in ('.svg','.png','.jpg','.jpeg','.webp','.gif') else ext_ct)
    if not ext: ext = ext_ct or '.bin'
    if q_eff: stem += '__' + hashlib.sha1(q_eff.encode()).hexdigest()[:8]
    stem = re.sub(r'[^A-Za-z0-9._-]+', '-', stem)
    d = os.path.dirname(path)
    if p.netloc == 'hapi.mmcreation.com':
        if d.startswith('/hapidam/'): d = '/media/' + d[len('/hapidam/'):]
        else: d = '/assets/hapi' + d[len('/assets'):] if d.startswith('/assets') else '/assets/hapi' + d
    return d.rstrip('/') + '/' + stem + ext

def fetch(u):
    with lock:
        if u in mapping: return None
        mapping[u] = '__pending__'
    for i in range(3):
        try:
            r = S.get(u, timeout=90)
            break
        except Exception as e:
            r = None
    if r is None or r.status_code != 200:
        with lock: mapping[u] = None; failures[u] = r.status_code if r is not None else 'net'
        return None
    lp = local_path(u, r.headers.get('content-type', ''))
    with lock:
        # avoid collisions
        taken = set(v for v in mapping.values() if v and v != '__pending__')
        base, ext = os.path.splitext(lp); n = 1
        while lp in taken: lp = f'{base}-{n}{ext}'; n += 1
        mapping[u] = lp
    fn = OUT + lp; os.makedirs(os.path.dirname(fn), exist_ok=True)
    open(fn, 'wb').write(r.content)
    if lp.endswith(TEXT_EXT) or 'manifest' in lp:
        txt = r.content.decode('utf-8', 'replace')
        return (fn, u, txt)
    return None

def find_urls(txt, base):
    out = set()
    for m in URL_RE.finditer(txt): out.add(m.group(0))
    for m in REL_RE.finditer(txt): out.add(m.group(0))
    if base.endswith('.css'):
        for m in re.finditer(r'''url\(\s*['"]?([^'")]+)['"]?\s*\)''', txt):
            v = m.group(1)
            if not v.startswith(('data:', '#', 'http', '//', '/')): out.add(v)
    return out

def asset_urls(found, base):
    res = {}
    for raw in found:
        if raw.startswith('\\'): continue
        try: u = canon(raw, base)
        except Exception: continue
        p = urllib.parse.urlparse(u)
        if p.netloc not in HOSTS: continue
        if is_page(u) or p.path in ('', '/'): continue
        res[raw] = u
    return res

text_files = []   # (localfile, absurl, text)
def crawl_assets(urls):
    todo = list(urls)
    while todo:
        with concurrent.futures.ThreadPoolExecutor(12) as ex:
            results = [r for r in ex.map(fetch, todo) if r]
        todo = []
        for fn, u, txt in results:
            text_files.append((fn, u))
            for raw, au in asset_urls(find_urls(txt, u), u).items():
                if au not in mapping: todo.append(au)
        todo = list(dict.fromkeys(todo))

def rewrite(txt, base, keep_abs_pages=False):
    found = find_urls(txt, base)
    pairs = []
    for raw in found:
        if raw.startswith('\\'): continue
        u = canon(raw, base)
        if urllib.parse.urlparse(u).netloc not in HOSTS: continue
        if is_page(u) or urllib.parse.urlparse(u).path in ('', '/'):
            if keep_abs_pages: continue
            p = urllib.parse.urlparse(u)
            new = (p.path or '/') + (('?' + p.query) if p.query else '') + (('#' + p.fragment) if p.fragment else '')
        else:
            new = mapping.get(u)
            if not new or new == '__pending__': continue
        pairs.append((raw, new))
    # longest first to avoid prefix clobbering
    for raw, new in sorted(pairs, key=lambda x: -len(x[0])):
        if base.endswith('.css') and not raw.startswith(('http', '//', '/')):
            txt = re.sub(r'''url\(\s*(['"]?)''' + re.escape(raw) + r'''\1\s*\)''', 'url(' + new + ')', txt)
        else:
            txt = re.sub(re.escape(raw) + r'''(?=["'\s<>)\\,]|$)''', lambda m: new, txt)
    return txt

if __name__ == '__main__':
    pages = []
    for root, _, files in os.walk(RAW):
        for f in files:
            if f.endswith('.html'): pages.append(os.path.join(root, f))
    all_assets = {}
    for fn in pages:
        rel = '/' + os.path.relpath(fn, RAW).replace('index.html', '') if fn.endswith('/index.html') and os.path.dirname(fn)==RAW.rstrip('/') else '/' + os.path.relpath(fn, RAW)
        base = 'https://www.insaho.fr' + rel
        all_assets.update(asset_urls(find_urls(open(fn).read(), base), base))
    extra = ['https://www.insaho.fr/fr/manifest.webmanifest.html', 'https://www.insaho.fr/favicon.ico']
    print('initial assets', len(set(all_assets.values())))
    crawl_assets(list(dict.fromkeys(list(all_assets.values()) + extra)))
    print('downloaded', sum(1 for v in mapping.values() if v), 'failed', len(failures))
    for fn, u in text_files:
        t = open(fn, encoding='utf-8', errors='replace').read()
        open(fn, 'w').write(rewrite(t, u))
    for fn in pages:
        rel = os.path.relpath(fn, RAW)
        base = 'https://www.insaho.fr/' + ('' if rel == 'index.html' else rel)
        t = open(fn).read()
        # keep canonical/og/hreflang/JSON-LD absolute: protect them
        keep = {}
        def protect(m):
            k = f'@@KEEP{len(keep)}@@'; keep[k] = m.group(0); return k
        t = re.sub(r'<link[^>]+rel="(?:canonical|alternate)"[^>]*>|<meta[^>]+property="og:url"[^>]*>|<script type="application/ld\+json">.*?</script>', protect, t, flags=re.S)
        t = rewrite(t, base)
        for k, v in keep.items():
            t = t.replace(k, rewrite(v, base, keep_abs_pages=True))
        out = os.path.join(OUT, rel); os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, 'w').write(t)
    json.dump({'mapping': mapping, 'failures': failures}, open(os.path.join(os.path.dirname(OUT.rstrip('/')), 'asset-map.json'), 'w'), indent=1)
    print('failures:'); [print(' ', c, u) for u, c in failures.items()]
