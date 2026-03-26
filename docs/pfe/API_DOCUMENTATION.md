# DOCUMENTATION DE L'API REST - Botola Pro Inwi

L'API est architecturée autour des principes REST. Le format d'échange est exclusivement en **JSON**.

## 1. Sécurité et Authentification
La plupart des routes nécessitent un token JWT Bearer, passé dans le header HTTP :
`Authorization: Bearer <votre_token_jwt>`

### Codes d'Erreur Standards :
- **200 OK** : Requête réussie.
- **201 Created** : Ressource créée avec succès.
- **400 Bad Request** : Paramètres manquants ou invalides (ex: Places insuffisantes).
- **401 Unauthorized** : Token manquant ou invalide.
- **403 Forbidden** : Rôle insuffisant ou compte bloqué.
- **404 Not Found** : Ressource introuvable.
- **500 Internal Server Error** : Erreur serveur / Base de données.

---

## 2. API Publiques (Sans Token)

### Authentification
- `POST /api/auth/register` : Créer un compte utilisateur (Fan).
  - *Body:* `full_name`, `email`, `password`, `phone`, `cin`
- `POST /api/auth/login` : Connecter un utilisateur et recevoir le token JWT.

### Consultation
- `GET /api/matches/upcoming` : Récupérer les 4 prochains matchs.
- `GET /api/matches` : Lister tous les matchs avec pagination et filtres.
- `GET /api/matches/:id` : Détails d'un match précis et ses zones disponibles.
- `GET /api/teams` : Liste des équipes.
- `GET /api/stadiums` : Liste des stades.
- `GET /api/standings` : Classement de la Botola.

---

## 3. API Protégées (Role: USER)

### Profil
- `GET /api/auth/me` : Obtenir les infos du profil connecté.

### Réservation
- `POST /api/tickets/book` : Réserver un ou plusieurs billets pour un match donné.
  - *Body:* `match_id`, `zone`, `quantity`
- `GET /api/tickets/my` : Obtenir son historique de billets.
- `GET /api/tickets/:id` : Détail d'un billet spécifique.
- `GET /api/tickets/:id/pdf` : Télécharger le billet PDF.
- `PATCH /api/tickets/:id/cancel` : Annuler un billet non utilisé.

---

## 4. API d'Administration (Role: ADMIN)

Toutes ces routes nécessitent que le token appartienne à un utilisateur de rôle `ADMIN`.

### Matchs & Clubs
- `POST /api/matches` : Ajouter un match.
- `DELETE /api/matches/:id` : Supprimer un match.
- `POST /api/teams` : Ajouter une équipe.
- `POST /api/stadiums` : Ajouter un stade.

### Utilisateurs
- `GET /api/users` : Lister tous les utilisateurs.
- `PATCH /api/users/:id/toggle` : Bloquer ou débloquer un compte utilisateur.

### Statistiques
- `GET /api/analytics/overview` : KPIs généraux.
- `GET /api/analytics/sales-data` : Historique des ventes pour graphique.
- `GET /api/analytics/zone-distribution` : Données pour diagramme circulaire.
- `GET /api/analytics/top-matches` : Matchs générant le plus de revenus.

---

## 5. API Agents (Role: AGENT ou ADMIN)
- `PATCH /api/tickets/:id/use` : Scanner et invalider un billet à l'entrée du stade.
