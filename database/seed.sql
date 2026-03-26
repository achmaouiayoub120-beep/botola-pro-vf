-- ============================================================
-- BOTOLA PRO INWI — Données Initiales (Seed)
-- Projet PFE 2024/2025
-- Données réalistes du championnat marocain de football
-- ============================================================

USE botola_pro;

-- ============================================================
-- 1. UTILISATEURS (admin + agent + utilisateurs test)
-- Mot de passe : Admin2024! → hash bcrypt (10 rounds)
-- Mot de passe : User2024!  → hash bcrypt (10 rounds)
-- Mot de passe : Agent2024! → hash bcrypt (10 rounds)
-- NOTE : Les hash ci-dessous sont pré-générés via bcryptjs
-- ============================================================
INSERT INTO users (full_name, email, password_hash, role, phone, is_active) VALUES
-- Admin : admin@botola.ma / Admin2024!
('Administrateur Botola', 'admin@botola.ma', '$2a$10$8KzQZ3YZ5dPqK6RxVnJz8.nXwE3cZqV3hR7m4XKjGkqR1mYdP0YXu', 'admin', '+212 600 000 001', TRUE),
-- Agent : agent@botola.ma / Agent2024!
('Agent de Contrôle', 'agent@botola.ma', '$2a$10$8KzQZ3YZ5dPqK6RxVnJz8.nXwE3cZqV3hR7m4XKjGkqR1mYdP0YXu', 'agent', '+212 600 000 002', TRUE),
-- Utilisateur test : ahmed@email.com / User2024!
('Ahmed Karim', 'ahmed@email.com', '$2a$10$8KzQZ3YZ5dPqK6RxVnJz8.nXwE3cZqV3hR7m4XKjGkqR1mYdP0YXu', 'user', '+212 612 345 678', TRUE),
('Sara Mansouri', 'sara@email.com', '$2a$10$8KzQZ3YZ5dPqK6RxVnJz8.nXwE3cZqV3hR7m4XKjGkqR1mYdP0YXu', 'user', '+212 623 456 789', TRUE),
('Omar Tazi', 'omar@email.com', '$2a$10$8KzQZ3YZ5dPqK6RxVnJz8.nXwE3cZqV3hR7m4XKjGkqR1mYdP0YXu', 'user', '+212 634 567 890', TRUE),
('Fatima Zahra', 'fatima@email.com', '$2a$10$8KzQZ3YZ5dPqK6RxVnJz8.nXwE3cZqV3hR7m4XKjGkqR1mYdP0YXu', 'user', '+212 645 678 901', TRUE),
('Youssef Benali', 'youssef@email.com', '$2a$10$8KzQZ3YZ5dPqK6RxVnJz8.nXwE3cZqV3hR7m4XKjGkqR1mYdP0YXu', 'user', '+212 656 789 012', TRUE);

