import CashModel from '../models/CashModel.js';
import { verifyToken } from '../utils/jwtUtil.js';

const CashController = {
  async getCash(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      let cash = await CashModel.getCashByUserId(decoded.id);

      // If no record exists, create one with defaults
      if (!cash) {
        await CashModel.createCash(decoded.id, 0);
        cash = await CashModel.getCashByUserId(decoded.id);
      }

      res.status(200).json({ cash });
    } catch (error) {
      console.error('Get cash error:', error);
      res.status(500).json({ error: 'Failed to fetch cash data' });
    }
  },

  async updateCash(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const { total_cash } = req.body;

      if (total_cash === undefined || total_cash === null) {
        return res.status(400).json({ error: 'total_cash is required' });
      }

      if (parseFloat(total_cash) < 0) {
        return res.status(400).json({ error: 'Cash amount cannot be negative' });
      }

      const cash = await CashModel.upsertCash(decoded.id, parseFloat(total_cash));

      res.status(200).json({ message: 'Cash updated successfully', cash });
    } catch (error) {
      console.error('Update cash error:', error);
      res.status(500).json({ error: 'Failed to update cash' });
    }
  }
};

export default CashController;
