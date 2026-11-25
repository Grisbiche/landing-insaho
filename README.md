# Insaho.fr

Site officiel d'Insaho, l'Institut des Savoirs de l'Hospitalité.

Ce dépôt contient une **copie fidèle** du site https://www.insaho.fr, sortie du CMS Hapi
(mmcreation). Tous les fichiers (pages, images, PDF, polices, styles et scripts) sont
hébergés ici : le site ne dépend plus de Hapi.

## Contenu du dépôt

| Dossier / fichier | Rôle |
| --- | --- |
| `site/` | Le site publié, tel quel |
| `site/index.html` | Page d'accueil |
| `site/fr/page/…` | Pages (à propos, formations, contact, CGV…) |
| `site/fr/collection/…` | Fiches formation |
| `site/fr/actuality/…` | Articles du journal |
| `site/media/…` | Images et documents PDF |
| `site/assets/…` | Styles, polices et scripts |
| `site/assets/site/forms.js` | Envoi des formulaires |
| `wrangler.jsonc` | Réglages de l'hébergement Cloudflare Workers |
| `site/_headers`, `site/_redirects` | En-têtes et réécriture de la racine (Cloudflare) |
| `CLAUDE.md` | Règles de travail lues par l'agent Claude (branche unique `main`) |
| `netlify.toml` | Réglages de l'hébergement Netlify |
| `scripts/` | Outils qui ont servi à la copie et aux contrôles |

Les adresses des pages sont **identiques** à celles de l'ancien site
(ex. `/fr/page/a-propos.27551.html`), pour conserver le référencement Google.

## Formulaires

Le formulaire « Contactez-nous » et le bloc « Abonnez-vous à notre newsletter » sont
traités par **Netlify Forms** (formulaires `contact` et `newsletter`).
Pour recevoir les messages par e-mail, dans Netlify :
*Site configuration > Forms > Form notifications > Add notification > Email notification*,
adresse **bonjour@insaho.fr**, à faire pour chacun des deux formulaires (ou « Any form »).

## Mise en ligne (Cloudflare Workers)

Les réglages sont dans `wrangler.jsonc` : le site statique du dossier `site/` est publié tel quel,
avec les mêmes adresses en `.html` que l'ancien site.

Dans Cloudflare, *Workers & Pages > le Worker > Settings > Build* :
- **Branche de production** : `main`
- **Build command** : vide
- **Deploy command** : `npx wrangler deploy`
- **Root directory** : `/`

Le champ `name` de `wrangler.jsonc` doit être identique au nom du Worker dans Cloudflare.
Les formulaires (Netlify Forms) ne fonctionnent pas sur Cloudflare.

## Mise en ligne (Netlify)

1. Créer un compte sur https://app.netlify.com puis *Add new site > Import an existing project*.
2. Choisir GitHub, puis ce dépôt. Les réglages sont lus dans `netlify.toml` : aucune option à changer.
3. Une fois le site déployé, *Domain management > Add a domain* : `www.insaho.fr` puis `insaho.fr`,
   et suivre les indications de Netlify pour modifier les DNS chez le registrar du domaine.
4. Activer les notifications e-mail des formulaires (voir ci-dessus).

Chaque modification envoyée sur la branche principale de ce dépôt est mise en ligne automatiquement.

## Aperçu sur GitHub Pages

Le workflow `.github/workflows/github-pages.yml` publie un aperçu à chaque envoi sur
`main`, à l'adresse https://grisbiche.github.io/landing-insaho/.
Prérequis : *Settings > Pages > Build and deployment > Source : GitHub Actions*
(sur un dépôt privé, GitHub Pages demande un abonnement payant ; sinon rendre le dépôt public).
Les formulaires ne fonctionnent pas sur GitHub Pages : ils nécessitent Netlify.

## Tester en local

```bash
python3 -m http.server 8080 -d site
```

puis ouvrir http://localhost:8080 (les formulaires ne fonctionnent qu'une fois sur Netlify).

## Notes

- Les services externes restent ceux de l'ancien site : Calendly, Keyro (espace apprenant),
  Google Analytics / Tag Manager, LinkedIn, Facebook, polices Google.
- La protection anti-spam hCaptcha, liée au serveur Hapi, est remplacée par le filtre anti-spam
  de Netlify Forms.
- 7 fiches formation listées dans l'ancien plan du site renvoyaient déjà une erreur 404 sur
  insaho.fr ; elles ne sont pas reproduites.
