import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import axios from 'axios';

const StockEntry = () => {
  const [formData, setFormData] = useState({
    stock_ticker: '',
    trade_type: 'call',
    trade_date: '',
    contract_count: '',
    buy_sell: 'buy',
    strike_price: '',
    premium_price: '',
    expiration_date: '',
    fees: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      'Stock-Ticker': 'stock_ticker',
      'Option-Type': 'trade_type',
      'Trade-Date': 'trade_date',
      'Contract-Quantity': 'contract_count',
      'BuySell': 'buy_sell',
      'Strike-Price': 'strike_price',
      'Premium-Price': 'premium_price',
      'Expiration-Date': 'expiration_date',
      'Fees': 'fees'
    };

    const key = fieldMap[id] || id;
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Basic validation
    if (!formData.stock_ticker || !formData.trade_date || !formData.contract_count ||
        !formData.strike_price || !formData.premium_price || !formData.expiration_date) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        stock_ticker: formData.stock_ticker,
        trade_type: formData.trade_type,
        trade_date: formData.trade_date,
        contract_count: parseInt(formData.contract_count),
        buy_sell: formData.buy_sell,
        strike_price: parseFloat(formData.strike_price),
        premium_price: parseFloat(formData.premium_price),
        expiration_date: formData.expiration_date,
        fees: formData.fees ? parseFloat(formData.fees) : 0
      };

      const response = await axios.post(
        'http://localhost:3070/api/portfolio/trades',
        payload,
        { withCredentials: true }
      );

      setSuccess('Trade entry added successfully!');
      // Reset form
      setFormData({
        stock_ticker: '',
        trade_type: 'call',
        trade_date: '',
        contract_count: '',
        buy_sell: 'buy',
        strike_price: '',
        premium_price: '',
        expiration_date: '',
        fees: ''
      });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userLogin'));
        setError('Session expired. Please log in again.');
      } else {
        setError(err.response?.data?.error || 'Failed to add trade entry');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-6'>
      <div className='w-full max-w-3xl'>
        <h2 className='text-xl font-bold mb-4'>Add Options Entry</h2>

        {error && <Alert severity="error" className='mb-4'>{error}</Alert>}
        {success && <Alert severity="success" className='mb-4'>{success}</Alert>}

        <form className='bg-white p-6 rounded-lg' onSubmit={handleSubmit}>
          <div className='flex justify-center items-start gap-6 flex-wrap'>
            <TextField
              id="Stock-Ticker"
              label="Stock Ticker"
              sx={{width:'140px'}}
              value={formData.stock_ticker}
              onChange={handleChange}
              required
            />
            <TextField
              id="Option-Type"
              select
              label="Option Type"
              value={formData.trade_type}
              onChange={handleChange}
              slotProps={{
                select: {
                  native: true,
                },
              }}
            >
              <option value="call">Call</option>
              <option value="put">Put</option>
            </TextField>

            <TextField
              id='Trade-Date'
              type="date"
              sx={{width:'140px'}}
              helperText="Enter Trade Date"
              value={formData.trade_date}
              onChange={handleChange}
              required
            />

            <TextField
              id="Contract-Quantity"
              label="Quantity"
              type="number"
              sx={{width:'120px'}}
              helperText="Quantity of Contracts"
              value={formData.contract_count}
              onChange={handleChange}
              required
            />
            <TextField
              id="BuySell"
              select
              label="Buy/Sell"
              value={formData.buy_sell}
              onChange={handleChange}
              slotProps={{
                select: {
                  native: true,
                },
              }}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </TextField>
            <TextField
              id="Strike-Price"
              label="Strike Price"
              type="number"
              sx={{width:'100px'}}
              value={formData.strike_price}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
              required
            />
            <TextField
              id="Premium-Price"
              label="Premium Price"
              type="number"
              sx={{width:'120px'}}
              value={formData.premium_price}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
              required
            />
            <TextField
              id='Expiration-Date'
              type="date"
              sx={{width:'140px'}}
              helperText="Enter Expiration Date"
              value={formData.expiration_date}
              onChange={handleChange}
              required
            />
            <TextField
              id="Fees"
              label="Fees"
              type="number"
              sx={{width:'100px'}}
              value={formData.fees}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                },
              }}
            />
          </div>
          <div className='flex justify-center'>
            <button
              type='submit'
              disabled={loading}
              className='mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StockEntry
