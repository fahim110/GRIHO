const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchProperties = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'All') {
      queryParams.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/properties?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.statusText}`);
  }
  return response.json();
};

export const fetchPropertyById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch property details: ${response.statusText}`);
  }
  return response.json();
};

export const fetchStatsOverview = async () => {
  const response = await fetch(`${API_BASE_URL}/properties/stats/overview`);
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
};

export const createProperty = async (propertyData) => {
  const response = await fetch(`${API_BASE_URL}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create listing');
  }
  return response.json();
};

export const createInquiry = async (inquiryData) => {
  const response = await fetch(`${API_BASE_URL}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to schedule tour');
  }
  return response.json();
};
