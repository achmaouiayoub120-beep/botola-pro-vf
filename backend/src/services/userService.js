/**
 * Service de gestion des utilisateurs — Botola Pro Inwi
 * PFE 2024/2025
 */

const { pool } = require('../config/db');

class UserService {
  async getAll() {
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, role, phone, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  async getById(id) {
    const [rows] = await pool.execute(
      'SELECT id, full_name, email, role, phone, is_active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      throw Object.assign(new Error('Utilisateur non trouvé.'), { statusCode: 404 });
    }
    return rows[0];
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    const allowedFields = ['full_name', 'email', 'phone', 'role'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(data[field]);
      }
    }

    if (fields.length === 0) {
      throw Object.assign(new Error('Aucun champ à mettre à jour.'), { statusCode: 400 });
    }

    values.push(id);
    await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.getById(id);
  }

  async toggleStatus(id) {
    const user = await this.getById(id);
    const newStatus = !user.is_active;
    await pool.execute('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, id]);
    return { ...user, is_active: newStatus };
  }

  async delete(id) {
    // Soft delete en désactivant le compte
    await pool.execute('UPDATE users SET is_active = FALSE WHERE id = ?', [id]);
    return { message: 'Utilisateur désactivé avec succès.' };
  }
}

module.exports = new UserService();
