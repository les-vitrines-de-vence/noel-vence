# Essai de Noël des Vitrines de Vence

Version du 17 octobre 2026. Période d’essai : du samedi 17 au mercredi 21 octobre 2026 inclus, à l’heure de Paris.

Le visuel de Noël est conservé. Deux annonces fictives apparaissent chaque jour. Le mardi 20 octobre, une troisième annonce présente la plaisanterie validée pour Artisa Vence : « −100 % sur tout ce qu’il n’y a pas dans le magasin ! », avec le code BERNARD100. Aucun de ces essais ne donne droit à une remise réelle.

La date est vérifiée à l’ouverture, toutes les 5 minutes lorsque la page est visible, au retour sur la page et à minuit. Les vérifications périodiques sont suspendues lorsque l’onglet est masqué.

Chaque visite charge uniquement les offres de la date réelle du serveur. Le nombre de scans, la date du téléphone, les paramètres d’adresse et les cookies ne choisissent pas le jour. Une mention rappelle de conserver et scanner le même QR code chaque jour. Le 22 octobre, les offres disparaissent automatiquement.

## État de livraison

Les fichiers sont préparés et testés localement. Ils ne sont pas publiés sur GitHub. Le compte de l’association reste à créer. La configuration du service de date et le test du lien public doivent être réalisés avant diffusion.

## Mise en ligne sans compilation

Le dossier `docs` contient déjà le site compilé. Il n’est pas nécessaire d’installer Node.js pour le publier.

### 1 Créer le compte et le dépôt GitHub

1. Créer un compte ou une organisation contrôlé par l’association sur https://github.com/.
2. Choisir l’identifiant réel du compte. L’adresse publique dépendra de cet identifiant.
3. Créer un dépôt public nommé, par exemple, `noel-vence`, avec une branche `main`.
4. Déposer à la racine du dépôt le CONTENU de `A_deposer_sur_GitHub`, en conservant les sous-dossiers. Le chemin doit être `docs/index.html` à la racine du dépôt, pas `A_deposer_sur_GitHub/docs/index.html`.
5. Ne pas déposer le dossier séparé `Configuration_privee`.

### 2 Préparer le service de date

Une configuration Cloudflare est nécessaire en complément de GitHub Pages. Le choix d’une offre et les conditions applicables sont à vérifier dans le compte de l’association. Aucun abonnement n’est souscrit par ce dossier.

1. Créer ou utiliser un compte Cloudflare contrôlé par l’association sur https://dash.cloudflare.com/.
2. Dans Workers & Pages, créer un Worker, avec un nom choisi par l’association.
3. Dans l’éditeur de code du Worker, remplacer le programme proposé par tout le contenu de `serveur/worker.mjs`.
4. Publier le Worker.
5. Dans Settings, Variables and Secrets, ajouter une variable de type **Secret**, nommée exactement `OFFRES_JSON`.
6. Copier comme valeur le contenu complet du fichier séparé `Configuration_privee/OFFRES_JSON.txt`. Ne pas copier le nom du fichier : copier son texte JSON complet, depuis le premier `[` jusqu’au dernier `]`.
7. Déployer la configuration.
8. Copier l’adresse réelle du Worker. Ajouter `/api/offres` à la fin. L’adresse aura la forme `https://NOM-DU-WORKER.SOUS-DOMAINE.workers.dev/api/offres`. Ceci est un modèle, pas une adresse existante.
9. Ouvrir cette adresse pour vérifier que le service renvoie la date réelle et seulement les annonces du jour.

Le programme n’a besoin d’aucune base de données. Les visiteurs ne se connectent ni à Cloudflare, ni à GitHub, ni à ChatGPT. L’API est publique et permet uniquement la lecture des annonces du jour. Les réponses ne sont pas conservées en cache.

### 3 Relier le site au service

1. Dans GitHub, ouvrir `docs/config.js`, puis cliquer sur le crayon pour le modifier.
2. Remplacer la chaîne vide après `apiUrl` par l’adresse HTTPS complète copiée à l’étape précédente, avec `/api/offres`.
3. Conserver les guillemets et enregistrer la modification sur `main`.

Exemple de forme uniquement :

