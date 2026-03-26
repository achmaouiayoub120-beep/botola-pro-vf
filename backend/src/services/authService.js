/**
 * Service d'authentification — Botola Pro Inwi
 * PFE 2024/2025
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

class AuthService {
  /** Inscription d'un nouvel utilisateur */
  async register({ full_name, email, password, phone }) {
    // Vérifier si l'email existe déjà
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      const error = new Error('Un compte avec cet email existe déjà.');
      error.statusCode = 409;
      throw error;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, password_hash, phone || null, 'user']
    );

    return { id: result.insertId, full_name, email, role: 'user' };
  }

  /** Connexion d'un utilisateur */
  async login({ email, password }) {
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, password_hash, role, is_active, phone FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      const error = new Error('Email ou mot de passe incorrect.');
      error.statusCode = 401;
      throw error;
    }

    const user = rows[0];

    if (!user.is_active) {
      const error = new Error('Votre compte a été désactivé. Contactez l\'administrateur.');
      error.statusCode = 403;
      throw error;
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      const error = new Error('Email ou mot de passe incorrect.');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, phone: user.phone },
    };
  }

  /** Récupérer le profil de l'utilisateur connecté */
  async getProfile(userId) {
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, role, phone, is_active, created_at FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) {
      const error = new Error('Utilisateur non trouvé.');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  }

  /** Changer le mot de passe */
  async changePassword(userId, { currentPassword, newPassword }) {
    const [rows] = await pool.execute('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      const error = new Error('Utilisateur non trouvé.');
      error.statusCode = 404;
      throw error;
    }

    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!valid) {
      const error = new Error('Mot de passe actuel incorrect.');
      error.statusCode = 400;
      throw error;
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, userId]);
    return { message: 'Mot de passe modifié avec succès.' };
  }
}

module.exports = new AuthService();
