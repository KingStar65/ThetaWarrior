import express from 'express';
import PortfolioController from '../controllers/PortfolioController.js';

const router = express.Router();

// Create a new trade
router.post('/trades', PortfolioController.createTrade);

// Get all trades for the authenticated user
router.get('/trades', PortfolioController.getTrades);

// Get only open trades
router.get('/trades/open', PortfolioController.getOpenTrades);

// Get a specific trade by ID
router.get('/trades/:id', PortfolioController.getTrade);

// Update a trade
router.put('/trades/:id', PortfolioController.updateTrade);

// Update trade status only
router.patch('/trades/:id/status', PortfolioController.updateTradeStatus);

// Delete a trade
router.delete('/trades/:id', PortfolioController.deleteTrade);

export default router;
