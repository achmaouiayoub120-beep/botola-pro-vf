/**
 * Service de gestion des équipes — Botola Pro Inwi
 * PFE 2024/2025
 */

const { pool } = require('../config/db');

class TeamService {
  async getAll() {
    const [rows] = await pool.execute(
      'SELECT t.*, s.name AS stadium_name FROM teams t LEFT JOIN stadiums s ON t.stadium_id = s.id ORDER BY t.name'
    );
    return rows;
  }

  async getById(id) {
    const [rows] = await pool.execute(
      'SELECT t.*, s.name AS stadium_name FROM teams t LEFT JOIN stadiums s ON t.stadium_id = s.id WHERE t.id = ?',
      [id]
    );
    if (rows.length === 0) {
      const error = new Error('Équipe non trouvée.');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  }

  async create(data) {
    const { name, short_name, city, color_primary, color_secondary, stadium_id, logo_url, founded_year, coach_name, description } = data;
    const [result] = await pool.execute(
      `INSERT INTO teams (name, short_name, city, color_primary, color_secondary, stadium_id, logo_url, founded_year, coach_name, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, short_name, city, color_primary || '#000000', color_secondary || '#FFFFFF', stadium_id || null, logo_url || null, founded_year || null, coach_name || null, description || null]
    );
    return this.getById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    const allowedFields = ['name', 'short_name', 'city', 'color_primary', 'color_secondary', 'stadium_id', 'logo_url', 'founded_year', 'coach_name', 'description'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(data[field]);
      }
    }

    if (fields.length === 0) {
      const error = new Error('Aucun champ à mettre à jour.');
      error.statusCode = 400;
      throw error;
    }

    values.push(id);
    await pool.execute(`UPDATE teams SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.getById(id);
  }

  async delete(id) {
    const [result] = await pool.execute('DELETE FROM teams WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      const error = new Error('Équipe non trouvée.');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Équipe supprimée avec succès.' };
  }
}

module.exports = new TeamService();
