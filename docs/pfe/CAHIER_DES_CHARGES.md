# CAHIER DES CHARGES - Botola Pro Inwi

## 1. Contexte du Projet
Dans le but de moderniser l'expérience des supporters du championnat marocain (Botola Pro Inwi), ce projet vise à digitaliser l'ensemble du processus de billetterie. L'application doit remplacer les guichets traditionnels par un système en ligne performant, sécurisé et traçable.

## 2. Spécifications Fonctionnelles

### 2.1 Espace Visiteur
- **Catalogue des Matchs :** Affichage des matchs à venir et passés sous forme de cartes.
- **Filtres de recherche :** Par équipe, par statut (Aujourd'hui, À venir, Terminés).

### 2.2 Espace Supporter (Authentifié)
- **Authentification :** Connexion via Email / Mot de passe.
- **Réservation :** Sélection d'une zone (capacité limitée) et d'une quantité.
- **Paiement :** (Simulation) Validation de la transaction.
- **Génération de Billets :** PDF contenant une référence unique et un QR Code.
- **Historique :** Suivi des billets valides et utilisés.

### 2.3 Espace Administration
- **Dashboard :** Statistiques en temps réel (chiffre d'affaires, évolution des ventes, ventes par zone).
- **Gestion des Stades :** Définir les capacités globales.
- **Gestion des Équipes :** Configurer les clubs avec leurs couleurs et logos.
- **Gestion des Matchs :** Planifier un événement sportif et lui allouer des quotas de billetterie par zone.
- **Scanner de Billets :** Interface permettant la validation (statut USED) des billets à l'entrée du stade.
- **Contrôle d'Accès :** Possibilité de bloquer un utilisateur abusif.

## 3. Spécifications Non-Fonctionnelles (Techniques)
- **Performance :** L'interface doit être une SPA (Single Page Application) assurant des transitions sans rechargement.
- **Sécurité :** 
  - Les mots de passe ne doivent pas être stockés en clair (hash bcrypt).
  - L'API doit être protégée contre les requêtes massives (Rate Limiting).
  - L'accès admin doit être restrictif (RBAC via JWT roles).
- **Intégrité des Données :** Les réservations doivent utiliser des verrous ou transactions SQL pour éviter le surbooking d'une zone (Overselling).
- **Accessibilité :** Design moderne, "Dark Mode" ou "Neon design" fidèle à l'identité visuelle de la Botola.
