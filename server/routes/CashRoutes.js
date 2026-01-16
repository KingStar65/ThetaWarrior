import express from 'express';
import CashController from '../controllers/CashController.js';

const router = express.Router();

// Get user's cash data
router.get('/', CashController.getCash);

// Update user's total cash
router.put('/cash', CashController.updateCash);

export default router;
