/**
 * Service de gestion des stades — Botola Pro Inwi
 * PFE 2024/2025
 */

const { pool } = require('../config/db');

class StadiumService {
  async getAll() {
    const [rows] = await pool.execute('SELECT * FROM stadiums ORDER BY name');
    return rows;
  }

  async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM stadiums WHERE id = ?', [id]);
    if (rows.length === 0) {
      const error = new Error('Stade non trouvé.');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  }

  async getZones(stadiumId) {
    const [rows] = await pool.execute(
      'SELECT * FROM stadium_zones WHERE stadium_id = ? ORDER BY price_multiplier DESC',
      [stadiumId]
    );
    return rows;
  }

  async create(data) {
    const { name, city, address, capacity, image_url, description, map_embed_url, latitude, longitude } = data;
    const [result] = await pool.execute(
      `INSERT INTO stadiums (name, city, address, capacity, image_url, description, map_embed_url, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, city, address || null, capacity || 0, image_url || null, description || null, map_embed_url || null, latitude || null, longitude || null]
    );
    return this.getById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    const allowedFields = ['name', 'city', 'address', 'capacity', 'image_url', 'description', 'map_embed_url', 'latitude', 'longitude'];

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
    await pool.execute(`UPDATE stadiums SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.getById(id);
  }

  async delete(id) {
    const [result] = await pool.execute('DELETE FROM stadiums WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      const error = new Error('Stade non trouvé.');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Stade supprimé avec succès.' };
  }
}

module.exports = new StadiumService();
