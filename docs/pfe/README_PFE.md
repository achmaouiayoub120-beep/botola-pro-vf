# BOTOLA PRO INWI - SYSTÈME DE GESTION DE BILLETTERIE

**Projet de Fin d'Études (PFE)**

## 1. Titre du Projet
**Développement d'une plateforme Full-Stack de réservation et de gestion de billetterie sportive pour la Botola Pro Inwi.**

## 2. Objectif Principal
Concevoir et développer une application web moderne (SPA) offrant une expérience utilisateur fluide pour l'achat de billets de matchs de football, tout en fournissant un panneau d'administration complet pour la gestion des événements, des utilisateurs et la validation des billets (QR Code).

## 3. Technologies Utilisées
L'architecture logicielle repose sur une stack moderne MERN/PERN :
- **Frontend :** React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Recharts
- **Backend :** Node.js, Express.js
- **Base de Données :** MySQL 8
- **Sécurité :** JWT (JSON Web Tokens), bcrypt (hachage des mots de passe), Helmet, Express-Validator
- **Génération de Fichiers :** jsPDF (Billets PDF), qrcode (Validation)

## 4. Architecture Globale
Le projet suit une architecture Client/Serveur (API REST) respectant le modèle MVC côté serveur :
- Un frontend déployé via Vite qui consomme les APIs REST.
- Un backend Express qui expose des endpoints sécurisés (`/api/auth`, `/api/tickets`, etc.).
- Une base de données relationnelle MySQL (avec transactions SQL).

## 5. Fonctionnalités Clés
### Côté Utilisateur (Fan) :
- Inscription et authentification sécurisées.
- Consultation du catalogue des matchs (recherche, filtres temporels et par équipes).
- Réservation de billets avec choix des zones (VIP, Tribune, Populaire).
- Tableau de bord personnel (historique des réservations, profil).
- Téléchargement du billet en format PDF généré dynamiquement avec QR Code unique.

### Côté Administrateur :
- Analytics interactif (Revenus, billets vendus, top matchs).
- Gestion des utilisateurs (Blocage/Déblocage).
- Gestion des équipes et des stades (CRUD).
- Gestion complète des matchs (Calendrier, équipe domicile vs extérieur).
- Gestion de la billetterie (Scanning des billets / validation).

## 6. Lancement Local du Projet
Le projet est packagé avec des scripts automatisés `.bat` pour Windows :
1. Lancez `scripts/install-project.bat` pour la première utilisation (installation des dépendances).
2. Vérifiez que MySQL est lancé (XAMPP/WAMP) et la BDD `botola_pro_db` créée.
3. Importez `database/schema.sql` et `database/seed.sql`.
4. Lancez `scripts/start-project.bat` pour démarrer simultanément le Back et le Front.
