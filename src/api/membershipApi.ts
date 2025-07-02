import axios from 'axios';

const membershipApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT token to every request
membershipApi.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interface matching the package type structure returned by /package-types/get-all
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
  createAt: string;
}

/**
 * Fetch all package types for membership plans
 */
export async function getAllPackageTypes(): Promise<PackageType[]> {
  const { data } = await membershipApi.get<PackageType[]>('/package-types/get-all');
  return data;
}
