"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Refund {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: "requested" | "approved" | "rejected" | "processed";
  channel: string;
  evidence?: string[]; // URLs to images or PDFs
  note?: string;
  timeline?: { label: string; date: string; }[];
  partial?: boolean;
}

const mockRefunds: Refund[] = [
  {
    id: "R-1001",
    orderId: "O-2001",
    amount: 250,
    reason: "Item missing",
    status: "requested",
    channel: "Razorpay",
    evidence: ["/public/images/black.png"],
    timeline: [
      { label: "Requested", date: "2025-10-01 10:00" },
    ],
    partial: false,
  },
  {
    id: "R-1002",
    orderId: "O-2002",
    amount: 100,
    reason: "Quality issue",
    status: "processed",
    channel: "Paytm",
    evidence: ["/public/images/white.png", "/public/images/red.png"],
    timeline: [
      { label: "Requested", date: "2025-09-28 14:30" },
      { label: "Approved", date: "2025-09-28 15:00" },
      { label: "Processed", date: "2025-09-29 09:00" },
    ],
    partial: true,
  },
];

const refundReasons = [
  "Item missing",
  "Quality issue",
  "Wrong item delivered",
  "Other",
];

export default function RefundsManagementUI() {
  const [refunds, setRefunds] = useState<Refund[]>(mockRefunds);
  const [showModal, setShowModal] = useState(false);
  const [modalOrderId, setModalOrderId] = useState<string | null>(null);
  const [modalAmount, setModalAmount] = useState(0);
  const [modalReason, setModalReason] = useState(refundReasons[0]);
  const [modalNote, setModalNote] = useState("");
  const [modalEvidence, setModalEvidence] = useState<string[]>([]);
  const [modalPartial, setModalPartial] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [viewRefund, setViewRefund] = useState<Refund | null>(null);

  // Simulate refund modal from order
  const openRefundModal = (orderId: string, maxAmount: number) => {
    setModalOrderId(orderId);
    setModalAmount(maxAmount);
    setModalReason(refundReasons[0]);
    setModalNote("");
    setModalEvidence([]);
    setModalPartial(false);
    setModalError(null);
    setShowModal(true);
  };
  const handleRefundSubmit = () => {
    if (modalAmount <= 0) {
      setModalError("Refund amount must be greater than 0");
      return;
    }
    if (modalAmount > 500) { // Simulate max refund
      setModalError("Cannot refund more than order amount (€50)");
      return;
    }
    setRefunds((prev) => [
      {
        id: `R-${1000 + prev.length + 1}`,
        orderId: modalOrderId || "O-NEW",
        amount: modalAmount,
        reason: modalReason,
        status: "requested",
        channel: "Razorpay",
        evidence: modalEvidence,
        note: modalNote,
        timeline: [
          { label: "Requested", date: new Date().toLocaleString() },
        ],
        partial: modalPartial,
      },
      ...prev,
    ]);
    setShowModal(false);
    setToast("Refund requested successfully");
    setTimeout(() => setToast(null), 2500);
  };

  // Simulate evidence upload
  const handleEvidenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setModalEvidence([...modalEvidence, ...Array.from(e.target.files).map(f => URL.createObjectURL(f))]);
    }
  };

  // Refund timeline badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "requested": return <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">Requested</span>;
      case "approved": return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">Approved</span>;
      case "rejected": return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">Rejected</span>;
      case "processed": return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">Processed</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-4">
      <h1 className="text-xl font-bold mb-4">Refunds (Prepaid Orders)</h1>
      <div className="mb-4">
        <button className="px-3 py-1 rounded bg-green-600 text-white text-xs" onClick={() => openRefundModal("O-2003", 500)}>+ New Refund</button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow bg-white mb-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Request #</th>
              <th className="p-2 text-left">Order #</th>
              <th className="p-2 text-right">Amount</th>
              <th className="p-2 text-left">Reason</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-left">Channel</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((r) => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-2 font-medium">{r.id}</td>
                <td className="p-2">{r.orderId}</td>
                <td className="p-2 text-right">€{r.amount}</td>
                <td className="p-2">{r.reason}</td>
                <td className="p-2 text-center">{getStatusBadge(r.status)}</td>
                <td className="p-2">{r.channel}</td>
                <td className="p-2 text-center">
                  <button className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100" onClick={() => setViewRefund(r)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Refund Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-50">
            <h2 className="text-lg font-bold mb-2">Refund Order: {modalOrderId}</h2>
            {modalPartial && (
              <div className="mb-2 p-2 bg-yellow-50 text-yellow-800 text-xs rounded">Partial refund: Only part of the order will be refunded.</div>
            )}
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1">Amount (€)</label>
              <input type="number" className="border rounded px-2 py-1 w-full" value={modalAmount} onChange={e => setModalAmount(Number(e.target.value))} />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1">Reason</label>
              <select className="border rounded px-2 py-1 w-full" value={modalReason} onChange={e => setModalReason(e.target.value)}>
                {refundReasons.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1">Note</label>
              <textarea className="border rounded px-2 py-1 w-full" value={modalNote} onChange={e => setModalNote(e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="block text-xs font-semibold mb-1">Evidence Attachments</label>
              <input type="file" multiple accept="image/*,application/pdf" onChange={handleEvidenceUpload} />
              <div className="flex gap-2 mt-2 flex-wrap">
                {modalEvidence.map((url, i) =>
                  url.match(/\.pdf$/) ? (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline text-blue-700"
                    >
                      PDF {i + 1}
                    </a>
                  ) : (
                    <Image
                      key={i}
                      src={url}
                      alt="evidence"
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  )
                )}
              </div>
            </div>
            <div className="mb-2 flex items-center gap-2">
              <input type="checkbox" checked={modalPartial} onChange={e => setModalPartial(e.target.checked)} id="partial" />
              <label htmlFor="partial" className="text-xs">Partial refund</label>
            </div>
            {modalError && <div className="mb-2 text-xs text-red-600">{modalError}</div>}
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-gray-200 text-xs" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs" onClick={handleRefundSubmit}>Submit</button>
            </div>
            <div className="absolute top-2 right-4 text-xl cursor-pointer" onClick={() => setShowModal(false)}>&times;</div>
          </div>
        </div>
      )}
      {/* Refund View Modal */}
      {viewRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative z-50">
            <h2 className="text-lg font-bold mb-2">Refund Details: {viewRefund.id}</h2>
            <div className="mb-2 text-xs">Order: <span className="font-semibold">{viewRefund.orderId}</span></div>
            <div className="mb-2 text-xs">Amount: <span className="font-semibold">€{viewRefund.amount}</span></div>
            <div className="mb-2 text-xs">Reason: {viewRefund.reason}</div>
            <div className="mb-2 text-xs">Status: {getStatusBadge(viewRefund.status)}</div>
            <div className="mb-2 text-xs">Channel: {viewRefund.channel}</div>
            {viewRefund.partial && <div className="mb-2 p-2 bg-yellow-50 text-yellow-800 text-xs rounded">Partial refund</div>}
            <div className="mb-2 text-xs">Note: {viewRefund.note || <span className="text-gray-400">-</span>}</div>
            <div className="mb-2 text-xs">Evidence:</div>
            <div className="flex gap-2 mb-2 flex-wrap">
              {viewRefund.evidence && viewRefund.evidence.length > 0 ? viewRefund.evidence.map((url, i) => url.match(/\.pdf$/) ? (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-xs underline text-blue-700">PDF {i+1}</a>
              ) : (
                <Image key={i} src={url} alt="evidence" width={48} height={48} className="w-12 h-12 object-cover rounded border" />
              )) : <span className="text-gray-400">No evidence</span>}
            </div>
            <div className="mb-2 text-xs">Timeline:</div>
            <ul className="mb-2 text-xs list-disc pl-5">
              {viewRefund.timeline && viewRefund.timeline.length > 0 ? viewRefund.timeline.map((t, i) => (
                <li key={i}>{t.label} <span className="text-gray-400">({t.date})</span></li>
              )) : <li>No timeline events</li>}
            </ul>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded bg-gray-200 text-xs" onClick={() => setViewRefund(null)}>Close</button>
              <button className="px-3 py-1 rounded bg-gray-600 text-white text-xs" onClick={() => window.print()}>Print Receipt</button>
            </div>
            <div className="absolute top-2 right-4 text-xl cursor-pointer" onClick={() => setViewRefund(null)}>&times;</div>
          </div>
        </div>
      )}
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow text-xs animate-fadeIn">{toast}</div>
      )}
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
