import React from 'react';
import DeliveryAddressInput from './DeliveryAddressInput';

interface SavedAddress {
    id: string;
    label: string;
    address: string;
    area: string;
    postalCode: string;
}

interface DeliveryAddressSectionProps {
    isLoggedIn: boolean;
    addressLoading: boolean;
    addressError: string | null;
    savedAddresses: SavedAddress[];
    selectedAddressId: string | null;
    showAddAddress: boolean;
    street: string;
    setStreet: (street: string) => void;
    postalCode: string;
    setPostalCode: (postalCode: string) => void;
    city: string;
    setCity: (city: string) => void;
    isAddressValid: boolean;
    addressValidationError: string | null;
    setSelectedAddressId: (id: string) => void;
    setShowAddAddress: (show: boolean) => void;
    handleSaveNewAddress: () => Promise<void>;
    validateAddress: (address: string, postcode: string, area: string) => Promise<void>;
}

const DeliveryAddressSection: React.FC<DeliveryAddressSectionProps> = ({
    isLoggedIn,
    addressLoading,
    addressError,
    savedAddresses,
    selectedAddressId,
    showAddAddress,
    street,
    setStreet,
    postalCode,
    setPostalCode,
    city,
    setCity,
    isAddressValid,
    addressValidationError,
    setSelectedAddressId,
    setShowAddAddress,
    handleSaveNewAddress,
    validateAddress
}) => {
    if (isLoggedIn) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
                                    onChange={() => {
                                        setSelectedAddressId(addr.id);
                                        setStreet(addr.address);
                                        setPostalCode(addr.postalCode);
                                        setCity(addr.area);
                                        validateAddress(addr.address, addr.postalCode, addr.area);
                                    }}
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

                <div className="mt-4 flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => setShowAddAddress(!showAddAddress)}
                        className="text-[#7a1313] text-sm hover:underline flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {showAddAddress ? 'Cancel' : 'Add New Address'}
                    </button>
                </div>

                {showAddAddress && (
                    <div className="mt-4 border-t pt-4">
                        <h3 className="font-semibold mb-4">Add New Address</h3>
                        <DeliveryAddressInput
                            isLoggedIn={isLoggedIn}
                            addressLoading={addressLoading}
                            addressError={addressError}
                            savedAddresses={savedAddresses}
                            selectedAddressId={selectedAddressId}
                            street={street}
                            setStreet={setStreet}
                            postalCode={postalCode}
                            setPostalCode={setPostalCode}
                            city={city}
                            setCity={setCity}
                            isAddressValid={isAddressValid}
                            addressValidationError={addressValidationError}
                            onValidate={() => {}}
                            onSelectAddress={() => {}}
                            onAddNewAddress={() => {}}
                        />
                        <button
                            type="button"
                            onClick={handleSaveNewAddress}
                            disabled={!isAddressValid}
                            className={`w-full py-2 px-4 rounded-lg ${
                                isAddressValid
                                    ? 'bg-[#7a1313] hover:bg-[#5a0d0d] text-white'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            } transition-colors`}
                        >
                            Save Address
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
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
            <DeliveryAddressInput
                isLoggedIn={isLoggedIn}
                addressLoading={addressLoading}
                addressError={addressError}
                savedAddresses={savedAddresses}
                selectedAddressId={selectedAddressId}
                street={street}
                setStreet={setStreet}
                postalCode={postalCode}
                setPostalCode={setPostalCode}
                city={city}
                setCity={setCity}
                isAddressValid={isAddressValid}
                addressValidationError={addressValidationError}
                onValidate={() => {}}
                onSelectAddress={() => {}}
                onAddNewAddress={() => {}}
            />
        </div>
    );
};

export default DeliveryAddressSection;