export const apiFetch = async <T>(
  url: string,
  options: RequestInit = {},
  logout: () => void,
  navigate: (path: string, options?: { state?: Record<string, unknown> }) => void
): Promise<T> => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Check for 401 Unauthorized (invalid or expired token)
  if (response.status === 401) {
    logout();
    navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};