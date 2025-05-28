
// import { Coordinates } from '../types'; // Type information removed for JS
import { MOCKED_ADDRESS_API_NOTICE } from '../constants';

// MOCK IMPLEMENTATION: Replace with a real geocoding API call
export const fetchAddressFromCoordinates = async (coords) => { // Type annotation for coords removed
  console.warn(MOCKED_ADDRESS_API_NOTICE);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 750));
  
  // Return a mocked address
  return `Adresse simulée pour ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)} - Rue Fictive, 81300 Graulhet`;
};
