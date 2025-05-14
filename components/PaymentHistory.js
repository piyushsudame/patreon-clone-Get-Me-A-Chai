'use client';

import { useState, useEffect } from 'react';

export default function PaymentHistory({ username }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`/api/get-payments?username=${encodeURIComponent(username)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }
        
        const data = await response.json();
        setPayments(data.payments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPayments();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-white">Payment History</h2>
        <div className="text-white">Loading payment history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-white">Payment History</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-white">Payment History</h2>
      
      {payments.length === 0 ? (
        <div className="text-white">No payment history found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">From</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b border-slate-700">
                  <td className="py-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="py-2">{payment.name}</td>
                  <td className="py-2">₹{payment.amount}</td>
                  <td className="py-2">{payment.message || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}