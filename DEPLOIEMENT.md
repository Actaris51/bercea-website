# Guide de déploiement — Bercea Website

Ce guide vous accompagne de A à Z pour mettre en ligne `bercea.app` avec une adresse email `contact@bercea.fr`, pour un coût total d'environ **21 €/an** (domaine `.app` + domaine `.fr`).

> 💡 **Pourquoi `.app` + `.fr`** — Le `.app` est un TLD officiel de Google pour les apps mobiles/web, il impose HTTPS automatiquement (préchargé HSTS) → c'est notre site principal. Le `.fr` sert de redirection + support email pro (MX Plan OVH gratuit garanti sur `.fr`) + protection de la marque française.

## Résumé
- **Domaine principal** : `bercea.app` chez OVH (~14 €/an)
- **Domaine secondaire** : `bercea.fr` chez OVH (~7 €/an) — redirection + email
- **Email pro** : `contact@bercea.fr` via MX Plan 1 d'OVH (**gratuit inclus**)
- **Hébergement du site** : Cloudflare Pages (**gratuit**, HTTPS automatique)
- **Coût total année 1** : ~21 €
- **Coût annuel récurrent** : ~21 € (renouvellement des 2 domaines, le reste restant gratuit)

---

## Étape 1 — Acheter le domaine chez OVH

1. Rendez-vous sur <https://www.ovhcloud.com/fr/domains/>
2. Tapez `bercea.app` dans le champ de recherche et cliquez sur **Rechercher**.
3. Si disponible (très probable), ajoutez-le au panier.
4. Dans les options à l'achat :
   - **Décochez** les options payantes (DNSSEC n'est pas indispensable au démarrage)
   - **Gardez** le *Whois Anonymity* (gratuit, masque vos infos personnelles)
5. Créez un compte OVH si vous n'en avez pas, puis payez (~14 €).
6. Validez l'email de confirmation pour activer le domaine.

> ⚠️ Vérifiez bien l'orthographe : `bercea.app` (b-e-r-c-e-a, puis extension `.app`).

---

## Étape 2 — Activer l'email `contact@bercea.fr`

> ⚠️ **Important** : OVH a supprimé son ancienne offre gratuite "MX Plan 1" (2 boîtes 5 Go). Les seules offres email complètes disponibles sont désormais **payantes** : MX 5 à partir de **6 € TTC/an**. Nous avons choisi la **voie gratuite via redirection** pour le lancement.

### 2.1 Configuration actuelle (redirection gratuite) ✅ **Setup actif**

Quand OVH crée un domaine `.fr`, il configure automatiquement une offre **"redirect"** gratuite qui permet de créer des redirections email simples (sans boîte mail complète). C'est parfait pour un lancement MVP.

**Ce qui est configuré** :
- Domaine : `bercea.fr`
- Offre email : **redirect** (gratuit)
- Redirection active : `contact@bercea.fr` → `julien.duval.patrimoine@gmail.com`
- Quota redirections : 1 / 1000 utilisé

**Étapes de mise en place dans OVH** (déjà faites mais documentées pour référence) :
1. Espace client OVH → **Web Cloud** → **Emails** → cliquez sur `bercea.fr`
2. Onglet **Emails** → **Gestion des redirections**
3. Cliquez **Ajouter une redirection**
4. Formulaire :
   - **De l'adresse** : `contact`
   - **Sous-domaine** : (vide)
   - **Domaine** : `bercea.fr` (pré-sélectionné)
   - **Vers l'adresse** : `julien.duval.patrimoine@gmail.com`
   - **Option de copie** : *Ne pas conserver de copie du mail* (obligatoire en offre "redirect")
5. Cliquez **Valider**

### 2.2 Ce que ça permet (et ne permet pas)

| Fonction | État |
|---|---|
| Recevoir des emails sur `contact@bercea.fr` | ✅ Oui — arrivent instantanément dans votre Gmail perso |
| Envoyer depuis `contact@bercea.fr` | ❌ Non — nécessite un vrai serveur SMTP (payant) |
| Interface webmail dédiée | ❌ Non — vous utilisez Gmail comme interface |
| Storage / archivage chez OVH | ❌ Non — Gmail est le seul point de stockage |

### 2.3 Test de réception

1. Depuis votre Gmail perso (ou téléphone), envoyez un email à `contact@bercea.fr` avec pour objet "Test Bercea"
2. Attendez 30 s à 2 min
3. L'email doit arriver dans la boîte de réception de `julien.duval.patrimoine@gmail.com`

**Si l'email n'arrive pas après 5 min** : vérifier que les enregistrements MX dans la zone DNS OVH de `bercea.fr` sont bien configurés (mx1/mx2/mx3.mail.ovh.net).

### 2.4 Upgrade futur vers MX 5 (6 € TTC/an) — optionnel

Quand vous voudrez pouvoir **envoyer** depuis `contact@bercea.fr` (réponses aux clients, emails sortants apparaissant en "Bercea"), il faudra upgrader :

1. OVH → **Web Cloud** → **Emails** → `bercea.fr` → bouton **...** à côté de "Offre: redirect" → **Changer d'offre**
2. Sélectionnez **MX 5** (5 comptes, 5 Go chacun — 6 € TTC/an)
3. Validez et payez
4. Une fois actif, créez le compte `contact@bercea.fr` (vrai compte avec mot de passe)
5. Configurez Gmail "Send As" avec SMTP `ssl0.ovh.net` port 465 SSL

**Pourquoi ne pas le faire maintenant** : 6 €/an est négligeable mais pas strictement nécessaire au lancement. Vous pouvez l'ajouter plus tard sans impact sur la redirection existante (vous changerez l'offre, pas le DNS).

---

