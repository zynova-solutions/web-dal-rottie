"use client";
import React, { useState, useEffect } from "react";
import CustomersTable, { Customer } from "./CustomersTable";
import { getAllCustomers } from '@/services/customerApi';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      setError('');
      try {
        const res = await getAllCustomers();
        // Use res.data.users as per API response
        type RawCustomer = {
          id?: string;
          _id?: string;
          name?: string;
          fullName?: string;
          email?: string;
          phoneNo?: string;
          phone?: string;
          totalOrders?: number;
          ordersCount?: number;
          orders?: number;
          ltv?: number;
          lastOrderDate?: string;
          status?: string;
        };
        const users = (res.data && Array.isArray((res.data as { users?: RawCustomer[] }).users)) ? (res.data as { users: RawCustomer[] }).users : [];
        const mapped: Customer[] = users.map((c: RawCustomer) => ({
          id: String(c.id || c._id || ''),
          name: String(c.name || c.fullName || '-'),
          email: String(c.email || '-'),
          phone: String(c.phoneNo || c.phone || '-'),
          orders: Number(c.totalOrders || c.ordersCount || c.orders || 0),
          ltv: Number(c.ltv || 0),
          lastOrder: c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleString() : '-',
          status: c.status === 'blocked' ? 'blocked' : 'active',
        }));
        setCustomers(mapped);
      } catch {
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const handleBlock = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "blocked" } : c))
    );
    setProfileId((pid) => (pid === id ? id : pid));
  };
  const handleUnblock = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "active" } : c))
    );
  };
  const handleEdit = (id: string) => {
    setProfileId(id);
  };
  const handleExport = (ids: string[]) => {
    alert("Exporting customers: " + ids.join(", "));
  };
  const handleBack = () => setProfileId(null);

  // Profile view
  if (profileId) {
    const customer = customers.find((c) => c.id === profileId);
    if (!customer) return null;
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-4 mt-4">
        <button className="mb-2 text-xs text-blue-600 hover:underline" onClick={handleBack}>&larr; Back to Customers</button>
        <h2 className="text-lg font-bold mb-2">{customer.name} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${customer.status === 'blocked' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{customer.status === 'blocked' ? 'Blocked' : 'Active'}</span></h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="text-sm text-gray-600">Phone: {customer.phone}</div>
            <div className="text-sm text-gray-600">Email: {customer.email}</div>
            <div className="text-sm text-gray-600">Orders: {customer.orders}</div>
            <div className="text-sm text-gray-600">LTV: €{customer.ltv.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Last Order: {customer.lastOrder}</div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {customer.status === 'active' ? (
              <button className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 text-xs" onClick={() => handleBlock(customer.id)}>Block</button>
            ) : (
              <button className="px-3 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 text-xs" onClick={() => handleUnblock(customer.id)}>Unblock</button>
            )}
            <button className="px-3 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs" onClick={() => alert('Edit customer')}>Edit</button>
          </div>
        </div>
        <div className="border-b mb-2" />
        <div className="flex gap-2 mb-4">
          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">Overview</button>
          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">Orders</button>
          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">Addresses</button>
          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">Notes</button>
          <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">Loyalty</button>
        </div>
        {/* Timeline, quick-create order, etc. */}
        <div className="mb-4">
          <div className="font-semibold mb-1">Timeline</div>
          <div className="text-xs text-gray-500">No recent interactions.</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-1">Quick Actions</div>
          <button
            className={`px-3 py-1 rounded text-xs font-semibold ${customer.status === 'blocked' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
            disabled={customer.status === 'blocked'}
            onClick={() => alert('Create order')}
          >
            Create Order
          </button>
        </div>
        {/* Empty state for no orders */}
        {customer.orders === 0 && (
          <div className="p-4 bg-yellow-50 rounded text-yellow-800 text-xs mt-2">
            This customer has no orders yet. <button className="underline text-yellow-900" disabled={customer.status === 'blocked'} onClick={() => alert('Create order')}>Create their first order</button>
          </div>
        )}
      </div>
    );
  }

  // Table view
  return (
    <div className="max-w-5xl mx-auto mt-4">
      <h1 className="text-xl font-bold mb-4">Customers</h1>
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading customers...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : (
        <CustomersTable
          customers={customers}
          selected={selected}
          onSelect={handleSelect}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
          onEdit={handleEdit}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
