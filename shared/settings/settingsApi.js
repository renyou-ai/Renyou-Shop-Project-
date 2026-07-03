let _baseUrl = '/api';
let _getToken = () => null;

/**
 * Call this once at app startup (e.g. in main.jsx or AppWrapper.jsx)
 * to tell this shared module how to reach your backend and how to
 * read your app's auth token.
 *
 * @param {Object} config
 * @param {string} config.baseUrl - e.g. '/api' or 'http://localhost:5000/api'
 * @param {Function} [config.getToken] - returns the current auth token string
 */
export function configureSettingsApi({ baseUrl, getToken } = {}) {
  if (baseUrl) _baseUrl = baseUrl;
  if (typeof getToken === 'function') _getToken = getToken;
}

async function request(path, options = {}) {
  const token = _getToken();
  const res = await fetch(`${_baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export function fetchUserSettings() {
  return request('/users/me/settings');
}

export function saveUserSettings(payload) {
  return request('/users/me/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}