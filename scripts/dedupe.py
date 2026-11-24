"""Merge byte-identical asset files and collapse versioned duplicates (x-1.css, x-2.css) into x.css."""
import os, sys, hashlib, re
OUT = sys.argv[1]
by_hash = {}
for root, _, files in os.walk(OUT):
    for f in files:
        fn = os.path.join(root, f)
        if fn.endswith('.html') and '/fr/' in fn and 'manifest' not in fn or fn == os.path.join(OUT,'index.html'): continue
        by_hash.setdefault(hashlib.sha1(open(fn,'rb').read()).hexdigest(), []).append(fn)
ren = {}
for h, fs in by_hash.items():
    if len(fs) < 2: continue
    fs.sort(key=lambda x: (len(x), x)); keep = fs[0]
    for f in fs[1:]:
        ren['/' + os.path.relpath(f, OUT)] = '/' + os.path.relpath(keep, OUT); os.remove(f)
# versioned leftovers in assets: x-N.ext differing from x.ext -> keep newest? report
left = [os.path.join(r,f) for r,_,fs in os.walk(os.path.join(OUT,'assets')) for f in fs if re.search(r'-\d+\.[a-z0-9]+$', f)]
print('merged', len(ren), 'differing versioned files left:', len(left))
for l in left[:20]: print(' ', l)
pat = re.compile('|'.join(re.escape(k) for k in sorted(ren, key=len, reverse=True)) + r'(?=["\')\s,\\])') if ren else None
for root, _, files in os.walk(OUT):
    for f in files:
        if not f.endswith(('.html','.css','.js','.json','.webmanifest')): continue
        fn = os.path.join(root, f); t = open(fn, encoding='utf-8', errors='replace').read()
        if pat:
            n = pat.sub(lambda m: ren[m.group(0)], t)
            if n != t: open(fn,'w').write(n)
