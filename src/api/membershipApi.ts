import axios from 'axios';

const membershipApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 second timeout
});

// Automatically attach JWT token to every request
membershipApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
membershipApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// --- Package Types ---
export interface PackageType {
  id: string;
  name: string;
  description: string;
  des1: string;
  des2: string;
  des3: string;
  des4: string;
  des5: string;
  price: number;
}
// --- Membership Packages ---
export interface MembershipPackageDto {
  id: string;
  userId: string;
  // add the misspelled key as well as the correct one
  packagetTypeId: string;
  packageTypeId: string;
  packageTypeName: string;
  startDate: string;
  endDate: string;
  active: boolean;
  // …
}

/**
 * Fetch all package types for membership plans
 */
export async function getAllPackageTypes(): Promise<PackageType[]> {
  try {
    const { data } = await membershipApi.get<PackageType[]>('/package-types/get-all');
    return data;
  } catch (error) {
    console.error('Error fetching package types:', error);
    throw new Error('Failed to fetch membership plans');
  }
}

// --- Payment Integration ---
export interface CreatePaymentRequest {
  userId: string;
  packageTypeId: string;
  cancelUrl: string;
  successUrl: string;
}

export interface PaymentDto {
  id: string;
  userId: string;
  packageTypeId: string;
  amount: number;
  txnId: string;
  status: string;
  payAt: string;
}

export interface CreatePaymentResponse {
  approvalUrl: string;
  payment: PaymentDto;
}

/**
 * Create a PayPal payment and get approval URL
 */
export async function createPayment(
  paymentReq: CreatePaymentRequest
): Promise<CreatePaymentResponse> {
  try {
    console.log('Creating payment with request:', paymentReq);
    
    const { data } = await membershipApi.post<CreatePaymentResponse>('/api/payments/create', paymentReq);
    
    console.log('Payment creation response:', data);
    
    if (!data.approvalUrl) {
      throw new Error('No approval URL received from server');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating payment:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      switch (status) {
        case 400:
          throw new Error(`Invalid payment data: ${message}`);
        case 401:
          throw new Error('Authentication required. Please log in.');
        case 403:
          throw new Error('Payment creation not allowed.');
        case 500:
          throw new Error('Server error during payment creation.');
        default:
          throw new Error(`Payment creation failed: ${message}`);
      }
    }
    
    throw new Error('Unknown error during payment creation');
  }
}

/**
 * Execute a PayPal payment after user approval
 */
export async function executePayment(
  paymentId: string,
  payerId: string
): Promise<PaymentDto> {
  try {
    console.log('Executing payment:', { paymentId, payerId });
    
    const { data } = await membershipApi.get<PaymentDto>('/api/payments/execute', {
      params: { paymentId, PayerID: payerId }
    });
    
    console.log('Payment execution response:', data);
    
    return data;
  } catch (error) {
    console.error('Error executing payment:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      switch (status) {
        case 400:
          throw new Error(`Invalid payment execution: ${message}`);
        case 401:
          throw new Error('Authentication required for payment execution.');
        case 404:
          throw new Error('Payment not found or already processed.');
        case 500:
          throw new Error('Server error during payment execution.');
        default:
          throw new Error(`Payment execution failed: ${message}`);
      }
    }
    
    throw new Error('Unknown error during payment execution');
  }
}

/**
 * Fetch all payments by user, optionally filtering by status
 */
export async function getPaymentsByUser(
  userId: string,
  status?: string
): Promise<PaymentDto[]> {
  try {
    const path = `/api/payments/user/${userId}`;
    const { data } = await membershipApi.get<PaymentDto[]>(path, {
      params: status ? { status } : {}
    });
    return data;
  } catch (error) {
    console.error('Error fetching user payments:', error);
    
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      switch (statusCode) {
        case 401:
          throw new Error('Authentication required to view payments.');
        case 403:
          throw new Error('Not authorized to view these payments.');
        case 404:
          throw new Error('User or payments not found.');
        default:
          throw new Error(`Failed to fetch payments: ${message}`);
      }
    }
    
    throw new Error('Unknown error fetching payments');
  }
}

// --- Utility Functions ---

// PayPal SDK types
interface PayPalSDK {
  Buttons: (options: Record<string, unknown>) => {
    render: (selector: string) => Promise<void>;
  };
  // Add other PayPal SDK methods as needed
}

declare global {
  interface Window {
    paypal?: PayPalSDK;
  }
}

/**
 * Check if PayPal SDK is loaded
 */
export function isPayPalSDKLoaded(): boolean {
  return typeof window !== 'undefined' && typeof window.paypal !== 'undefined';
}

/**
 * Wait for PayPal SDK to load
 */
export function waitForPayPalSDK(timeout = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isPayPalSDKLoaded()) {
      resolve();
      return;
    }

    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isPayPalSDKLoaded()) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('PayPal SDK failed to load within timeout'));
      }
    }, 100);
  });
}

/**
 * Fetch the active membership package for the current (authenticated) user.
 */
export async function getActiveMembershipPackage(): Promise<MembershipPackageDto> {
  try {
    const { data } = await membershipApi.get<MembershipPackageDto>(
      '/membership-packages/user/active'
    );
    return data;
  } catch (error) {
    console.error('Error fetching active membership package:', error);
    // You can inspect error.response?.status to map 404 → “no active package”
    throw error;
  }
}

/**
 * Check if a specific user has an active membership package.
 * GET /membership-packages/user/{userId}/has-active
 * Returns true if active, false if not. Throws 404 if user not found.
 */
export async function hasActiveMembership(userId: string): Promise<boolean> {
  try {
    const { data } = await membershipApi.get<boolean>(
      `/membership-packages/user/${userId}/has-active`
    );
    return data;
  } catch (error) {
    console.error(`Error checking active membership for user ${userId}:`, error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("User does not exist or package information not found.");
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
          throw new Error("No access to this user's membership information.");
      }
    }
    // For any other error, assume no active membership or a general error
    return false; // Or re-throw error if you want to show a general error message
  }
}

/**
 * Fetch the active membership package details for a specific user.
 * GET /membership-packages/user/{userId}/active-package
 * Returns MembershipPackageDto if active package found, throws 404 if not found.
 */
export async function getActiveMembershipDetailsByUserId(userId: string): Promise<MembershipPackageDto> {
  try {
    const { data } = await membershipApi.get<MembershipPackageDto>(
      `/membership-packages/user/${userId}/active-package`
    );
    return data;
  } catch (error) {
    console.error(`Error fetching active membership details for user ${userId}:`, error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("This user currently has no active memberships..");
      }
      if (error.response?.status === 401 || error.response?.status === 403) {
          throw new Error("No access to this user's membership information.");
      }
    }
    throw error; // Re-throw other errors
  }
}

