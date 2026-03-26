# CONCEPTION DE LA BASE DE DONNÉES - Botola Pro Inwi

## 1. Choix Technologiques
Le choix s'est porté sur **MySQL 8** en raison de la nature transactionnelle du projet (gestion de stocks de billets, réservations simultanées, historique des paiements). Une base de données relationnelle (SGBDR) garantit l'intégrité référentielle (ACID) essentielle pour une billetterie.

## 2. Structure des Tables

### 2.1 Entités Principales
- **`users`** : Stocke les informations des utilisateurs, clients (Fan) et membres du staff (Admin, Agent). Les mots de passe sont hachés via bcrypt.
- **`stadiums`** : Infrastructures sportives avec leur capacité théorique maximale et leur géolocalisation.
- **`teams`** : Clubs de football de la Botola, reliés à un stade principal.

### 2.2 Entités Transactionnelles
- **`matches`** : Événements sportifs programmés. Lie deux équipes (home_team, away_team) à un `stadium`.
- **`match_zones`** : Configuration détaillée d'un match. Définit les zones disponibles (VIP, Tribune, Populaire), leurs prix respectifs et la capacité allouée (disponibilité).
- **`tickets`** : Billets générés. Lié à l'utilisateur, au match, et à la zone. Contient un `booking_reference` unique et un `qr_code` pour le contrôle d'accès.
- **`payments`** : Traçabilité financière de chaque billet.

### 2.3 Entité de Traçabilité
- **`audit_logs`** : Historique des actions critiques effectuées sur la base de données (ex: Admin qui bloque un compte, modification d'un match). Permet le monitoring et la sécurité.

## 3. Contraintes de Disponibilité (Le problème de l'Overselling)
Pour assurer qu'aucune zone de stade ne soit surréservée :
- Les colonnes `available_seats` dans `match_zones` possèdent une contrainte `CHECK (available_seats >= 0)`.
- Optionnellement, la réservation utilise une transaction avec isolation `SERIALIZABLE` ou une clause `SELECT ... FOR UPDATE` pour verrouiller la ligne de la zone pendant la vérification et la décrémentation des places.

## 4. Indexation et Optimisation
Des index SQL ont été créés pour optimiser les requêtes lourdes :
- Recherche de match par date : `idx_match_date`
- Recherche de billets par utilisateur : `idx_ticket_user`
- Moteur de recherche d'équipes : `idx_team_name`
- Validation des billets : `UNIQUE(qr_code)`, `UNIQUE(booking_reference)`

Le script complet de création de la structure se trouve dans `database/schema.sql`.
Le script de peuplement initial (Seed) se trouve dans `database/seed.sql`.
