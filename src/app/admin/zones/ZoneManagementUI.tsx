"use client";
import React, { useState } from "react";

interface Zone {
  id: string;
  name: string;
  coverage: string;
  fees: string;
  minOrder: number;
  autoAssign: boolean;
}

const mockZones: Zone[] = [
  { id: "1", name: "Central City", coverage: "400001, 400002", fees: "€3 base, €0.50/km, free over €50", minOrder: 200, autoAssign: true },
  { id: "2", name: "North Zone", coverage: "400003, 400004", fees: "€4 base, €0.60/km, free over €60", minOrder: 250, autoAssign: false },
];

export default function ZoneManagementUI() {
  const [zones, setZones] = useState<Zone[]>(mockZones);
  const [editing, setEditing] = useState<Zone | null>(null);
  const [showChecker, setShowChecker] = useState(false);
  const [address, setAddress] = useState("");
  const [checkerResult, setCheckerResult] = useState<string | null>(null);

  // Simulate address checker
  const handleCheckAddress = () => {
    if (address.match(/400001|400002/)) setCheckerResult("Central City (€3 fee)");
    else if (address.match(/400003|400004/)) setCheckerResult("North Zone (€4 fee)");
    else setCheckerResult("Not in any delivery zone");
  };

  // Simulate zone edit
  const handleEdit = (zone: Zone) => setEditing(zone);
  const handleSave = (zone: Zone) => {
    setZones((prev) => prev.map((z) => (z.id === zone.id ? zone : z)));
    setEditing(null);
  };
  const handleCancel = () => setEditing(null);

  // Simulate CSV import
  const handleImportCSV = () => alert("CSV import not implemented in demo");

  // Simulate map draw
  const handleDrawPolygon = () => alert("Map polygon draw not implemented in demo");

  return (
    <div className="max-w-5xl mx-auto mt-4">
      <h1 className="text-xl font-bold mb-4">Delivery Zones & Fees</h1>
      <div className="mb-4 flex gap-2">
        <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs" onClick={handleDrawPolygon}>Draw Polygon</button>
        <button className="px-3 py-1 rounded bg-gray-200 text-xs" onClick={handleImportCSV}>Import Pincodes CSV</button>
        <button className="px-3 py-1 rounded bg-green-600 text-white text-xs" onClick={() => setShowChecker((v) => !v)}>{showChecker ? "Hide" : "Show"} Address Checker</button>
      </div>
      {showChecker && (
        <div className="mb-4 p-4 bg-gray-50 rounded shadow flex flex-col sm:flex-row gap-2 items-center">
          <input
            className="border rounded px-2 py-1 text-sm flex-1"
            placeholder="Enter address or pincode..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs" onClick={handleCheckAddress}>Check</button>
          {checkerResult && <span className="ml-2 text-xs font-semibold">{checkerResult}</span>}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Coverage</th>
              <th className="p-2 text-left">Fees</th>
              <th className="p-2 text-center">Min Order</th>
              <th className="p-2 text-center">Auto-Assign</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-2 font-medium">{zone.name}</td>
                <td className="p-2">{zone.coverage}</td>
                <td className="p-2">{zone.fees}</td>
                <td className="p-2 text-center">€{zone.minOrder}</td>
                <td className="p-2 text-center">{zone.autoAssign ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">Yes</span> : <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">No</span>}</td>
                <td className="p-2 text-center">
                  <button className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100" onClick={() => handleEdit(zone)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-50">
            <h2 className="text-lg font-bold mb-2">Edit Zone: {editing.name}</h2>
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1">Name</label>
              <input className="border rounded px-2 py-1 w-full" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1">Coverage (pincodes)</label>
              <input className="border rounded px-2 py-1 w-full" value={editing.coverage} onChange={e => setEditing({ ...editing, coverage: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1">Fees</label>
              <input className="border rounded px-2 py-1 w-full" value={editing.fees} onChange={e => setEditing({ ...editing, fees: e.target.value })} />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1">Min Order (€)</label>
              <input type="number" className="border rounded px-2 py-1 w-full" value={editing.minOrder} onChange={e => setEditing({ ...editing, minOrder: Number(e.target.value) })} />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1">Auto-Assign Riders</label>
              <input type="checkbox" checked={editing.autoAssign} onChange={e => setEditing({ ...editing, autoAssign: e.target.checked })} />
              <span className="ml-2 text-xs">Auto-assign riders for this zone</span>
            </div>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-gray-200 text-xs" onClick={handleCancel}>Cancel</button>
              <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs" onClick={() => handleSave(editing)}>Save</button>
            </div>
            <div className="absolute top-2 right-4 text-xl cursor-pointer" onClick={handleCancel}>&times;</div>
          </div>
        </div>
      )}
      {/* Overlapping zones warning and unsaved changes toast (demo only) */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow text-xs mb-2">Warning: Overlapping zones detected!</div>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded shadow text-xs">You have unsaved changes.</div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s linear;
        }
      `}</style>
    </div>
  );
}
