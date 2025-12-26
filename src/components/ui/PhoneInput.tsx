import React, { useState, useEffect } from "react";

// Minimal country data for demo; you can expand this list
const countries = [
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
];

function getUserCountry(): string {
  if (typeof window === "undefined") return "IN";
  try {
    const lang = navigator.language || navigator.languages[0] || "en-IN";
    if (lang.startsWith("de")) return "DE";
    if (lang.startsWith("en-US")) return "US";
    if (lang.startsWith("en-IN") || lang.startsWith("hi")) return "IN";
    return "IN";
  } catch {
    return "IN";
  }
}

export interface PhoneInputProps {
  value: string;
  onChange: (val: string) => void;
  country: string;
  setCountry: (code: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, country, setCountry }) => {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!country) {
      setCountry(getUserCountry());
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className={`flex items-center border-2 rounded-lg px-2 py-2 bg-gray-50 transition shadow-sm ${focused ? 'border-[#7a1313]' : 'border-[#e5d3c0]'}`}>
      <select
        value={country}
        onChange={e => setCountry(e.target.value)}
        className="bg-transparent outline-none pr-2 text-lg font-semibold min-w-[70px]"
        aria-label="Country code"
      >
        {countries.map(c => (
          <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>
        ))}
      </select>
      <input
        type="tel"
        required
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Phone number"
        className="flex-1 bg-transparent outline-none px-2 text-lg"
        pattern="[0-9]{7,15}"
        maxLength={15}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="tel"
      />
    </div>
  );
};

export default PhoneInput;
