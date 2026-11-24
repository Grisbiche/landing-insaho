"""Post-processing applied to the localized site (idempotent):
 - remove hCaptcha (tied to the old CMS backend)
 - inject /assets/site/forms.js on every page
 - declare the Netlify forms (hidden) in index.html so Netlify detects them at deploy
 - drop the useless preconnect to the site's own origin"""
import os, re, sys
OUT = sys.argv[1]
NETLIFY_FORMS = '''<!-- Formulaires déclarés pour Netlify Forms (invisibles) : voir /assets/site/forms.js -->
<form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>
<input name="bot-field"><input name="page"><input name="lastname"><input name="firstname"><input name="company"><input name="city"><input name="email"><input name="mobile"><textarea name="message"></textarea>
</form>
<form name="newsletter" data-netlify="true" netlify-honeypot="bot-field" hidden>
<input name="bot-field"><input name="page"><input name="email"><input name="function">
</form>
'''
TAG = '<script src="/assets/site/forms.js" defer></script>'
for root, _, files in os.walk(OUT):
    if '/assets' in root or '/media' in root: continue
    for f in files:
        if not f.endswith('.html') or 'manifest' in f: continue
        fn = os.path.join(root, f); t = open(fn).read(); o = t
        t = re.sub(r"\s*<script src='https://js\.hcaptcha\.com/1/api\.js' async defer></script>", '', t)
        t = re.sub(r"\s*<div\s+class='h-captcha' data-sitekey='[^']*'></div>", '', t)
        t = t.replace('<link rel="preconnect" href="/">', '')
        if TAG not in t: t = t.replace('</body>', TAG + '\n</body>', 1)
        if os.path.relpath(fn, OUT) == 'index.html' and 'name="contact" data-netlify' not in t:
            t = t.replace('</body>', NETLIFY_FORMS + '</body>', 1)
        if t != o: open(fn, 'w').write(t)
print('ok')
