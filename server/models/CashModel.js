import { pool } from '../db.js';

const CashModel = {
  async getCashByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM usercash_view WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  },

  async createCash(userId, totalCash = 0) {
    const result = await pool.query(
      `INSERT INTO usercash (user_id, total_cash)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, totalCash]
    );
    return result.rows[0];
  },

  async updateCash(userId, totalCash) {
    const result = await pool.query(
      `UPDATE usercash SET total_cash = $1 WHERE user_id = $2 RETURNING *`,
      [totalCash, userId]
    );
    return result.rows[0];
  },

  async upsertCash(userId, totalCash) {
    // Insert if not exists, update if exists
    const result = await pool.query(
      `INSERT INTO usercash (user_id, total_cash)
       VALUES ($1, $2)
       ON CONFLICT (user_id)
       DO UPDATE SET total_cash = $2
       RETURNING *`,
      [userId, totalCash]
    );
    return result.rows[0];
  }
};

export default CashModel;
