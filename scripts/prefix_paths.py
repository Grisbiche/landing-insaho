"""Prépare une copie du site servie sous un sous-dossier (ex. GitHub Pages : /landing-insaho/).

Le site est écrit avec des adresses à la racine (/fr/..., /media/..., /assets/...), valables
sur le vrai domaine www.insaho.fr. GitHub Pages sert un dépôt de projet sous
https://<compte>.github.io/<depot>/ : ce script ajoute ce préfixe aux adresses, dans une copie.

usage : python3 scripts/prefix_paths.py SITE_DIR OUT_DIR /landing-insaho
"""
import os, re, shutil, sys

SRC, OUT, PREFIX = sys.argv[1], sys.argv[2], sys.argv[3].rstrip('/')
ROOTS = r'(?:fr|media|assets|hapidam|favicon\.ico|sitemap\.xml|404\.html)'
PATH_RE = re.compile(r'''(?<=["'(=\s,])/(?=''' + ROOTS + r'''(?:[/"'?#)\s]|$))''')
HOME_RE = re.compile(r'''(href=["'])/(["'#])''')
JS_RE = re.compile(r'''(?<=["'])/(?=(?:assets|media|fr)/)''')
VARS_RE = re.compile(r'''\b(HOST|BASEPATH|APPS_URL)(\s*=\s*)"/"''')

if os.path.exists(OUT):
    shutil.rmtree(OUT)
shutil.copytree(SRC, OUT)
n = 0
for root, _, files in os.walk(OUT):
    for f in files:
        if not f.endswith(('.html', '.css', '.webmanifest', '.js')):
            continue
        fn = os.path.join(root, f)
        t = open(fn, encoding='utf-8', errors='replace').read()
        o = t
        if f.endswith('.js'):
            # scripts : uniquement les chaînes du type "/assets/..." (ex. chargeur de public.js)
            t = JS_RE.sub(PREFIX + '/', t)
            if t != o:
                open(fn, 'w', encoding='utf-8').write(t)
                n += 1
            continue
        t = PATH_RE.sub(PREFIX + '/', t)
        t = HOME_RE.sub(lambda m: m.group(1) + PREFIX + '/' + m.group(2), t)
        t = VARS_RE.sub(lambda m: m.group(1) + m.group(2) + '"' + PREFIX + '/"', t)
        if t != o:
            open(fn, 'w', encoding='utf-8').write(t)
            n += 1
print(f'{n} fichiers adaptés au préfixe {PREFIX}/')
