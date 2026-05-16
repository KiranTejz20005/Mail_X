const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  base: API_BASE,
  getEmails: () => `${API_BASE}/get-emails`,
  summarize: () => `${API_BASE}/summarize`,
  generateResponse: () => `${API_BASE}/generate-response`,
  saveResponse: () => `${API_BASE}/save-response`,
  updateProfile: () => `${API_BASE}/auth/profile`,
  gmailStatus: () => `${API_BASE}/auth/gmail/status`,
  gmailAuthUrl: () => `${API_BASE}/auth/gmail/url`,
  gmailSync: () => `${API_BASE}/auth/gmail/sync`,
  gmailDisconnect: () => `${API_BASE}/auth/gmail/disconnect`,
};

export function authHeaders(accessToken: string | undefined) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

export async function apiFetch(
  url: string,
  accessToken: string | undefined,
  options: RequestInit = {}
) {
  return fetch(url, {
    ...options,
    headers: {
      ...authHeaders(accessToken),
      ...(options.headers as Record<string, string>),
    },
  });
}
