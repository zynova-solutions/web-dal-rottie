"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface StoreSettings {
  name: string;
  logo: string;
  contact: string;
  address: string;
  supportHours: string;
  open: boolean;
  prepTime: number;
  cutoff: string;
  holidays: string[];
  cod: boolean;
  onlinePayment: boolean;
  pendingOrders: number;
}

const defaultData: StoreSettings = {
  name: "Dal Rotti",
  logo: "/images/logo.png",
  contact: "+49 69 30036126",
  address: "Mainzer Landstraße 681, 60329 Frankfurt am Main, Germany",
  supportHours: "11:00 - 22:00",
  open: true,
  prepTime: 30,
  cutoff: "21:30",
  holidays: [],
  cod: true,
  onlinePayment: true,
  pendingOrders: 0,
};

export default function StoreSettingsUI() {
  const [data, setData] = useState<StoreSettings>(defaultData);
  const [edit, setEdit] = useState<StoreSettings>(defaultData);
  const [changed, setChanged] = useState(false);
  const [warnClose, setWarnClose] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('dalrotti_admin_token') : null;
        if (!adminToken) {
          console.error('No admin token found');
          setLoading(false);
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';
        const response = await fetch(`${baseUrl}/api/admin/settings`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            const settings = { ...defaultData, ...result.data };
            setData(settings);
            setEdit(settings);
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    setChanged(JSON.stringify(data) !== JSON.stringify(edit));
  }, [edit, data]);

  const handleChange = (field: keyof StoreSettings, value: string | number | boolean | string[]) => {
    setEdit((prev) => ({ ...prev, [field]: value }));
  };
  const handleHolidayAdd = (date: string) => {
    if (!edit.holidays.includes(date)) handleChange("holidays", [...edit.holidays, date]);
  };
  const handleHolidayRemove = (date: string) => {
    handleChange("holidays", edit.holidays.filter((d: string) => d !== date));
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('dalrotti_admin_token') : null;
      if (!adminToken) {
        alert('Authentication required');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';
      const response = await fetch(`${baseUrl}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(edit)
      });

      if (response.ok) {
        setData(edit);
        setChanged(false);
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenToggle = () => {
    if (edit.open && edit.pendingOrders > 0) {
      setWarnClose(true);
      return;
    }
    handleChange("open", !edit.open);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7a1313] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Store Settings</h1>
        <span className={`px-4 py-1 rounded-full text-sm font-bold shadow ${edit.open ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>{edit.open ? 'Open' : 'Closed'}</span>
      </div>
      {changed && (
        <div className="mb-6 flex items-center gap-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm animate-pulse">
          <span className="font-medium text-yellow-900">You have unsaved changes.</span>
          <button 
            className="ml-auto px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleSave} 
            disabled={!changed || saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* General */}
        <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col gap-4">
          <h2 className="font-bold text-lg text-gray-800 mb-2 border-b pb-2">General</h2>
          <div className="flex items-center gap-4 mb-2">
            <Image
              src={edit.logo}
              alt="Logo"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 shadow"
            />
            <input
              className="border-2 border-gray-200 rounded-lg px-3 py-2 flex-1 text-lg font-semibold focus:ring-2 focus:ring-blue-200"
              value={edit.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-600">Contact</label>
            <input className="border-2 border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-200" value={edit.contact} onChange={e => handleChange('contact', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-600">Address</label>
            <input className="border-2 border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-200" value={edit.address} onChange={e => handleChange('address', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-600">Support Hours</label>
            <input className="border-2 border-gray-200 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-200" value={edit.supportHours} onChange={e => handleChange('supportHours', e.target.value)} />
          </div>
        </section>
        {/* Operations */}
        <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col gap-4">
          <h2 className="font-bold text-lg text-gray-800 mb-2 border-b pb-2">Operations</h2>
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
              <input type="checkbox" checked={edit.open} onChange={handleOpenToggle} className="accent-green-600 w-5 h-5" />
              <span className="text-sm">Open/Closed</span>
            </label>
            <label className="flex items-center gap-2 font-semibold text-gray-700">
              <span className="text-sm">Prep Time (mins)</span>
              <input type="number" className="border-2 border-gray-200 rounded-lg px-2 py-1 w-20 focus:ring-2 focus:ring-blue-200" value={edit.prepTime} onChange={e => handleChange('prepTime', Number(e.target.value))} />
            </label>
            <label className="flex items-center gap-2 font-semibold text-gray-700">
              <span className="text-sm">Order Cutoff</span>
              <input type="time" className="border-2 border-gray-200 rounded-lg px-2 py-1 w-28 focus:ring-2 focus:ring-blue-200" value={edit.cutoff} onChange={e => handleChange('cutoff', e.target.value)} />
            </label>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-600">Holiday Calendar</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {edit.holidays.map((date: string) => (
                <span key={date} className="bg-gray-200 px-3 py-1 rounded-full text-xs flex items-center gap-1 font-semibold shadow-sm">
                  {date}
                  <button className="ml-1 text-red-500 hover:text-red-700 font-bold" onClick={() => handleHolidayRemove(date)} title="Remove">&times;</button>
                </span>
              ))}
              <input type="date" className="border-2 border-gray-200 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-blue-200" onChange={e => handleHolidayAdd(e.target.value)} />
            </div>
          </div>
        </section>
        {/* Payments */}
        <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col gap-4 md:col-span-2">
          <h2 className="font-bold text-lg text-gray-800 mb-2 border-b pb-2">Payments</h2>
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
              <input type="checkbox" checked={edit.cod} onChange={e => handleChange('cod', e.target.checked)} className="accent-blue-600 w-5 h-5" />
              <span className="text-sm">Cash on Delivery</span>
            </label>
            <span className="text-sm text-gray-500">Online payment info is <span className="font-semibold text-blue-700">read-only</span> (configured in payment gateway)</span>
          </div>
        </section>
      </div>
      {/* Warn on close with pending orders */}
      {warnClose && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative z-50 border border-red-200">
            <div className="mb-2 p-2 bg-red-50 text-red-800 text-sm rounded font-semibold flex items-center gap-2">
              <span>Warning: There are pending orders. Are you sure you want to close the store?</span>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition" onClick={() => { setWarnClose(false); handleChange('open', false); }}>Yes, Close</button>
              <button className="px-4 py-1.5 rounded-lg bg-gray-200 text-sm font-semibold shadow hover:bg-gray-300 transition" onClick={() => setWarnClose(false)}>Cancel</button>
            </div>
            <div className="absolute top-2 right-4 text-xl cursor-pointer" onClick={() => setWarnClose(false)}>&times;</div>
          </div>
        </div>
      )}
    </div>
  );
}
