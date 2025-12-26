import React, { useState } from 'react';
import { VALID_DELIVERY_AREAS } from '../utils/deliveryAreaValidator';

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  area: string;
  postalCode: string;
  isDefault?: boolean;
}

interface DeliveryAddressInputProps {
  isLoggedIn: boolean;
  addressLoading: boolean;
  addressError: string | null;
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
  street: string;
  setStreet: (street: string) => void;
  postalCode: string;
  setPostalCode: (postalCode: string) => void;
  city: string;
  setCity: (city: string) => void;
  isAddressValid: boolean;
  addressValidationError: string | null;
  onValidate: () => void;
  onSelectAddress: (address: SavedAddress) => void;
  onAddNewAddress: () => void;
}

// This component handles input and validation for German delivery addresses
const DeliveryAddressInput: React.FC<DeliveryAddressInputProps> = ({
  isLoggedIn,
  addressLoading,
  addressError,
  savedAddresses,
  selectedAddressId,
  street,
  setStreet,
  postalCode,
  setPostalCode,
  city,
  setCity,
  isAddressValid,
  addressValidationError,
  onValidate,
  onSelectAddress,
  onAddNewAddress
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const handleAddNewAddress = () => {
    setShowNewAddressForm(true);
    onAddNewAddress();
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (street && postalCode && city) {
      setIsValidating(true);
      onValidate();
      setIsValidating(false);
      // Don't hide the form - let the parent component decide based on validation result
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {isLoggedIn && (
        <>
          {addressLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="w-6 h-6 border-2 border-[#7a1313] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : addressError ? (
            <div className="text-red-500 text-sm p-4">{addressError}</div>
          ) : savedAddresses.length === 0 ? (
            <div className="text-gray-500 text-sm p-4">No saved addresses found.</div>
          ) : (
            <div className="space-y-3">
              {savedAddresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedAddressId === addr.id
                      ? 'border-[#e30232] bg-red-50'
                      : 'border-gray-200 hover:border-[#e30232]'
                  }`}
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => onSelectAddress(addr)}
                    className="accent-[#e30232]"
                  />
                  <div>
                    <div className="font-semibold">{addr.label}</div>
                    <div className="text-sm text-gray-600">{addr.address}</div>
                    <div className="text-xs text-gray-500">{addr.postalCode} {addr.area}</div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {!showNewAddressForm && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleAddNewAddress}
                className="text-[#7a1313] text-sm hover:underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Address
              </button>
            </div>
          )}
        </>
      )}

      {(!isLoggedIn || showNewAddressForm) && (
        <div className="space-y-4">
          {addressError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{addressError}</span>
              </p>
            </div>
          )}
          {!isLoggedIn && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  <a href="/user/signin?returnUrl=/user/checkout" className="text-blue-600 hover:underline">Sign in</a>
                  {" "}to save your delivery addresses for future orders
                </span>
              </p>
            </div>
          )}

          <form onSubmit={handleAddressSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street and house number</label>
              <input
                type="text"
                placeholder="e.g., Hauptstraße 123"
                className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7a1313] bg-gray-50"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                <input
                  type="text"
                  placeholder="60329"
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7a1313] bg-gray-50"
                  value={postalCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                    setPostalCode(value);
                  }}
                  maxLength={5}
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="Frankfurt am Main"
                  className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7a1313] bg-gray-50"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  list="german-cities"
                />
                <datalist id="german-cities">
                  {VALID_DELIVERY_AREAS.map((area) => (
                    <option key={area.city} value={area.city} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="flex-1 bg-[#7a1313] text-white rounded-lg px-4 py-2 hover:bg-[#5a0e0e] focus:ring-2 focus:ring-[#7a1313] focus:ring-offset-2"
              >
                {isValidating ? 'Validating...' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewAddressForm(false);
                  setStreet('');
                  setPostalCode('');
                  setCity('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>

          {isValidating ? (
            <div className="text-gray-600 text-sm mt-2 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#7a1313] border-t-transparent rounded-full animate-spin"></div>
              Checking delivery availability...
            </div>
          ) : (
            <>
              {addressValidationError && (
                <div className="text-red-500 text-sm mt-2">
                  {addressValidationError}
                </div>
              )}
              
              {isAddressValid && (
                <div className="text-green-600 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Delivery available to this address
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryAddressInput;