const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Auth APIs
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};

export const verifyOtpApi = async ({ email, otp }) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'OTP verification failed');
  }
  return data;
};

export const resendOtpApi = async ({ email }) => {
  const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to resend OTP');
  }
  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

export const socialLoginApi = async (socialData) => {
  const response = await fetch(`${API_BASE_URL}/auth/social-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(socialData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Social login failed');
  }
  return data;
};

export const googleAuthApi = async ({ credential, code, redirectUri, role }) => {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential, code, redirectUri, role }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Google authentication failed');
  }
  return data;
};

export const fetchUserProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return response.json();
};

export const updateUserProfile = async (updateData, token) => {
  const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update profile');
  }
  return data;
};

export const toggleSavePropertyApi = async (propertyId, token) => {
  const response = await fetch(`${API_BASE_URL}/auth/toggle-save/${propertyId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

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

export const createProperty = async (propertyData, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/properties`, {
    method: 'POST',
    headers,
    body: JSON.stringify(propertyData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create listing');
  }
  return response.json();
};

export const fetchMyListings = async (token) => {
  const response = await fetch(`${API_BASE_URL}/properties/user/my-listings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return { success: false, data: [] };
  return response.json();
};

export const updatePropertyStatus = async (propertyId, status, token) => {
  const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return response.json();
};

// Inquiries / Tour Booking APIs
export const createInquiry = async (inquiryData, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/inquiries`, {
    method: 'POST',
    headers,
    body: JSON.stringify(inquiryData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to schedule tour');
  }
  return response.json();
};

export const fetchMyInquiries = async (token) => {
  const response = await fetch(`${API_BASE_URL}/inquiries/my-inquiries`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return { success: false, data: [] };
  return response.json();
};

export const updateInquiryStatus = async (inquiryId, status, token) => {
  const response = await fetch(`${API_BASE_URL}/inquiries/${inquiryId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return response.json();
};

// Reviews APIs
export const fetchReviews = async (propertyId) => {
  const response = await fetch(`${API_BASE_URL}/reviews/property/${propertyId}`);
  if (!response.ok) return { success: false, data: [] };
  return response.json();
};

export const submitReview = async (reviewData, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers,
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

export const createRoommatePost = async (data, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/roommates`, {
    method: 'POST',
    headers,
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
