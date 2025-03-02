// geocode.ts (or utility file)
export const validateAddress = async (address: string, city: string, state: string, postalCode: string, country: string) => {
  // Combine the address components into a single string
  const fullAddress = `${address}, ${city}, ${state}, ${country}`;
  const encodedAddress = encodeURIComponent(fullAddress); // Properly encode the full address
  console.log(encodedAddress);
  
  const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1`;

  try {
    const response = await fetch(url);

    // Check if the response is successful
    if (!response.ok) {
      return { valid: false, message: "Error contacting geocoding service" };
    }

    const data = await response.json();
    
    // Check if any results were returned
    if (data.length === 0) {
      return { valid: false, message: "No valid address found" };
    }

    // If valid data is returned, extract relevant address information
    const validAddress = {
      street: data[0]?.address?.road || null,
      city: data[0]?.address?.city || data[0]?.address?.town || null,
      state: data[0]?.address?.state || null,
      country: data[0]?.address?.country || null,
      postalCode: data[0]?.address?.postcode || null,
    };

    // You can modify this as per your needs or check for specific criteria
    if (!validAddress.street || !validAddress.city || !validAddress.state) {
      return { valid: false, message: "Incomplete address" };
    }

    return { valid: true, address: validAddress }; // Return valid address if everything is fine

  } catch (error) {
    console.error("Error validating address:", error);
    return { valid: false, message: "An error occurred during address validation" };
  }
};
