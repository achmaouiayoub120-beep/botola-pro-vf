# GUIDE DE DÉPLOIEMENT ET D'INSTALLATION

## 1. Prérequis pour la Soutenance (Local)
Pour faire tourner le projet de démonstration du PFE sur une machine locale, vous avez besoin de :
- **Node.js** (version 18 ou supérieure recommandée)
- **NPM** ou **Yarn** ou **pnpm**
- **SGBD MySQL** (via XAMPP, WAMP, MAMP, ou un serveur natif MySQL 8)

## 2. Configuration Initiale
### Étape 1 : Base de données
1. Démarrez votre serveur MySQL.
2. Créez une base de données nommée `botola_pro_db` :
   ```sql
   CREATE DATABASE botola_pro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Importez la structure SQL :
   Exécutez le script `database/schema.sql`.
4. Importez les données réelles (Seed) :
   Exécutez le script `database/seed.sql`.

### Étape 2 : Variables d'environnement
1. Dans le dossier racine `backend/`, renommez ou copiez le fichier `.env.example` en `.env`.
2. Ajustez les variables si vos identifiants MySQL locaux diffèrent (Port par défaut = 3306, User = root, Pwd = vide sur XAMPP).
   ```env
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=botola_pro_db
   JWT_SECRET=votre_cle_secrete_pfe_botola_pro_2026_super_secure
   ```

## 3. Lancement Via Scripts Windows Automatisés
Les scripts `.bat` fournis automatisent les dépendances et le lancement du projet.

1. **`scripts/install-project.bat`** : Installe les bibliothèques `node_modules` pour le Frontend et le Backend. À lancer une seule fois.
2. **`scripts/start-project.bat`** : Essentiel pour la démo. Ce script :
   - Ouvre un terminal pour lancer le `Serveur Backend` (API Express - Port 5000).
   - Ouvre un deuxième terminal pour lancer l'application `Frontend React` (Vite Proxy - Port 8090).
   - Lance automatiquement votre navigateur par défaut sur la page d'accueil de Botola Pro Inwi.

## 4. Architecture de Dossiers
```text
/
├── backend/            # Code source du serveur Node/Express
│   ├── src/controllers/
│   ├── src/services/
│   ├── src/routes/
│   └── package.json
├── database/           # Fichiers .SQL de structure et seed
├── docs/               # Documentation UML et PFE
├── scripts/            # Scripts Windows Batch automatisation (.bat)
├── src/                # Code source du Frontend React/Vite
│   ├── components/     # Composants d'UI génériques et layout
│   ├── contexts/       # Contexte React (AuthContext)
│   ├── pages/          # Pages React (Public + User + Admin)
│   ├── services/       # Client Axios et appels API
│   └── data/           # (Déprécié) Anciennes données mockées
├── package.json        # Dépendances du Frontend
└── vite.config.ts      # Config bundler + proxy API local
```

## 5. Comptes de Démonstration
Pour votre soutenance, vous pouvez utiliser ces comptes :
- **SuperAdmin** :
  - Email : `admin@botolapro.ma`
  - MDP : `password123`
- **Utilisateur (Fan)** :
  - Email : `fan@example.com`
  - MDP : `password123`
