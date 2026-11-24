import re, sys, os, json, time, urllib.parse, concurrent.futures, requests
OUT = sys.argv[1]; SEED = sys.argv[2]
os.makedirs(OUT, exist_ok=True)
S = requests.Session(); S.headers['User-Agent'] = 'Mozilla/5.0 (site-migration)'
seen=set(); queue=[l.strip() for l in open(SEED) if l.strip()]; queue.append('https://www.insaho.fr/')
pages={}
def norm(u):
    u=u.split('#')[0]
    u=u.replace('://insaho.fr','://www.insaho.fr').replace('http://','https://')
    return u
def ishtml(u):
    p=urllib.parse.urlparse(u)
    return p.netloc=='www.insaho.fr' and (p.path=='/' or p.path.endswith('.html')) and 'manifest' not in p.path and not p.query
def fetch(u):
    for i in range(3):
        try:
            r=S.get(u,timeout=60); return u,r.status_code,r.text
        except Exception as e: time.sleep(2)
    return u,0,''
while queue:
    batch=[]
    for u in queue:
        u=norm(u)
        if u not in seen and ishtml(u): seen.add(u); batch.append(u)
    queue=[]
    with concurrent.futures.ThreadPoolExecutor(6) as ex:
        for u,code,txt in ex.map(fetch,batch):
            pages[u]=code
            if code!=200: print('ERR',code,u); continue
            p=urllib.parse.urlparse(u).path
            fn=os.path.join(OUT,'index.html' if p=='/' else p.lstrip('/'))
            os.makedirs(os.path.dirname(fn),exist_ok=True); open(fn,'w').write(txt)
            for h in re.findall(r'href="([^"]+)"',txt):
                queue.append(urllib.parse.urljoin(u,h.replace('&amp;','&')))
json.dump(pages,open(os.path.join(OUT,'_pages.json'),'w'),indent=1)
print(len(pages),'pages')
