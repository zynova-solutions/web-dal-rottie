// List of valid German postal codes where delivery is available
export const VALID_DELIVERY_AREAS = [
  { 
    city: 'Frankfurt am Main', 
    postalCodes: [
      '60306', '60308', '60310', '60311', '60312', '60313', 
      '60318', '60322', '60323', '60325', '60326', '60327', '60329'
    ] 
  },
  { 
    city: 'Offenbach am Main', 
    postalCodes: ['63067', '63069', '63071', '63073', '63075'] 
  },
  { 
    city: 'Berlin', 
    postalCodes: ['10115', '10117', '10119', '10178', '10179','10245'] 
  },
];

/**
 * Check if a city supports delivery
 */
export const isCitySupported = (city: string): boolean => {
  return VALID_DELIVERY_AREAS.some(area => 
    area.city.toLowerCase() === city.toLowerCase()
  );
};

/**
 * Check if a postal code is in our delivery area
 */
export const isPostalCodeSupported = (postalCode: string, city: string): boolean => {
  const area = VALID_DELIVERY_AREAS.find(area => 
    area.city.toLowerCase() === city.toLowerCase()
  );
  
  if (!area) return false;
  return area.postalCodes.includes(postalCode);
};

/**
 * Check if the full address is in our delivery area
 */
export const isAddressInDeliveryArea = (
  street: string, 
  postalCode: string, 
  city: string
): { isValid: boolean; message: string | null } => {
  if (!street || street.length < 3) {
    return {
      isValid: false,
      message: 'Please enter a valid street address'
    };
  }

  if (!postalCode || !/^\d{5}$/.test(postalCode)) {
    return {
      isValid: false,
      message: 'Please enter a valid German postal code (5 digits)'
    };
  }

  if (!city) {
    return {
      isValid: false,
      message: 'Please enter a city'
    };
  }

  // Check if we deliver to this city
  if (!isCitySupported(city)) {
    return {
      isValid: false,
      message: 'We currently only deliver in Frankfurt and Offenbach'
    };
  }

  // Check if we deliver to this postal code
  if (!isPostalCodeSupported(postalCode, city)) {
    return {
      isValid: false,
      message: `We don't currently deliver to ${postalCode} in ${city}`
    };
  }

  // All checks passed
  return {
    isValid: true,
    message: null
  };
};