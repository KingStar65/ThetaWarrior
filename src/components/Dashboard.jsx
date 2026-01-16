import React, { useState, useEffect } from 'react'
import Pagination from './Pagination'

const Dashboard = () => {
  const [cash, setCash] = useState(0);
  const [collateral, setCollateral] = useState(0);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // trade id to delete
  const [actionLoading, setActionLoading] = useState(null); // trade id being acted on
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cashRes, tradesRes] = await Promise.all([
        fetch('http://localhost:3070/api/usercash', { credentials: 'include' }),
        fetch('http://localhost:3070/api/portfolio/trades', { credentials: 'include' })
      ]);

      const cashData = await cashRes.json();
      const tradesData = await tradesRes.json();

      if (cashRes.status === 401 || tradesRes.status === 401) {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userLogin'));
        return;
      }

      if (cashRes.ok && cashData.cash) {
        setCash(cashData.cash.total_cash || 0);
        setCollateral(cashData.cash.total_collateral || 0);
      }

      if (tradesRes.ok && tradesData.trades) {
        setTrades(tradesData.trades);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calculateAllocation = (tradeCollateral) => {
    const collateralNum = parseFloat(tradeCollateral);
    const cashNum = parseFloat(cash);
    if (isNaN(collateralNum) || isNaN(cashNum) || cashNum <= 0) return '0.00';
    return ((collateralNum / cashNum) * 100).toFixed(2);
  };
  const calculateRemainingCash = (cash, collateral) => {
       const collateralNum = parseFloat(collateral);
       const cashNum = parseFloat(cash);
       return (cashNum - collateralNum).toFixed(2);
  };

  const handleCloseTrade = async (tradeId) => {
    setActionLoading(tradeId);
    try {
      const res = await fetch(`http://localhost:3070/api/portfolio/trades/${tradeId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'closed' })
      });

      if (res.status === 401) {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userLogin'));
        return;
      }

      if (res.ok) {
        fetchData(); // Refresh data to update collateral calculations
      }
    } catch (err) {
      console.error('Failed to close trade:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTrade = async (tradeId) => {
    setActionLoading(tradeId);
    try {
      const res = await fetch(`http://localhost:3070/api/portfolio/trades/${tradeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.status === 401) {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('userLogin'));
        return;
      }

      if (res.ok) {
        setDeleteConfirm(null);
        fetchData(); // Refresh data
      }
    } catch (err) {
      console.error('Failed to delete trade:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Separate open and closed trades
  const openTrades = trades.filter(trade => trade.status === 'open');
  const closedTrades = trades.filter(trade => trade.status !== 'open');

  // Pagination logic for open trades
  const totalPages = Math.ceil(openTrades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOpenTrades = openTrades.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className='h-20 mx-20 max-w-full flex justify-around items-center overflow-hidden mb-6'>
        <div>
          <h1 className='text-4xl'>Cash:
            <span className='text-emerald-500'> ${formatCurrency(cash)}</span>
          </h1>
        </div>
        <div className='text-4xl'>Total Collateral:
          <span className='text-red-700'> ${formatCurrency(collateral)}</span>
        </div>
        <div className='text-4xl'>Remaining Cash:
          <span className='text-amber-500'> ${formatCurrency(calculateRemainingCash(cash, collateral))}</span>
        </div>
      </div>

      <div className='mx-30'>
        <h1 className='text-center text-2xl font-semibold mb-4'>Portfolio Breakdown</h1>

        {loading ? (
          <p className='text-center text-gray-500'>Loading trades...</p>
        ) : trades.length === 0 ? (
          <p className='text-center text-gray-500'>No trades yet. Add your first trade to get started!</p>
        ) : (
          <div>
            {/* Open Trades Table */}
            {openTrades.length === 0 ? (
              <p className='text-center text-gray-500 mb-8'>No open trades.</p>
            ) : (
            <>
            <table className='min-w-full divide-y divide-gray-200 border-collapse'>
              <thead className='bg-green-300'>
                <tr className='text-center'>
                  <th className='px-6 py-3 text-xs text-gray-500 uppercase tracking-wider'>Ticker</th>
                  <th className='px-6 py-3 text-xs text-gray-500 uppercase tracking-wider'>Type</th>
                  <th className='px-6 py-3 text-xs text-gray-500 uppercase tracking-wider'>Buy/Sell</th>
                  <th className='px-6 py-3 text-xs text-gray-500 uppercase tracking-wider'>Quantity</th>
                  <th className='px-6 py-3 text-xs text-gray-500 uppercase tracking-wider'>Strike</th>
                  <th className='px-6 py-3 text-xs text-gray-500 uppercase tracking-wider'>Premium</th>
                  <th className='px-6 py-3 text-xs text-gray-500 uppercase tracking-wider'>Collateral</th>
                  <th className='px-6 py-3 text-xs text-gray-500 uppercase tracking-wider'>Expiration</th>
                  <th className='px-6 py-3 text-xs text-gray-500 uppercase tracking-wider'>Allocation %</th>
                  <th className='px-6 py-3 text-xs text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {paginatedOpenTrades.map((trade) => (
                  <tr key={trade.id} className='text-center hover:bg-gray-50'>
                    <td className='px-6 py-4 font-medium text-gray-900'>{trade.stock_ticker}</td>
                    <td className='px-6 py-4 text-gray-500 capitalize'>{trade.trade_type}</td>
                    <td className={`px-6 py-4 font-medium ${trade.buy_sell === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                      {trade.buy_sell.toUpperCase()}
                    </td>
                    <td className='px-6 py-4 text-gray-500'>{trade.contract_count}</td>
                    <td className='px-6 py-4 text-gray-500'>${formatCurrency(trade.strike_price)}</td>
                    <td className='px-6 py-4 text-gray-500'>${formatCurrency(trade.premium_price)}</td>
                    <td className='px-6 py-4 text-gray-500'>${formatCurrency(trade.collateral)}</td>
                    <td className='px-6 py-4 text-gray-500'>{new Date(trade.expiration_date).toLocaleDateString()}</td>
                    <td className='px-6 py-4 text-gray-500'>
                      {trade.buy_sell === 'sell'
                        ? `${calculateAllocation(trade.collateral)}%`
                        : '-'}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex gap-2 justify-center'>
                        <button
                          onClick={() => handleCloseTrade(trade.id)}
                          disabled={actionLoading === trade.id}
                          className='px-3 py-1 text-md font-medium text-blue-400 bg-white rounded-full hover:bg-gray-300 border disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                        >
                          {actionLoading === trade.id ? '...' : 'Close'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(trade.id)}
                          disabled={actionLoading === trade.id}
                          className='px-3 py-1 text-md font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={openTrades.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
            </>
            )}

            {/* Closed Trades Table */}
            {closedTrades.length > 0 && (
              <div className='mt-10'>
                <h2 className='text-center text-xl font-semibold mb-4 text-gray-600'>Closed Trades</h2>
                <table className='min-w-full divide-y divide-gray-300 border-collapse'>
                  <thead className='bg-gray-300'>
                    <tr className='text-center'>
                      <th className='px-6 py-3 text-xs text-gray-600 uppercase tracking-wider'>Ticker</th>
                      <th className='px-6 py-3 text-xs text-gray-600 uppercase tracking-wider'>Type</th>
                      <th className='px-6 py-3 text-xs text-gray-600 uppercase tracking-wider'>Buy/Sell</th>
                      <th className='px-6 py-3 text-xs text-gray-600 uppercase tracking-wider'>Quantity</th>
                      <th className='px-6 py-3 text-xs text-gray-600 uppercase tracking-wider'>Strike</th>
                      <th className='px-6 py-3 text-xs text-gray-600 uppercase tracking-wider'>Premium</th>
                      <th className='px-6 py-3 text-xs text-gray-600 uppercase tracking-wider'>Collateral</th>
                      <th className='px-6 py-3 text-xs text-gray-600 uppercase tracking-wider'>Expiration</th>
                      <th className='px-6 py-3 text-xs text-gray-600 uppercase tracking-wider'>Status</th>
                      <th className='px-6 py-3 text-xs text-gray-600 uppercase tracking-wider'>Actions</th>
                    </tr>
                  </thead>
                  <tbody className='bg-gray-100 divide-y divide-gray-300'>
                    {closedTrades.map((trade) => (
                      <tr key={trade.id} className='text-center hover:bg-gray-200'>
                        <td className='px-6 py-4 font-medium text-gray-700'>{trade.stock_ticker}</td>
                        <td className='px-6 py-4 text-gray-500 capitalize'>{trade.trade_type}</td>
                        <td className={`px-6 py-4 font-medium ${trade.buy_sell === 'buy' ? 'text-green-700' : 'text-red-700'}`}>
                          {trade.buy_sell.toUpperCase()}
                        </td>
                        <td className='px-6 py-4 text-gray-500'>{trade.contract_count}</td>
                        <td className='px-6 py-4 text-gray-500'>${formatCurrency(trade.strike_price)}</td>
                        <td className='px-6 py-4 text-gray-500'>${formatCurrency(trade.premium_price)}</td>
                        <td className='px-6 py-4 text-gray-500'>${formatCurrency(trade.collateral)}</td>
                        <td className='px-6 py-4 text-gray-500'>{new Date(trade.expiration_date).toLocaleDateString()}</td>
                        <td className='px-6 py-4'>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trade.status === 'closed' ? 'bg-gray-300 text-gray-700' : 'bg-red-200 text-red-800'
                          }`}>
                            {trade.status}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <button
                            onClick={() => setDeleteConfirm(trade.id)}
                            disabled={actionLoading === trade.id}
                            className='px-3 py-1 text-md font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Delete Trade</h3>
            <p className='text-gray-600 mb-4'>Are you sure you want to delete this trade? This action cannot be undone.</p>
            <div className='flex gap-3 justify-end'>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTrade(deleteConfirm)}
                disabled={actionLoading}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50'
              >
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
