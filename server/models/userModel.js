import { pool } from '../db.js';
import * as argon2 from 'argon2';

const UserModel = {
  async createUser(email, password, username) {
    const hash = await argon2.hash(password);
    const result = await pool.query(
      `INSERT INTO userdata (email, password_hash, username) VALUES ($1, $2, $3)RETURNING id, email, username`,
      [email, hash, username]
    );

    return result.rows[0];
  },

  async getUserByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM userdata WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  async getUserByUsername(username) {
    const result = await pool.query(
      `SELECT * FROM userdata WHERE username = $1`,
      [username]
    );
    return result.rows[0];
  },

  async verifyPassword(password, hash) {
    return await argon2.verify(hash, password);
  }
};

export default UserModel;
