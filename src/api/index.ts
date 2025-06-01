const BASE_URL = import.meta.env.VITE_API_URL || '';

async function baseFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  return response;
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
