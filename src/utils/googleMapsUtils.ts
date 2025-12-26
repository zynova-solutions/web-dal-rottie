// Restaurant coordinates from environment variables
export const RESTAURANT_LAT = process.env.NEXT_PUBLIC_RESTAURANT_LAT ? parseFloat(process.env.NEXT_PUBLIC_RESTAURANT_LAT) : 50.1109;
export const RESTAURANT_LNG = process.env.NEXT_PUBLIC_RESTAURANT_LNG ? parseFloat(process.env.NEXT_PUBLIC_RESTAURANT_LNG) : 8.6821;

// Calculate distance between two points using Haversine formula
export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat)/2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon))/2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// Geocode address using our API route
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  try {
    const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to geocode address');
    }
    
    return data.location;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Failed to validate address location. Please check the address and try again.');
  }
}