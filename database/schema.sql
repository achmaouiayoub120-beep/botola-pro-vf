-- ============================================================
-- BOTOLA PRO INWI — Schéma de Base de Données MySQL
-- Projet PFE 2024/2025
-- Système de Gestion du Championnat & Billetterie Sportive
-- ============================================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS botola_pro
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE botola_pro;

-- ============================================================
-- TABLE 1 : UTILISATEURS
-- Stocke les comptes utilisateurs, admins et agents
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'agent') NOT NULL DEFAULT 'user',
  phone VARCHAR(20) DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_active (is_active)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 2 : STADES
-- Enceintes sportives du championnat
-- ============================================================
CREATE TABLE IF NOT EXISTS stadiums (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255) DEFAULT NULL,
  capacity INT NOT NULL DEFAULT 0,
  image_url TEXT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  map_embed_url TEXT DEFAULT NULL,
  latitude DECIMAL(10, 8) DEFAULT NULL,
  longitude DECIMAL(11, 8) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_stadiums_city (city)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 3 : ÉQUIPES
-- Clubs participant au championnat Botola Pro
-- ============================================================
CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  short_name VARCHAR(10) NOT NULL,
  city VARCHAR(100) NOT NULL,
  logo_url TEXT DEFAULT NULL,
  color_primary VARCHAR(7) DEFAULT '#000000',
  color_secondary VARCHAR(7) DEFAULT '#FFFFFF',
  founded_year INT DEFAULT NULL,
  coach_name VARCHAR(100) DEFAULT NULL,
  stadium_id INT DEFAULT NULL,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_teams_city (city),
  INDEX idx_teams_stadium (stadium_id),
  CONSTRAINT fk_teams_stadium FOREIGN KEY (stadium_id) REFERENCES stadiums(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 4 : ZONES DE STADE
-- Zones tarifaires par stade (VIP, Tribune, Populaire, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS stadium_zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stadium_id INT NOT NULL,
  zone_name VARCHAR(50) NOT NULL,
  zone_type ENUM('VIP', 'TRIBUNE', 'POPULAIRE', 'TRIBUNE_NORD', 'TRIBUNE_SUD', 'VIRAGE') NOT NULL DEFAULT 'TRIBUNE',
  seat_capacity INT NOT NULL DEFAULT 0,
  price_multiplier DECIMAL(4, 2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_zones_stadium (stadium_id),
  CONSTRAINT fk_zones_stadium FOREIGN KEY (stadium_id) REFERENCES stadiums(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 5 : MATCHS
-- Rencontres du championnat
-- ============================================================
CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  home_team_id INT NOT NULL,
  away_team_id INT NOT NULL,
  stadium_id INT NOT NULL,
  match_date DATETIME NOT NULL,
  matchday INT DEFAULT NULL,
  status ENUM('scheduled', 'open', 'sold_out', 'live', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  competition_season VARCHAR(20) DEFAULT '2025-2026',
  ticket_base_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  available_seats INT NOT NULL DEFAULT 0,
  total_seats INT NOT NULL DEFAULT 0,
  score_home INT DEFAULT NULL,
  score_away INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_matches_date (match_date),
  INDEX idx_matches_status (status),
  INDEX idx_matches_home (home_team_id),
  INDEX idx_matches_away (away_team_id),
  INDEX idx_matches_stadium (stadium_id),
  INDEX idx_matches_season (competition_season),
  CONSTRAINT fk_matches_home FOREIGN KEY (home_team_id) REFERENCES teams(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_matches_away FOREIGN KEY (away_team_id) REFERENCES teams(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_matches_stadium FOREIGN KEY (stadium_id) REFERENCES stadiums(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_different_teams CHECK (home_team_id <> away_team_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 6 : BILLETS
-- Billets réservés par les utilisateurs
-- ============================================================
CREATE TABLE IF NOT EXISTS tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  match_id INT NOT NULL,
  zone_id INT DEFAULT NULL,
  zone_name VARCHAR(50) NOT NULL DEFAULT 'TRIBUNE',
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  qr_code_value VARCHAR(255) NOT NULL UNIQUE,
  pdf_path VARCHAR(500) DEFAULT NULL,
  status ENUM('reserved', 'paid', 'cancelled', 'used', 'refunded') NOT NULL DEFAULT 'reserved',
  booking_reference VARCHAR(30) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_tickets_user (user_id),
  INDEX idx_tickets_match (match_id),
  INDEX idx_tickets_status (status),
  INDEX idx_tickets_booking_ref (booking_reference),
  INDEX idx_tickets_qr (qr_code_value),
  CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_tickets_match FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_tickets_zone FOREIGN KEY (zone_id) REFERENCES stadium_zones(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT chk_quantity_positive CHECK (quantity > 0),
  CONSTRAINT chk_total_price CHECK (total_price >= 0)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 7 : PAIEMENTS
-- Transactions de paiement associées aux billets
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  payment_method ENUM('card', 'cmi', 'paypal', 'cash') NOT NULL DEFAULT 'card',
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  transaction_reference VARCHAR(100) DEFAULT NULL,
  paid_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_payments_ticket (ticket_id),
  INDEX idx_payments_status (payment_status),
  CONSTRAINT fk_payments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 8 : CLASSEMENT
-- Classement général du championnat
-- ============================================================
CREATE TABLE IF NOT EXISTS standings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  season VARCHAR(20) NOT NULL DEFAULT '2025-2026',
  played INT NOT NULL DEFAULT 0,
  wins INT NOT NULL DEFAULT 0,
  draws INT NOT NULL DEFAULT 0,
  losses INT NOT NULL DEFAULT 0,
  goals_for INT NOT NULL DEFAULT 0,
  goals_against INT NOT NULL DEFAULT 0,
  goal_difference INT GENERATED ALWAYS AS (goals_for - goals_against) STORED,
  points INT GENERATED ALWAYS AS (wins * 3 + draws) STORED,
  form VARCHAR(20) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_standings_team_season (team_id, season),
  INDEX idx_standings_season (season),
  CONSTRAINT fk_standings_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE 9 : JOURNAL D'AUDIT
-- Traçabilité des actions importantes (PFE professionnel)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT DEFAULT NULL,
  details JSON DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_audit_user (user_id),
  INDEX idx_audit_action (action),
  INDEX idx_audit_entity (entity_type, entity_id),
  INDEX idx_audit_date (created_at),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
