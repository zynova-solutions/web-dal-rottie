import React from "react";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  ltv: number;
  lastOrder: string;
  status: "active" | "blocked";
}

interface CustomersTableProps {
  customers: Customer[];
  selected: string[];
  onSelect: (id: string) => void;
  onBlock: (id: string) => void;
  onUnblock: (id: string) => void;
  onEdit: (id: string) => void;
  onExport: (ids: string[]) => void;
}

const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  selected,
  onSelect,
  onBlock,
  onUnblock,
  onEdit,
  onExport,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2"><input type="checkbox" checked={selected.length === customers.length && customers.length > 0} onChange={() => onExport(selected.length === customers.length ? [] : customers.map(c => c.id))} /></th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Phone/Email</th>
            <th className="p-2 text-center">Orders</th>
            <th className="p-2 text-center">LTV</th>
            <th className="p-2 text-center">Last Order</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-4 text-center text-gray-500">No customers found.</td>
            </tr>
          ) : (
            customers.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-2 text-center">
                  <input type="checkbox" checked={selected.includes(c.id)} onChange={() => onSelect(c.id)} />
                </td>
                <td className="p-2 font-medium">{c.name}</td>
                <td className="p-2">
                  <div>{c.phone}</div>
                  <div className="text-xs text-gray-500">{c.email}</div>
                </td>
                <td className="p-2 text-center">{c.orders}</td>
                <td className="p-2 text-center">€{c.ltv.toLocaleString()}</td>
                <td className="p-2 text-center">{c.lastOrder}</td>
                <td className="p-2 text-center">
                  {c.status === "blocked" ? (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Blocked</span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Active</span>
                  )}
                </td>
                <td className="p-2 text-center space-x-2">
                  {c.status === "active" ? (
                    <button className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100" onClick={() => onBlock(c.id)}>Block</button>
                  ) : (
                    <button className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100" onClick={() => onUnblock(c.id)}>Unblock</button>
                  )}
                  <button className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100" onClick={() => onEdit(c.id)}>Edit</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {customers.length > 0 && (
        <div className="flex justify-between items-center p-2 border-t bg-gray-50">
          <span className="text-xs text-gray-500">{selected.length} selected</span>
          <button className="text-xs px-3 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={() => onExport(selected)}>Export Selected</button>
        </div>
      )}
    </div>
  );
};

export default CustomersTable;
