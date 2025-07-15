const BASE_URL = import.meta.env.VITE_API_URL || '';

async function baseFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem('token');
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error || `HTTP ${response.status} - ${response.statusText}`);
  }

  return data;
}

export const fetchWrapper = {
  get: (endpoint: string) => baseFetch(endpoint, { method: 'GET' }),
  post: (endpoint: string, data: unknown) =>
    baseFetch(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data: unknown) =>
    baseFetch(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string) =>
    baseFetch(endpoint, { method: 'DELETE' }),
};