// Coupons & Promos Management Page
// Persona: Admin/Manager
// Goal: Configure discounts, manage coupons

'use client';
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createCoupon, updateCoupon, deleteCoupon } from '@/services/couponApi';
import { adminGet } from '@/services/adminApi';

// Coupon type
type Coupon = {
  id?: string | number;
  code: string;
  type: string;
  value: number | string;
  maxDiscount?: number | string;
  minCart?: number | string;
  minCartValue?: number | string;
  start: string;
  end: string;
  startDate?: string;
  endDate?: string;
  usageLimit?: number | string;
  perUserLimit?: number | string;
  eligibleItems?: string[];
  eligibleCategories?: string[];
  eligibleZones?: string[];
  newUserOnly?: boolean;
  paymentMethods?: string[];
  status?: string;
  usageCount?: number;
  isActive?: boolean;
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<Coupon | null>(null);
  const [formMode, setFormMode] = useState<'create'|'edit'>('create');
  const [codeError, setCodeError] = useState('');
  const [apiError, setApiError] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch coupons from backend on mount
  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await adminGet('/api/coupons/getall');
        if (Array.isArray(res.data)) {
          setCoupons(res.data);
        } else {
          setCoupons([]);
        }
      } catch {
        setCoupons([]);
      }
    }
    fetchCoupons();
  }, []);

  function openCouponDialog(mode: 'create'|'edit', coupon?: Coupon) {
    setFormMode(mode);
    setShowDialog(true);
    setForm(
      mode === 'edit' && coupon
        ? { ...coupon }
        : {
            code: '',
            type: 'Percentage',
            value: '',
            maxDiscount: '',
            minCart: '',
            start: '',
            end: '',
            usageLimit: '',
            perUserLimit: '',
            eligibleItems: [],
            eligibleCategories: [],
            eligibleZones: [],
            newUserOnly: false,
            paymentMethods: [],
          }
    );
    setCodeError('');
  }

  // Added null checks and ensured proper type handling for `form`
  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = e.target;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? (target as HTMLInputElement).checked : undefined;

    setForm((prev) => {
      if (!prev) return prev; // Ensure `prev` is not null
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
    });

    if (name === 'code' && form) {
      // Inline code uniqueness validation
      if (
        coupons.some(
          (c) =>
            c.code.toLowerCase() === value.toLowerCase() &&
            (formMode === 'create' || c.id !== form.id)
        )
      ) {
        setCodeError('Code already exists');
      } else {
        setCodeError('');
      }
    }
  }

  function getValidationErrors() {
    if (!form) return {};
    const errors: Record<string, string> = {};
    
    if (!form.code) errors.code = 'Code is required';
    else if (codeError) errors.code = codeError;
    
    if (!form.value) errors.value = 'Value is required';
    else if (isNaN(Number(form.value))) errors.value = 'Value must be a number';
    else if (Number(form.value) <= 0) errors.value = 'Value must be greater than 0';
    
    if (!form.start) errors.start = 'Start date is required';
    if (!form.end) errors.end = 'End date is required';
    
    if (form.start && form.end && new Date(form.start) > new Date(form.end)) {
      errors.end = 'End date must be after start date';
    }
    
    return errors;
  }

  function isFormValid() {
    const errors = getValidationErrors();
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form) return;
    
    // Validate form
    const errors = getValidationErrors();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setApiError('Please fill in all required fields correctly');
      return;
    }

    setApiError('');
    setApiLoading(true);
    try {
      if (formMode === 'create') {
        const payload = {
          code: form.code,
          type: form.type,
          value: Number(form.value) || 0,
          maxDiscount: Number(form.maxDiscount) || 0,
          minCartValue: Number(form.minCart) || 0,
          startDate: form.start || '',
          endDate: form.end || '',
          usageLimit: Number(form.usageLimit) || 0,
          perUserLimit: Number(form.perUserLimit) || 0,
          newUserOnly: !!form.newUserOnly,
        };
        const res = await createCoupon(payload);
        setCoupons((prev) => [
          ...prev,
          {
            ...form,
            id: res?.data?.id || Date.now(),
            status:
              new Date(form.start || '') > new Date()
              ? 'Scheduled'
              : new Date(form.end || '') < new Date()
              ? 'Expired'
              : 'Active',
            usageCount: 0,
          },
        ]);
      } else if (formMode === 'edit') {
        const payload = {
          code: form.code,
          type: form.type,
          value: Number(form.value) || 0,
          maxDiscount: Number(form.maxDiscount) || 0,
          minCartValue: Number(form.minCart) || 0,
          startDate: form.start || '',
          endDate: form.end || '',
          usageLimit: Number(form.usageLimit) || 0,
          perUserLimit: Number(form.perUserLimit) || 0,
          newUserOnly: !!form.newUserOnly,
        };
        await updateCoupon(String(form.id), payload);
        setCoupons((prev) =>
          prev.map((c) => (c.id === form.id ? { ...form } : c))
        );
      }
      setShowDialog(false);
      setForm(null);
    } catch (err) {
      if (err instanceof Error) {
        setApiError(err.message || 'Failed to save coupon');
      } else {
        setApiError('Failed to save coupon');
      }
    } finally {
      setApiLoading(false);
    }
  }

  // Further refined type handling for `coupon` and `form` properties
  function mapCoupon(coupon: Coupon): Coupon {
    let status = 'Active';
    const now = new Date();
    if (coupon.isActive === false) status = 'Expired';
    else if (new Date(coupon.startDate || '') > now) status = 'Scheduled';
    else if (new Date(coupon.endDate || '') < now) status = 'Expired';

    return {
      ...coupon,
      status,
      start: coupon.startDate || '',
      end: coupon.endDate || '',
      usageCount: coupon.usageCount || 0,
      usageLimit: coupon.usageLimit || 0,
    };
  }

  function statusColor(status: string | undefined): string {
    if (status === 'Active') return 'bg-green-100 text-green-700';
    if (status === 'Expired') return 'bg-gray-200 text-gray-500';
    if (status === 'Scheduled') return 'bg-blue-100 text-blue-700';
    return 'bg-gray-100 text-gray-500';
  }

  // Updated `calculateDiscount` and `calculateFinal` to handle undefined values
  function calculateDiscount(value: string | number | undefined, maxDiscount: string | number | undefined): number {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value || 0;
    const numericMaxDiscount = typeof maxDiscount === 'string' ? parseFloat(maxDiscount) : maxDiscount || 0;
    return Math.min(100 * numericValue / 100, numericMaxDiscount);
  }

  function calculateFinal(value: string | number | undefined, maxDiscount: string | number | undefined): number {
    const discount = calculateDiscount(value, maxDiscount);
    return 100 - discount;
  }

  async function handleDeleteCoupon(couponId: string | number | undefined) {
    if (!couponId) return;
    
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await deleteCoupon(couponId);
      
      // Remove from local state
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    } catch (err) {
      console.error('Failed to delete coupon:', err);
      alert('Failed to delete coupon. Please try again.');
    }
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Coupons & Promos</h1>
        <button className="bg-[#7a1313] text-white rounded px-3 py-2 sm:p-2 flex items-center gap-1 w-full sm:w-auto justify-center" onClick={() => openCouponDialog('create')}>
          <PlusIcon className="w-5 h-5" /> 
          <span className="hidden sm:inline">Add Coupon</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
      <div className="overflow-x-auto rounded border mb-8">
        <table className="min-w-[600px] w-full text-sm">
          <thead>
            <tr className="bg-[#f3e8e8] text-[#7a1313]">
              <th className="p-2 text-left">Code</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Value</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Usage</th>
              <th className="p-2 text-left">Validity</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => {
              const c = mapCoupon(coupon);
              return (
                <tr key={c.id} className="border-b hover:bg-[#f9fafb]">
                  <td className="p-2 font-mono font-bold break-all">{c.code}</td>
                  <td className="p-2">{c.type}</td>
                  <td className="p-2">{c.type === 'Percentage' ? `${c.value}%` : `€${c.value}`}</td>
                  <td className="p-2"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColor(c.status)}`}>{c.status}</span></td>
                  <td className="p-2">{c.usageCount} / {c.usageLimit || '-'}</td>
                  <td className="p-2 text-xs">{c.start} - {c.end}</td>
                  <td className="p-2 flex gap-1 flex-wrap">
                    <button className="text-xs text-blue-600 underline font-semibold" onClick={() => openCouponDialog('edit', c)}><PencilIcon className="w-4 h-4 inline" /></button>
                    <button className="text-xs text-red-600 underline font-semibold" onClick={() => handleDeleteCoupon(c.id)}><TrashIcon className="w-4 h-4 inline" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Coupon Dialog */}
      <Dialog open={showDialog} onClose={() => setShowDialog(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-2 sm:px-0">
          <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
          <div className="bg-white rounded shadow-lg p-3 sm:p-6 z-10 w-full max-w-lg relative mx-auto">
            <Dialog.Title className="font-bold mb-2 text-lg sm:text-xl">{formMode === 'edit' ? 'Edit Coupon' : 'Add Coupon'}</Dialog.Title>
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                {apiError}
              </div>
            )}
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block font-semibold mb-1">Code <span className="text-red-500">*</span></label>
                <input className={`border rounded px-2 py-1 w-full font-mono text-sm ${validationErrors.code ? 'border-red-500' : ''}`} name="code" value={form?.code || ''} onChange={handleFormChange} required maxLength={20} />
                {validationErrors.code && <div className="text-xs text-red-600 mt-1">{validationErrors.code}</div>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select className="border rounded px-2 py-1 w-full text-sm" name="type" value={form?.type} onChange={handleFormChange}>
                    <option value="Percentage">Percentage</option>
                    <option value="Flat">Flat</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Value <span className="text-red-500">*</span></label>
                  <input className={`border rounded px-2 py-1 w-full text-sm ${validationErrors.value ? 'border-red-500' : ''}`} name="value" value={form?.value || ''} onChange={handleFormChange} required type="number" min="1" />
                  {validationErrors.value && <div className="text-xs text-red-600 mt-1">{validationErrors.value}</div>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Max Discount</label>
                  <input className="border rounded px-2 py-1 w-full text-sm" name="maxDiscount" value={form?.maxDiscount || ''} onChange={handleFormChange} type="number" min="0" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Min Cart Value</label>
                  <input className="border rounded px-2 py-1 w-full text-sm" name="minCart" value={form?.minCart || ''} onChange={handleFormChange} type="number" min="0" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Start Date <span className="text-red-500">*</span></label>
                  <input className={`border rounded px-2 py-1 w-full text-sm ${validationErrors.start ? 'border-red-500' : ''}`} name="start" value={form?.start || ''} onChange={handleFormChange} type="date" required />
                  {validationErrors.start && <div className="text-xs text-red-600 mt-1">{validationErrors.start}</div>}
                </div>
                <div>
                  <label className="block font-semibold mb-1">End Date <span className="text-red-500">*</span></label>
                  <input className={`border rounded px-2 py-1 w-full text-sm ${validationErrors.end ? 'border-red-500' : ''}`} name="end" value={form?.end || ''} onChange={handleFormChange} type="date" required />
                  {validationErrors.end && <div className="text-xs text-red-600 mt-1">{validationErrors.end}</div>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Usage Limit (Global)</label>
                  <input className="border rounded px-2 py-1 w-full text-sm" name="usageLimit" value={form?.usageLimit || ''} onChange={handleFormChange} type="number" min="0" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Per User Limit</label>
                  <input className="border rounded px-2 py-1 w-full text-sm" name="perUserLimit" value={form?.perUserLimit || ''} onChange={handleFormChange} type="number" min="0" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="newUserOnly" name="newUserOnly" checked={form?.newUserOnly || false} onChange={handleFormChange} />
                <label htmlFor="newUserOnly" className="font-semibold">New User Only</label>
              </div>
              {/* Eligible items/categories/zones, payment methods, etc. can be added here as multi-selects */}
              <div className="flex flex-wrap gap-2 mt-2 justify-end">
                <button type="button" className="bg-gray-200 text-[#7a1313] px-4 py-1 rounded shadow text-xs font-semibold hover:bg-gray-300 w-full sm:w-auto" onClick={() => setShowDialog(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-[#7a1313] text-white px-4 py-1 rounded shadow text-xs font-semibold hover:bg-[#a31a1a] w-full sm:w-auto" disabled={!isFormValid() || apiLoading}>
                  {apiLoading ? 'Saving...' : (formMode === 'edit' ? 'Update Coupon' : 'Add Coupon')}
                </button>
              </div>
              {/* Preview section */}
              <div className="mt-4 border-t pt-3">
                <div className="font-semibold mb-1">Preview</div>
                <div className="bg-gray-50 p-3 rounded text-xs">
                  <div>Cart: €100</div>
                  <div>Coupon: <span className="font-mono">{form?.code || 'CODE'}</span> {form?.type === 'Percentage' ? `${form?.value || 0}%` : `€${form?.value || 0}`}</div>
                  <div>Discount: {form?.type === 'Percentage' ? `€${calculateDiscount(form?.value, form?.maxDiscount)}` : `€${form?.value || 0}`}</div>
                  <div>Final: €{calculateFinal(form?.value, form?.maxDiscount)}</div>
                </div>
              </div>
              {apiError && <div className="text-xs text-red-600 mt-2">{apiError}</div>}
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