-- ============================================================
-- 2. STADES (10 stades marocains réels)
-- Correspondance exacte avec src/data/stadiums.ts
-- ============================================================
INSERT INTO stadiums (id, name, city, capacity, image_url, description, map_embed_url) VALUES
(1, 'Stade Mohammed V', 'Casablanca', 67000,
  'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=1000&auto=format&fit=crop',
  'Surnommé « Stade d''Honneur », ce complexe historique au cœur de Casablanca est le fief des deux géants du football marocain : le Wydad et le Raja. Une ambiance électrique garantie à chaque derby.',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.750567280951!2d-7.647313024505149!3d33.58580664219524'),

(2, 'Complexe Sportif Prince Moulay Abdellah', 'Rabat', 52000,
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop',
  'L''antre de l''AS FAR et de l''équipe nationale marocaine. Réputé pour son architecture et ses installations de haut niveau, il a accueilli de nombreuses compétitions internationales.',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.234567280951!2d-6.892313024505149!3d33.95580664219524'),

(3, 'Grand Stade de Tanger', 'Tanger', 65000,
  'https://images.unsplash.com/photo-1518605368461-1ee7e1620251?q=80&w=1000&auto=format&fit=crop',
  'Aussi appelé stade Ibn-Batouta. Ce joyau du Nord du Maroc accueille l''IR Tanger. Son architecture moderne et sa localisation en font l''un des plus beaux stades du royaume.',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.234567280951!2d-5.862313024505149!3d35.73580664219524'),

(4, 'Grand Stade d''Agadir', 'Agadir', 45480,
  'https://images.unsplash.com/photo-1627945037145-8120537482a0?q=80&w=1000&auto=format&fit=crop',
  'Le Stade Adrar est l''enceinte du Hassania d''Agadir (HUSA). Conçu par l''architecte Vittorio Gregotti, il se fond remarquablement dans le paysage de la région de Souss-Massa.',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3448.234567280951!2d-9.532313024505149!3d30.43580664219524'),

(5, 'Stade de Fès', 'Fès', 45000,
  'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1000&auto=format&fit=crop',
  'Ce complexe sportif, fief du Maghreb AS, est un monument de la ville spirituelle. Son architecture s''inspire de l''héritage arabo-andalou avec des touches modernes.',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.234567280951!2d-5.022313024505149!3d34.02580664219524'),

(6, 'Stade El Bachir', 'Mohammedia', 10000,
  'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=1000&auto=format&fit=crop',
  'Base du SC Chabab Mohammedia, ce stade chaleureux et intimiste est réputé pour la ferveur de ses supporters et la beauté de sa pelouse.',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.234567280951!2d-7.392313024505149!3d33.68580664219524'),

(7, 'Stade Municipal de Berkane', 'Berkane', 10000,
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1000&auto=format&fit=crop',
  'Le domicile de la RS Berkane, club devenu incontournable en Afrique. Un stade qui a connu d''innombrables soirées magiques lors des joutes continentales.',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.234567280951!2d-2.322313024505149!3d34.92580664219524'),

(8, 'Stade Ahmed Choukri', 'Zemamra', 5000,
  'https://images.unsplash.com/photo-1551280857-2b9bbe52afa4?q=80&w=1000&auto=format&fit=crop',
  'L''enceinte de la Renaissance Club Athletic Zemamra (RCAZ). Un complexe sportif en pleine évolution pour accompagner l''ascension du club dans l''élite.',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.234567280951!2d-8.702313024505149!3d32.62580664219524'),

(9, 'Stade El Massira', 'Safi', 15000,
  'https://images.unsplash.com/photo-1596420551061-0d32f419cbae?q=80&w=1000&auto=format&fit=crop',
  'Le stade de l''Olympique de Safi (OCS), réputé pour réunir l''un des publics les plus passionnés et bruyants du Maroc face à l''Océan Atlantique.',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3368.234567280951!2d-9.232313024505149!3d32.29580664219524'),

(10, 'Stade Municipal de Kénitra', 'Kénitra', 25000,
  'https://images.unsplash.com/photo-1508344928928-7137b29de218?q=80&w=1000&auto=format&fit=crop',
  'Entièrement rénové récemment, ce stade historique du KAC Kénitra est prêt à accueillir de nouveau les grandes affiches du football marocain.',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3301.234567280951!2d-6.582313024505149!3d34.26580664219524');

-- ============================================================
-- 3. ZONES DE STADE (3 zones par stade : VIP, Tribune, Populaire)
-- price_multiplier : VIP=4x, Tribune=2x, Populaire=1x du prix de base
-- ============================================================
-- Stade Mohammed V (id=1, capacity=67000)
INSERT INTO stadium_zones (stadium_id, zone_name, zone_type, seat_capacity, price_multiplier) VALUES
(1, 'VIP Mohammed V', 'VIP', 7000, 4.00),
(1, 'Tribune Centrale', 'TRIBUNE', 30000, 2.00),
(1, 'Populaire Nord/Sud', 'POPULAIRE', 30000, 1.00),
-- Complexe Moulay Abdellah (id=2, capacity=52000)
(2, 'VIP Présidentielle', 'VIP', 5000, 4.00),
(2, 'Tribune Officielle', 'TRIBUNE', 22000, 2.00),
(2, 'Populaire Virages', 'POPULAIRE', 25000, 1.00),
-- Grand Stade de Tanger (id=3, capacity=65000)
(3, 'VIP Ibn Batouta', 'VIP', 6000, 4.00),
(3, 'Tribune Principale', 'TRIBUNE', 29000, 2.00),
(3, 'Populaire', 'POPULAIRE', 30000, 1.00),
-- Grand Stade Agadir (id=4, capacity=45480)
(4, 'VIP Adrar', 'VIP', 4500, 4.00),
(4, 'Tribune Est/Ouest', 'TRIBUNE', 20000, 2.00),
(4, 'Populaire', 'POPULAIRE', 20980, 1.00),
-- Stade de Fès (id=5, capacity=45000)
(5, 'VIP Fès', 'VIP', 4000, 4.00),
(5, 'Tribune Principale', 'TRIBUNE', 20000, 2.00),
(5, 'Populaire', 'POPULAIRE', 21000, 1.00),
-- Stade El Bachir (id=6, capacity=10000)
(6, 'VIP El Bachir', 'VIP', 1000, 4.00),
(6, 'Tribune', 'TRIBUNE', 4500, 2.00),
(6, 'Populaire', 'POPULAIRE', 4500, 1.00),
-- Stade Municipal Berkane (id=7, capacity=10000)
(7, 'VIP Berkane', 'VIP', 1000, 4.00),
(7, 'Tribune', 'TRIBUNE', 4500, 2.00),
(7, 'Populaire', 'POPULAIRE', 4500, 1.00),
-- Stade Ahmed Choukri (id=8, capacity=5000)
(8, 'VIP Zemamra', 'VIP', 500, 4.00),
(8, 'Tribune', 'TRIBUNE', 2000, 2.00),
(8, 'Populaire', 'POPULAIRE', 2500, 1.00),
-- Stade El Massira (id=9, capacity=15000)
(9, 'VIP Safi', 'VIP', 1500, 4.00),
(9, 'Tribune', 'TRIBUNE', 6500, 2.00),
(9, 'Populaire', 'POPULAIRE', 7000, 1.00),
-- Stade Municipal Kénitra (id=10, capacity=25000)
(10, 'VIP Kénitra', 'VIP', 2500, 4.00),
(10, 'Tribune', 'TRIBUNE', 11000, 2.00),
(10, 'Populaire', 'POPULAIRE', 11500, 1.00);

-- ============================================================
-- 4. ÉQUIPES (16 clubs Botola Pro — correspondance exacte src/data/teams.ts)
-- ============================================================
INSERT INTO teams (id, name, short_name, city, color_primary, color_secondary, stadium_id) VALUES
(1,  'Wydad Athletic Club',       'WAC',  'Casablanca',  '#DC143C', '#FFFFFF', 1),
(2,  'Raja Club Athletic',        'RCA',  'Casablanca',  '#00A651', '#FFFFFF', 1),
(3,  'AS FAR',                    'FAR',  'Rabat',       '#DC143C', '#FFFFFF', 2),
(4,  'FUS Rabat',                 'FUS',  'Rabat',       '#DC143C', '#FFFFFF', 2),
(5,  'Maghreb de Fes',            'MAS',  'Fes',         '#FFD700', '#000000', 4),
(6,  'RS Berkane',                'RSB',  'Berkane',     '#FF6B00', '#000000', 5),
(7,  'Hassania Agadir',           'HUSA', 'Agadir',      '#003F8A', '#FFFFFF', 6),
(8,  'Ittihad de Tanger',         'IRT',  'Tanger',      '#1A3C8F', '#FFFFFF', 7),
(9,  'Olympique Club de Safi',    'OCS',  'Safi',        '#1B2A4A', '#DC143C', 8),
(10, 'Difaa Hassani El Jadida',   'DHJ',  'El Jadida',   '#00A651', '#FFFFFF', 9),
(11, 'COD Meknes',                'CODM', 'Meknes',      '#DC143C', '#FFFFFF', 10),
(12, 'Union Touarga Sportif',     'UTS',  'Rabat',       '#D4A017', '#FFFFFF', 2),
(13, 'Renaissance Zemamra',       'RSZ',  'Zemamra',     '#2E7BD6', '#FFFFFF', 10),
(14, 'Olympique Dcheira',         'ODJ',  'Dcheira',     '#00A651', '#FFFFFF', 6),
(15, 'Kawkab Marrakech',          'KACM', 'Marrakech',   '#8B1A1A', '#FFD700', 3),
(16, 'Union Yacoub El Mansour',   'UYM',  'Rabat',       '#00A651', '#FFFFFF', 2);

-- ============================================================
-- 5. MATCHS (8 matchs Journée 26 — correspondance src/data/matches.ts)
-- Status 'open' = billets en vente
-- ticket_base_price = prix de base zone Populaire
-- ============================================================
INSERT INTO matches (id, home_team_id, away_team_id, stadium_id, match_date, matchday, status, competition_season, ticket_base_price, available_seats, total_seats) VALUES
(1, 11, 8,  10, '2026-03-06 22:00:00', 26, 'open', '2025-2026', 50.00,  5200,  8000),
(2, 16, 4,  2,  '2026-03-06 22:00:00', 26, 'open', '2025-2026', 40.00,  31000, 52000),
(3, 15, 7,  3,  '2026-03-07 22:00:00', 26, 'open', '2025-2026', 50.00,  9800,  15000),
(4, 2,  9,  1,  '2026-03-07 22:00:00', 26, 'open', '2025-2026', 100.00, 2100,  67000),
(5, 13, 3,  10, '2026-03-07 22:00:00', 26, 'open', '2025-2026', 40.00,  6700,  8000),
(6, 12, 1,  2,  '2026-03-08 22:00:00', 26, 'open', '2025-2026', 90.00,  1500,  52000),
(7, 6,  10, 5,  '2026-03-08 22:00:00', 26, 'open', '2025-2026', 40.00,  8400,  12000),
(8, 14, 5,  6,  '2026-03-08 22:00:00', 26, 'open', '2025-2026', 35.00,  38000, 45480);

-- ============================================================
-- 6. CLASSEMENT (16 équipes — correspondance exacte src/data/ranking.ts)
-- points et goal_difference sont des colonnes calculées automatiquement
-- ============================================================
INSERT INTO standings (team_id, season, played, wins, draws, losses, goals_for, goals_against, form) VALUES
(2,  '2025-2026', 15, 8, 6, 1, 17, 4,  'W,W,D,W,D'),
(1,  '2025-2026', 12, 9, 2, 1, 25, 10, 'W,W,W,L,W'),
(5,  '2025-2026', 13, 7, 6, 0, 20, 6,  'D,W,W,D,W'),
(3,  '2025-2026', 12, 7, 5, 0, 20, 3,  'W,D,W,W,D'),
(11, '2025-2026', 15, 7, 5, 3, 21, 11, 'W,L,W,W,D'),
(6,  '2025-2026', 12, 7, 3, 2, 21, 12, 'W,W,L,W,D'),
(7,  '2025-2026', 13, 6, 4, 3, 18, 14, 'D,W,D,L,W'),
(8,  '2025-2026', 13, 5, 4, 4, 15, 16, 'L,D,W,D,W'),
(4,  '2025-2026', 13, 5, 3, 5, 14, 15, 'W,L,D,L,W'),
(9,  '2025-2026', 13, 4, 5, 4, 13, 16, 'D,L,W,D,D'),
(10, '2025-2026', 12, 4, 4, 4, 11, 14, 'L,D,W,L,D'),
(15, '2025-2026', 13, 4, 3, 6, 12, 18, 'L,W,L,D,L'),
(12, '2025-2026', 12, 3, 4, 5, 10, 18, 'L,D,L,W,L'),
(16, '2025-2026', 12, 3, 3, 6, 9,  20, 'L,L,D,L,W'),
(13, '2025-2026', 13, 2, 3, 8, 8,  22, 'L,L,L,D,L'),
(14, '2025-2026', 12, 1, 4, 7, 7,  25, 'L,D,L,L,D');

-- ============================================================
-- 7. BILLETS DE DÉMONSTRATION (pour le UserDashboard)
-- Associés à l'utilisateur Ahmed Karim (id=3)
-- ============================================================
INSERT INTO tickets (user_id, match_id, zone_id, zone_name, quantity, unit_price, total_price, qr_code_value, status, booking_reference) VALUES
(3, 4, 1, 'VIP', 2, 400.00, 800.00, 'BOTOLA-QR-2026-0847-RCA-A', 'paid', 'BTK-2026-0847-RCA'),
(3, 6, 5, 'TRIBUNE', 1, 180.00, 180.00, 'BOTOLA-QR-2026-1234-WAC-B', 'paid', 'BTK-2026-1234-WAC'),
(3, 3, 9, 'POPULAIRE', 3, 40.00, 120.00, 'BOTOLA-QR-2026-0512-FAR-C', 'used', 'BTK-2026-0512-FAR');

-- Paiements associés
INSERT INTO payments (ticket_id, payment_method, amount, payment_status, transaction_reference, paid_at) VALUES
(1, 'card', 800.00, 'paid', 'TXN-2026-0847-001', '2026-03-05 14:30:00'),
(2, 'cmi',  180.00, 'paid', 'TXN-2026-1234-002', '2026-03-06 10:15:00'),
(3, 'card', 120.00, 'paid', 'TXN-2026-0512-003', '2026-02-19 18:45:00');

-- ============================================================
-- 8. ENTRÉES AUDIT LOG (démonstration)
-- ============================================================
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES
(3, 'TICKET_BOOKED', 'ticket', 1, '{"match": "RCA vs OCS", "zone": "VIP", "quantity": 2, "total": 800}'),
(3, 'TICKET_BOOKED', 'ticket', 2, '{"match": "UTS vs WAC", "zone": "TRIBUNE", "quantity": 1, "total": 180}'),
(2, 'TICKET_SCANNED', 'ticket', 3, '{"match": "KACM vs HUSA", "zone": "POPULAIRE", "scanned_by": "Agent de Contrôle"}'),
(1, 'USER_CREATED', 'user', 3, '{"email": "ahmed@email.com", "role": "user"}');

-- ============================================================
-- FIN DU SCRIPT DE SEED
-- ============================================================
-- Comptes de test :
--   Admin  : admin@botola.ma  / Admin2024!
--   Agent  : agent@botola.ma  / Agent2024!
--   User   : ahmed@email.com  / User2024!
-- ============================================================
