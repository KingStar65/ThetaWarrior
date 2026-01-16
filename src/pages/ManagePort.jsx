import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import StockEntry from '../components/StockEntry';

const ManagePort = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [cash, setCash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCash();
  }, []);

  const fetchCash = async () => {
    try {
      const response = await fetch('http://localhost:3070/api/usercash', {
        credentials: 'include'
      });

      if (response.status === 401) {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userLogin'));
        return;
      }

      const data = await response.json();

      if (response.ok && data.cash) {
        setCash(data.cash.total_cash || '');
      }
    } catch (err) {
      console.error('Failed to fetch cash:', err);
    }
  };

  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3070/api/usercash/cash', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ total_cash: parseFloat(cash) || 0 })
      });

      if (response.status === 401) {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userLogin'));
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update cash');
      } else {
        setSuccess('Cash updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Update cash error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-65px)] bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>Manage Your Options Allocation</h1>
      <p className='text-gray-600'>Here you can manage your options allocation.</p>

      {error && <Alert severity="error" className='mt-4 w-full max-w-md'>{error}</Alert>}
      {success && <Alert severity="success" className='mt-4 w-full max-w-md'>{success}</Alert>}

      <div className='mt-6 bg-white rounded-xl shadow-md p-6 w-full max-w-md'>
        <h2 className='text-sm font-medium text-gray-500 uppercase tracking-wide mb-2'>Available Cash</h2>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <span className='text-2xl text-gray-400 mr-1'>$</span>
            {isEditing ? (
              <input
                type="number"
                value={cash}
                onChange={(e) => setCash(e.target.value)}
                placeholder="0.00"
                className='text-3xl font-bold text-gray-800 w-40 border-b-2 border-blue-500 focus:outline-none bg-transparent'
                autoFocus
              />
            ) : (
              <span className='text-3xl font-bold text-gray-800'>
                {cash ? parseFloat(cash).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
              </span>
            )}
          </div>
          <Button
            variant={isEditing ? 'contained' : 'outlined'}
            color={isEditing ? 'primary' : 'success'}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      </div>
      <StockEntry />
      {/* <div className='mt-[50px]'>
        <p className='text-3xl'>Manage individual trades </p>
        <table className='min-w-full border-collapse'>
            <thead className='text-lg border-b border-gray-200 bg-green-300'>
              <tr>
                <th className='px-6 py-3 text-md tracking-wider'>Ticker</th>
                <th className='px-6 py-3 text-md tracking-wider'>Option Type</th>
                <th className='px-6 py-3 text-md tracking-wider'>Strike Price</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              
            </tbody>
        </table>
      </div> */}
    </div>

  )
}

export default ManagePort
