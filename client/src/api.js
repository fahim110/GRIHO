const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Property APIs
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

// Inquiries / Tour Booking APIs
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

// Reviews APIs
export const fetchReviews = async (propertyId) => {
  const response = await fetch(`${API_BASE_URL}/reviews/property/${propertyId}`);
  if (!response.ok) return { success: false, data: [] };
  return response.json();
};

export const submitReview = async (reviewData) => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit review');
  }
  return response.json();
};

// Roommate APIs
export const fetchRoommates = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v && v !== 'All') queryParams.append(k, v);
  });
  const response = await fetch(`${API_BASE_URL}/roommates?${queryParams.toString()}`);
  if (!response.ok) return { success: false, data: [] };
  return response.json();
};

export const createRoommatePost = async (data) => {
  const response = await fetch(`${API_BASE_URL}/roommates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to post roommate request');
  }
  return response.json();
};

// Lease Agreement Generator API
export const generateLeaseAgreement = async (data) => {
  const response = await fetch(`${API_BASE_URL}/lease/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to generate lease agreement');
  }
  return response.json();
};