```js
window.CALENDRIER_CONFIG = {
  apiUrl: "https://NOM-DU-WORKER.SOUS-DOMAINE.workers.dev/api/offres"
};
```

Sans cette configuration, le site masque les offres et signale que le service est indisponible. Il n’utilise jamais l’horloge du téléphone comme solution de remplacement.

### 4 Activer GitHub Pages

1. Dans le dépôt, ouvrir **Settings**, puis **Pages**.
2. Sous **Build and deployment**, choisir **Deploy from a branch**.
3. Choisir la branche **main**, puis le dossier **/docs**.
4. Enregistrer et attendre la publication.
5. Ouvrir l’adresse fournie par GitHub Pages. Elle aura normalement la forme `https://IDENTIFIANT.github.io/noel-vence/`. Le nom réel dépend du compte et du dépôt choisis.

Le fichier `.nojekyll` est fourni. Aucun domaine personnalisé n’est nécessaire. Le site utilise des chemins relatifs, compatibles avec l’adresse d’un dépôt GitHub Pages.

### 5 Vérifier avant la réunion du mardi

- Ouvrir le site sur iPhone et Android sans connexion à GitHub ou ChatGPT.
- Vérifier la lisibilité, le bouton Copier et le rappel du même QR code.
- Scanner plusieurs fois le même QR : la date et les offres doivent rester identiques.
- Le mardi 20 octobre, vérifier l’annonce Artisa Vence et le code BERNARD100.
- Vérifier qu’une modification de la date du téléphone ne fait pas changer les offres.
- Vérifier une page restée ouverte au passage à minuit et après une mise en veille.
- Couper Internet : après l’échec de la vérification, les offres doivent être masquées.
- Le jeudi 22 octobre, vérifier le message de fin et l’absence de remise utilisable.

Les contrôles automatiques livrés ne remplacent pas ces vérifications réelles. Aucun suivi quotidien automatique n’est activé.

### 6 Créer le QR code

Générer un seul QR code à partir de l’adresse publique finale fournie par GitHub Pages. Tester ce QR depuis une impression réelle avant diffusion. Le QR ne doit pas pointer vers github.com, ni vers les fichiers du dépôt, ni vers l’adresse du Worker.

Texte conseillé à côté du QR :

**Conservez ce QR code. Scannez exactement le même chaque jour pour découvrir les offres du jour.**

## Modifier les annonces

Le calendrier d’essai est conservé uniquement dans le Secret `OFFRES_JSON` du Worker. Le modifier dans Cloudflare, puis déployer. Il doit rester un tableau JSON, avec les champs `id`, `date`, `name`, `offer`, `conditions`, `code`, `test`. Les dates autorisées sont du 17 au 21 octobre 2026 et `test` doit être `true`. La validation refuse les champs requis manquants, les identifiants en double et un même code partagé par deux commerces différents.

Cette livraison est volontairement limitée à l’essai d’octobre. Pour novembre et décembre, adapter la période et retirer la contrainte d’offre fictive uniquement après validation du calendrier correspondant. Les réservations déjà décidées restent Papeterie Multi-Services le 12 décembre 2026 et Galerie de la Pierre le 19 décembre 2026. Aucune remise réelle n’est ajoutée par ce dossier.

## Recompiler après modification du visuel

Le site compilé est dans `docs`. Les sources modifiables sont dans `src`.

Avec Node.js 22.13 ou plus récent installé :

```sh
npm install
npm test
npm run build
```

Après compilation, conserver la bonne adresse dans `docs/config.js`. Envoyer les fichiers modifiés sur GitHub. Le réglage `emptyOutDir: false` préserve `config.js` et `.nojekyll` pendant la compilation.

Pour le Worker, il est aussi possible d’utiliser Wrangler depuis `serveur`, avec `wrangler.jsonc`. Le programme unique `worker.mjs` reste utilisable directement dans l’éditeur Cloudflare.

## Références officielles vérifiées le 17 octobre 2026

- GitHub Pages et publication depuis une branche : https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Nature statique de GitHub Pages : https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Variables secrètes Cloudflare Workers : https://developers.cloudflare.com/workers/configuration/secrets/
