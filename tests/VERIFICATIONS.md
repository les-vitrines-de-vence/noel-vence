# Vérifications de la livraison

Date : 17 octobre 2026.

- 20 tests automatisés du service passent.
- Les cinq journées du 17 au 21 octobre sont couvertes.
- L’annonce Artisa Vence est présente uniquement le 20 octobre.
- Cent requêtes répétées n’avancent pas la journée.
- Les paramètres de date, cookies et en-têtes clients sont ignorés.
- La bascule à minuit est vérifiée en heure de Paris, avec prise en compte de l’heure d’été.
- Les offres sont absentes avant et après l’essai.
- Les codes des autres journées sont absents de la réponse du jour.
- Les erreurs de configuration retournent une indisponibilité, sans publier d’offres.
- Les réponses API interdisent le cache et autorisent la lecture depuis GitHub Pages.
- Le code TypeScript du site passe la vérification.
- La compilation Vite produit les fichiers statiques dans docs.

Ces contrôles utilisent des dates injectées uniquement dans les tests de développement. Le service public n’offre aucun moyen de choisir une autre date. L’horloge réelle du serveur est utilisée en production.

Non effectués : création des comptes de l’association, publication GitHub Pages, déploiement du Worker dans le compte de l’association, tests visuels dans un navigateur et scans sur téléphones réels.
