import PortfolioModel from '../models/PortfolioModel.js';
import { verifyToken } from '../utils/jwtUtil.js';

const PortfolioController = {
  async createTrade(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

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
      } = req.body;

      // Validation
      if (!stock_ticker || !trade_type || !contract_count || !buy_sell ||
          !strike_price || !premium_price || !trade_date || !expiration_date) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!['call', 'put'].includes(trade_type)) {
        return res.status(400).json({ error: 'Invalid trade type. Must be "call" or "put"' });
      }

      if (!['buy', 'sell'].includes(buy_sell)) {
        return res.status(400).json({ error: 'Invalid action. Must be "buy" or "sell"' });
      }

      if (contract_count <= 0) {
        return res.status(400).json({ error: 'Contract count must be greater than 0' });
      }

      if (strike_price <= 0) {
        return res.status(400).json({ error: 'Strike price must be greater than 0' });
      }

      if (premium_price < 0) {
        return res.status(400).json({ error: 'Premium price cannot be negative' });
      }

      const trade = await PortfolioModel.createTrade(decoded.id, {
        stock_ticker,
        trade_type,
        contract_count,
        buy_sell,
        strike_price,
        premium_price,
        fees: fees || 0,
        trade_date,
        expiration_date,
        notes
      });

      res.status(201).json({ message: 'Trade created successfully', trade });
    } catch (error) {
      console.error('Create trade error:', error);
      res.status(500).json({ error: 'Failed to create trade' });
    }
  },

  async getTrades(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const trades = await PortfolioModel.getTradesByUserId(decoded.id);
      res.status(200).json({ trades });
    } catch (error) {
      console.error('Get trades error:', error);
      res.status(500).json({ error: 'Failed to fetch trades' });
    }
  },

  async getTrade(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const { id } = req.params;
      const trade = await PortfolioModel.getTradeById(id, decoded.id);

      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      res.status(200).json({ trade });
    } catch (error) {
      console.error('Get trade error:', error);
      res.status(500).json({ error: 'Failed to fetch trade' });
    }
  },

  async updateTrade(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const { id } = req.params;
      const trade = await PortfolioModel.updateTrade(id, decoded.id, req.body);

      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      res.status(200).json({ message: 'Trade updated successfully', trade });
    } catch (error) {
      console.error('Update trade error:', error);
      res.status(500).json({ error: 'Failed to update trade' });
    }
  },

  async deleteTrade(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const { id } = req.params;
      const result = await PortfolioModel.deleteTrade(id, decoded.id);

      if (!result) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      res.status(200).json({ message: 'Trade deleted successfully' });
    } catch (error) {
      console.error('Delete trade error:', error);
      res.status(500).json({ error: 'Failed to delete trade' });
    }
  },

  async getOpenTrades(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const trades = await PortfolioModel.getOpenTrades(decoded.id);
      res.status(200).json({ trades });
    } catch (error) {
      console.error('Get open trades error:', error);
      res.status(500).json({ error: 'Failed to fetch open trades' });
    }
  },

  async updateTradeStatus(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!['open', 'closed', 'expired'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be "open", "closed", or "expired"' });
      }

      const trade = await PortfolioModel.updateTradeStatus(id, decoded.id, status);

      if (!trade) {
        return res.status(404).json({ error: 'Trade not found' });
      }

      res.status(200).json({ message: 'Trade status updated successfully', trade });
    } catch (error) {
      console.error('Update trade status error:', error);
      res.status(500).json({ error: 'Failed to update trade status' });
    }
  }
};

export default PortfolioController;
