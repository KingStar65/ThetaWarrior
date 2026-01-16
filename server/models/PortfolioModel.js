import { pool } from '../db.js';

const PortfolioModel = {
  async createTrade(userId, tradeData) {
    const {
      stock_ticker,
      trade_type,
      contract_count,
      buy_sell,
      strike_price,
      premium_price,
      fees,
      trade_date,
      expiration_date,
      notes
    } = tradeData;

    const result = await pool.query(
      `INSERT INTO tradedata (
        user_id, stock_ticker, trade_type, contract_count, buy_sell,
        strike_price, premium_price, fees, trade_date, expiration_date, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        userId,
        stock_ticker.toUpperCase(),
        trade_type,
        contract_count,
        buy_sell,
        strike_price,
        premium_price,
        fees || 0,
        trade_date,
        expiration_date,
        notes || null
      ]
    );

    return result.rows[0];
  },

  async getTradesByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM tradedata WHERE user_id = $1 ORDER BY trade_date DESC`,
      [userId]
    );
    return result.rows;
  },

  async getTradeById(tradeId, userId) {
    const result = await pool.query(
      `SELECT * FROM tradedata WHERE id = $1 AND user_id = $2`,
      [tradeId, userId]
    );
    return result.rows[0];
  },

  async updateTrade(tradeId, userId, tradeData) {
    const {
      stock_ticker,
      trade_type,
      contract_count,
      buy_sell,
      strike_price,
      premium_price,
      fees,
      trade_date,
      expiration_date,
      status,
      notes
    } = tradeData;

    const result = await pool.query(
      `UPDATE tradedata SET
        stock_ticker = $1,
        trade_type = $2,
        contract_count = $3,
        buy_sell = $4,
        strike_price = $5,
        premium_price = $6,
        fees = $7,
        trade_date = $8,
        expiration_date = $9,
        status = $10,
        notes = $11
      WHERE id = $12 AND user_id = $13
      RETURNING *`,
      [
        stock_ticker.toUpperCase(),
        trade_type,
        contract_count,
        buy_sell,
        strike_price,
        premium_price,
        fees || 0,
        trade_date,
        expiration_date,
        status || 'open',
        notes || null,
        tradeId,
        userId
      ]
    );

    return result.rows[0];
  },

  async deleteTrade(tradeId, userId) {
    const result = await pool.query(
      `DELETE FROM tradedata WHERE id = $1 AND user_id = $2 RETURNING id`,
      [tradeId, userId]
    );
    return result.rows[0];
  },

  async getOpenTrades(userId) {
    const result = await pool.query(
      `SELECT * FROM tradedata WHERE user_id = $1 AND status = 'open' ORDER BY expiration_date ASC`,
      [userId]
    );
    return result.rows;
  },

  async updateTradeStatus(tradeId, userId, status) {
    const result = await pool.query(
      `UPDATE tradedata SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
      [status, tradeId, userId]
    );
    return result.rows[0];
  }
};

export default PortfolioModel;
