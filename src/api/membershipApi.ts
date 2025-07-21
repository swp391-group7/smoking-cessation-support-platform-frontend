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
  duration: number; 
  createdAt: string;
}

// DTO for creating a new package type
export interface PackageTypeCreateDto {
  name: string;
  description: string;
  des1: string;
  des2: string;
  des3: string;
  des4: string;
  des5: string;
  price: number;
  duration: number;
}

// DTO for updating an existing package type
export interface PackageTypeUpdateDto {
  name?: string;
  description?: string;
  des1?: string;
  des2?: string;
  des3?: string;
  des4?: string;
  des5?: string;
  price?: number;
  duration?: number;
}

// --- Membership Packages ---
export interface MembershipPackageDto {
  id: string;
  userId: string;
  // add the misspelled key as well as the correct one
  packagetTypeId: string;
  coachId?: string; // Optional, if coach is assigned
  packageTypeId: string;
  packageTypeName: string;
  startDate: string;
  endDate: string;
  active: boolean;
  // …
}
// DTO for creating/updating a membership package
export interface MembershipPackageCreateUpdateDto {
  packageTypeId: string;
  startDate: string;
  endDate: string;
  active: boolean;
  userId?: string; // userId may be required for creation, or inferred by backend
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

/**
 * Lấy thông tin một gói membership theo ID.
 * GET /membership-packages/{id}
 * Dành cho người dùng hiện tại (admin) nếu truy vấn gói của chính họ.
 */
export async function getMembershipPackageById(id: string): Promise<MembershipPackageDto> {
  try {
    const { data } = await membershipApi.get<MembershipPackageDto>(`/membership-packages/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching membership package by ID ${id} (current user):`, error);
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy gói membership với ID này.");
        }
    }
    throw error;
  }
}

/**
 * Cập nhật gói membership của user hiện tại.
 * PUT /membership-packages/{id}
 */
export async function updateMembershipPackage(
  id: string,
  updateData: MembershipPackageCreateUpdateDto
): Promise<MembershipPackageDto> {
  try {
    const { data } = await membershipApi.put<MembershipPackageDto>(`/membership-packages/${id}`, updateData);
    return data;
  } catch (error) {
    console.error(`Error updating membership package ${id} (current user):`, error);
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy gói membership để cập nhật.");
        }
        if (error.response?.status === 400) {
            throw new Error(`Dữ liệu cập nhật không hợp lệ: ${error.response?.data?.message || error.message}`);
        }
    }
    throw error;
  }
}

/**
 * Xóa gói membership của user hiện tại.
 * DELETE /membership-packages/{id}
 */
export async function deleteMembershipPackage(id: string): Promise<void> {
  try {
    await membershipApi.delete(`/membership-packages/${id}`);
  } catch (error) {
    console.error(`Error deleting membership package ${id} (current user):`, error);
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
            throw new Error("Không tìm thấy gói membership để xóa.");
        }
        if (error.response?.status === 403) {
            throw new Error("Bạn không có quyền xóa gói membership này.");
        }
    }
    throw error;
  }
}

/**
 * Tạo gói membership mới cho user hiện tại.
 * POST /membership-packages/create
 */
export async function createMembershipPackage(
  createData: MembershipPackageCreateUpdateDto
): Promise<MembershipPackageDto> {
  try {
    const { data } = await membershipApi.post<MembershipPackageDto>('/membership-packages/create', createData);
    return data;
  } catch (error) {
    console.error('Error creating membership package (current user):', error);
    if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
            throw new Error(`Dữ liệu tạo gói không hợp lệ: ${error.response?.data?.message || error.message}`);
        }
    }
    throw error;
  }
}

/**
 * Lấy danh sách gói membership của user hiện tại.
 * GET /membership-packages/user
 */
export async function getAllMembershipPackagesForCurrentUser(): Promise<MembershipPackageDto[]> {
  try {
    const { data } = await membershipApi.get<MembershipPackageDto[]>('/membership-packages/user');
    return data;
  } catch (error) {
    console.error('Error fetching all membership packages for current user:', error);
    throw error;
  }
}

/**
 * Lấy gói mới nhất của user hiện tại.
 * GET /membership-packages/user/latest
 */
export async function getLatestMembershipPackageForCurrentUser(): Promise<MembershipPackageDto> {
  try {
    const { data } = await membershipApi.get<MembershipPackageDto>('/membership-packages/user/latest');
    return data;
  } catch (error) {
    console.error('Error fetching latest membership package for current user:', error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error("Người dùng hiện không có gói membership nào.");
    }
    throw error;
  }
}


/**
 * Fetch a single package type by ID.
 * GET /package-types/{id}
 */
export async function getPackageTypeById(id: string): Promise<PackageType> {
  try {
    const { data } = await membershipApi.get<PackageType>(`/package-types/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching package type by ID ${id}:`, error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("Không tìm thấy loại gói với ID này.");
    }
    throw error;
  }
}

/**
 * Create a new package type.
 * POST /package-types
 */
export async function createPackageType(newPackage: PackageTypeCreateDto): Promise<PackageType> {
  try {
    const { data } = await membershipApi.post<PackageType>('/package-types', newPackage);
    return data;
  } catch (error) {
    console.error('Error creating package type:', error);
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new Error(`Dữ liệu tạo gói không hợp lệ: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * Update an existing package type.
 * PUT /package-types/{id}
 */
export async function updatePackageType(id: string, updatedPackage: PackageTypeUpdateDto): Promise<PackageType> {
  try {
    const { data } = await membershipApi.put<PackageType>(`/package-types/${id}`, updatedPackage);
    return data;
  } catch (error) {
    console.error(`Error updating package type ${id}:`, error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Không tìm thấy loại gói để cập nhật.");
      }
      if (error.response?.status === 400) {
        throw new Error(`Dữ liệu cập nhật không hợp lệ: ${error.response?.data?.message || error.message}`);
      }
    }
    throw error;
  }
}

/**
 * Delete a package type.
 * DELETE /package-types/{id}
 */
export async function deletePackageType(id: string): Promise<void> {
  try {
    await membershipApi.delete(`/package-types/${id}`);
  } catch (error) {
    console.error(`Error deleting package type ${id}:`, error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Không tìm thấy loại gói để xóa.");
      }
      if (error.response?.status === 403) {
        throw new Error("Bạn không có quyền xóa loại gói này.");
      }
    }
    throw error;
  }
}
