/**
 * Service de gestion des matchs — Botola Pro Inwi
 * PFE 2024/2025
 */

const { pool } = require('../config/db');

class MatchService {
  /** Récupérer tous les matchs avec noms des équipes et stade */
  async getAll(filters = {}) {
    let sql = `
      SELECT m.*,
        ht.name AS home_team_name, ht.short_name AS home_team_short, ht.logo_url AS home_team_logo,
        ht.color_primary AS home_color_primary, ht.color_secondary AS home_color_secondary,
        at2.name AS away_team_name, at2.short_name AS away_team_short, at2.logo_url AS away_team_logo,
        at2.color_primary AS away_color_primary, at2.color_secondary AS away_color_secondary,
        s.name AS stadium_name, s.city AS stadium_city, s.capacity AS stadium_capacity
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at2 ON m.away_team_id = at2.id
      JOIN stadiums s ON m.stadium_id = s.id
    `;
    const conditions = [];
    const params = [];

    if (filters.team) {
      conditions.push('(m.home_team_id = ? OR m.away_team_id = ?)');
      params.push(filters.team, filters.team);
    }
    if (filters.stadium) {
      conditions.push('m.stadium_id = ?');
      params.push(filters.stadium);
    }
    if (filters.status) {
      conditions.push('m.status = ?');
      params.push(filters.status);
    }
    if (filters.maxPrice) {
      conditions.push('m.ticket_base_price <= ?');
      params.push(filters.maxPrice);
    }
    if (filters.date) {
      conditions.push('DATE(m.match_date) = ?');
      params.push(filters.date);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY m.match_date ASC';
    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  async getById(id) {
    const [rows] = await pool.execute(`
      SELECT m.*,
        ht.name AS home_team_name, ht.short_name AS home_team_short, ht.logo_url AS home_team_logo,
        ht.color_primary AS home_color_primary, ht.color_secondary AS home_color_secondary,
        at2.name AS away_team_name, at2.short_name AS away_team_short, at2.logo_url AS away_team_logo,
        at2.color_primary AS away_color_primary, at2.color_secondary AS away_color_secondary,
        s.name AS stadium_name, s.city AS stadium_city, s.capacity AS stadium_capacity, s.image_url AS stadium_image
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at2 ON m.away_team_id = at2.id
      JOIN stadiums s ON m.stadium_id = s.id
      WHERE m.id = ?
    `, [id]);

    if (rows.length === 0) {
      const error = new Error('Match non trouvé.');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  }

  async getUpcoming() {
    const [rows] = await pool.execute(`
      SELECT m.*,
        ht.name AS home_team_name, ht.short_name AS home_team_short, ht.logo_url AS home_team_logo,
        ht.color_primary AS home_color_primary, ht.color_secondary AS home_color_secondary,
        at2.name AS away_team_name, at2.short_name AS away_team_short, at2.logo_url AS away_team_logo,
        at2.color_primary AS away_color_primary, at2.color_secondary AS away_color_secondary,
        s.name AS stadium_name, s.city AS stadium_city
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at2 ON m.away_team_id = at2.id
      JOIN stadiums s ON m.stadium_id = s.id
      WHERE m.status IN ('scheduled', 'open') AND m.match_date >= NOW()
      ORDER BY m.match_date ASC
      LIMIT 10
    `);
    return rows;
  }

  async create(data) {
    const { home_team_id, away_team_id, stadium_id, match_date, matchday, status, competition_season, ticket_base_price, available_seats, total_seats } = data;
    const [result] = await pool.execute(
      `INSERT INTO matches (home_team_id, away_team_id, stadium_id, match_date, matchday, status, competition_season, ticket_base_price, available_seats, total_seats)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [home_team_id, away_team_id, stadium_id, match_date, matchday || null, status || 'scheduled', competition_season || '2025-2026', ticket_base_price || 0, available_seats || 0, total_seats || 0]
    );
    return this.getById(result.insertId);
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    const allowedFields = ['home_team_id', 'away_team_id', 'stadium_id', 'match_date', 'matchday', 'status', 'competition_season', 'ticket_base_price', 'available_seats', 'total_seats', 'score_home', 'score_away'];

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
    await pool.execute(`UPDATE matches SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.getById(id);
  }

  async updateStatus(id, status) {
    await pool.execute('UPDATE matches SET status = ? WHERE id = ?', [status, id]);
    return this.getById(id);
  }

  async delete(id) {
    const [result] = await pool.execute('DELETE FROM matches WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      const error = new Error('Match non trouvé.');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Match supprimé avec succès.' };
  }
}

module.exports = new MatchService();
