"use client";

import React, { useState } from 'react';

// Dummy data for payment types
const paymentData = [
  { type: 'Cash', amount: 1240, count: 32 },
  { type: 'Card', amount: 980, count: 21 },
  { type: 'Online', amount: 540, count: 12 },
  { type: 'UPI', amount: 320, count: 7 },
];

export default function PaymentTypesReport() {
  const [data] = useState(paymentData);
  const totalAmount = data.reduce((sum, p) => sum + p.amount, 0);
  const totalCount = data.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="p-4 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6 text-primary">Payment Types Report</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {data.map((p) => (
          <div key={p.type} className="bg-white rounded-lg shadow p-4 flex flex-col items-center border border-gray-100">
            <div className="text-lg font-semibold text-primary mb-1">{p.type}</div>
            <div className="text-2xl font-bold text-gray-800">€{p.amount}</div>
            <div className="text-xs text-gray-500">{p.count} payments</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="bg-primary text-white rounded-lg px-6 py-4 flex-1 min-w-[180px] text-center">
          <div className="text-lg font-semibold">Total Amount</div>
          <div className="text-3xl font-bold mt-1">€{totalAmount}</div>
        </div>
        <div className="bg-primary text-white rounded-lg px-6 py-4 flex-1 min-w-[180px] text-center">
          <div className="text-lg font-semibold">Total Payments</div>
          <div className="text-3xl font-bold mt-1">{totalCount}</div>
        </div>
      </div>
      <div className="overflow-x-auto rounded border bg-white">
        <table className="min-w-[400px] w-full text-sm">
          <thead>
            <tr className="bg-[#f3e8e8] text-[#7a1313]">
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Count</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.type} className="border-b hover:bg-[#f9fafb]">
                <td className="p-2 font-semibold">{p.type}</td>
                <td className="p-2">€{p.amount}</td>
                <td className="p-2">{p.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
