# Règles du dépôt landing-insaho

Site vitrine d'Insaho (www.insaho.fr), géré par le service marketing (Grisbiche).

## Branche unique : `main`

- **Tout le travail se fait sur `main`.** Ne pas créer d'autre branche, ne pas ouvrir de pull request.
- Chaque push sur `main` est **mis en ligne automatiquement** par Cloudflare : un push = une publication.
  Vérifier le rendu en local avant de pousser (voir plus bas).
- Avant de modifier : `git pull origin main`. Après : commit avec un message clair en français, puis
  `git push origin main`.
- Ne jamais réécrire l'historique de `main` (pas de `push --force`, pas de `rebase` sur des commits déjà poussés).
- Si l'environnement impose une autre branche de travail, ne pas pousser dessus en silence :
  demander à l'utilisateur, puis reporter le travail sur `main`.

## Structure

- `site/` : le site publié tel quel (HTML statique, aucune étape de build). Tout ce qui est dans
  `site/` est public : n'y mettre aucun document interne ou confidentiel.
- Les adresses des pages (`/fr/page/….12345.html`, `/fr/collection/…`, `/fr/actuality/…`) sont
  identiques à l'ancien site pour le référencement Google : **ne pas renommer ni déplacer une page
  existante**. Une nouvelle page doit aussi être ajoutée à `site/sitemap.xml`.
- Hébergement Cloudflare : `wrangler.jsonc`, `site/_headers`, `site/_redirects`. Ne pas les modifier
  sans demande explicite : une erreur ici met le site hors ligne.
- `scripts/` : outils qui ont servi à la copie du site, pas utilisés pour la mise en ligne.

## Tester en local

```bash
npx wrangler dev
```

puis ouvrir http://localhost:8787 (même comportement que Cloudflare). Vérifier au minimum la page
d'accueil et chaque page modifiée.

## Points d'attention

- Les formulaires (contact, newsletter, `site/assets/site/forms.js`) sont prévus pour Netlify Forms et
  **ne fonctionnent pas sur Cloudflare** tant qu'ils n'ont pas été rebranchés.
- Images : préférer des fichiers légers (WebP/JPEG compressés) dans `site/media/`.