## Étape 3 — Héberger le site sur Cloudflare Pages (gratuit)

Cloudflare Pages héberge gratuitement le site statique, avec HTTPS automatique et un CDN mondial.

### Option A — Déploiement direct (glisser-déposer)
1. Créez un compte sur <https://dash.cloudflare.com/sign-up>
2. Menu gauche → **Workers & Pages** → **Create application** → onglet **Pages** → **Upload assets**.
3. Nom du projet : `bercea-website`
4. Glissez-déposez **tout le contenu du dossier** `C:\Users\julie\Documents\Claude\Lumi Website\` (pas le dossier lui-même, son contenu). Note : le dossier est encore nommé "Lumi Website" sur votre disque — vous pouvez le renommer manuellement en "Bercea Website" si vous voulez, mais ce n'est pas obligatoire.
5. Cliquez **Deploy site**. En ~30 s, le site est en ligne sur `bercea-website.pages.dev`.

### Option B — Via GitHub (recommandé si vous voulez versionner)
1. Créez un repo GitHub `bercea-website`, poussez-y le contenu du dossier.
2. Sur Cloudflare Pages → **Create application** → **Connect to Git** → sélectionnez le repo.
3. Build settings : **aucun build** (site statique), laissez tout vide, puis **Save and Deploy**.

---

## Étape 4 — Connecter `bercea.app` à Cloudflare Pages

1. Dans votre projet Cloudflare Pages → onglet **Custom domains** → **Set up a custom domain**.
2. Entrez `bercea.app`. Cloudflare affiche les enregistrements DNS à ajouter.
3. Retournez dans **OVH** → **Domaines** → `bercea.app` → onglet **Zone DNS**.
4. Ajoutez les enregistrements indiqués par Cloudflare (généralement un CNAME pour `www` et des entrées pour l'apex).
5. ⚠️ **Attention** : NE touchez PAS aux enregistrements **MX** (email). Cloudflare ne modifie que les entrées A/AAAA/CNAME.
6. Répétez pour `www.bercea.app` pour rediriger vers l'apex.
7. La propagation DNS prend de quelques minutes à 24 h. Une fois active, le site est en ligne en HTTPS.

> 💡 Alternative plus simple : transférer la gestion DNS du domaine à Cloudflare (Cloudflare devient votre nameserver). OVH garde la propriété du domaine, Cloudflare gère tout. Dans ce cas, ajoutez les MX OVH dans Cloudflare pour conserver l'email.

---

## Étape 5 — Tests finaux

Une fois en ligne, vérifiez :

- [ ] <https://bercea.app> → redirige vers `/fr/`
- [ ] <https://bercea.app/en/> s'affiche correctement
- [ ] Le switch FR/EN fonctionne
- [ ] Les images (screenshots, couvertures ebooks) se chargent
- [ ] Le formulaire contact ouvre le client mail avec `contact@bercea.fr`
- [ ] Envoi de test vers `contact@bercea.fr` → bien reçu
- [ ] Mobile responsive OK (outils de dev Chrome)
- [ ] <https://bercea.app/sitemap.xml> accessible
- [ ] <https://bercea.app/robots.txt> accessible

---

## Étape 6 — Mises à jour futures

### Mettre à jour le nom et l'email dans l'app elle-même
L'app mobile s'appelle encore **Lumi** dans son code source (dossier `C:\Users\julie\Documents\Claude\Lumi\`) et ses fiches stores. Avant publication officielle, il faudra :
- Renommer le projet Expo : `app.json` → `"name": "Bercea"`, `"slug": "bercea-baby-sleep"`, bundle IDs
- Remplacer `contact@lumi-app.fr` par `contact@bercea.fr` dans :
  - `C:\Users\julie\Documents\Claude\Lumi\assets\store\google_play_listing.md` → ligne 52
  - `C:\Users\julie\Documents\Claude\Lumi\assets\store\app_store_listing.md` (à vérifier)
- Refaire les screenshots marketing avec le nouveau nom affiché
- Regénérer l'icône et le splash screen avec le nouveau logo Bercea

### Quand l'app sera publiée
Dans toutes les pages HTML, remplacez :
- `Bientôt sur App Store & Google Play` par des vrais boutons de téléchargement
- `href="fonctionnalites.html"` pour le CTA principal par les liens stores
- La section "App Store & Google Play → Publication prévue prochainement" dans `contact.html`

### Quand les ebooks seront en ligne
Dans `fr/ebooks.html` et `en/ebooks.html`, remplacez les `<span class="store-chip placeholder">` par des vrais `<a>` vers les pages produit Amazon/Kobo/Apple Books.

---

## Récap des fichiers du site

```
Bercea Website/
├── index.html              → redirection auto FR/EN
├── robots.txt
├── sitemap.xml
├── DEPLOIEMENT.md          → ce fichier
├── fr/
│   ├── index.html
│   ├── fonctionnalites.html
│   ├── science.html
│   ├── ebooks.html
│   └── contact.html
├── en/
│   ├── index.html
│   ├── features.html
│   ├── science.html
│   ├── ebooks.html
│   └── contact.html
└── assets/
    ├── css/styles.css
    ├── js/main.js
    ├── icons/icon.png
    ├── img/screens/        (6 screenshots iPhone)
    └── covers/             (6 couvertures ebooks FR/EN)
```

## Coût total annuel
| Poste | Coût |
|---|---|
| Domaine `bercea.app` chez OVH | ~14 €/an |
| Domaine `bercea.fr` chez OVH | ~7 €/an |
| Email `contact@bercea.fr` (MX Plan 1 OVH) | **gratuit** inclus |
| Hébergement Cloudflare Pages | **gratuit** |
| HTTPS / CDN | **gratuit** |
| **Total récurrent** | **~21 €/an** |
