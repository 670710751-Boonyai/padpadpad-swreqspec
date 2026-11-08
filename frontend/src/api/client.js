// รองรับ: FR-ENR-01, FR-ENR-02, CON-ENR-02, NFR-SEC-01
class ApiRequestError extends Error {
  constructor(status, payload) {
    super(`API request failed with status ${status}.`);
    this.name = 'ApiRequestError';
    this.status = status;
    this.errors = Array.isArray(payload?.errors) ? payload.errors : [];
  }
}

// รองรับ: FR-ENR-01, FR-ENR-02, FR-ENR-03, FR-ENR-04, FR-ENR-05, FR-ENR-06, FR-ENR-07
export function createApiClient({
  baseUrl = '',
  fetchImpl = globalThis.fetch,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new TypeError('fetchImpl must be a function.');
  }

  // รองรับ: FR-ENR-01, FR-ENR-02, FR-ENR-03, FR-ENR-04, FR-ENR-05, FR-ENR-06, FR-ENR-07
  async function request(path, options = {}, { allowNotFound = false } = {}) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      credentials: 'include',
      ...options,
    });

    if (!response.ok && !(allowNotFound && response.status === 404)) {
      const contentType = response.headers?.get('content-type') ?? '';
      const payload = contentType.includes('application/json')
        ? await response.json()
        : undefined;
      throw new ApiRequestError(response.status, payload);
    }

    return response;
  }

  return {
    // รองรับ: FR-ENR-01, FR-ENR-02, CON-ENR-01, CON-ENR-02
    getConfiguredCamp() {
      return request('/enrollment/camp');
    },

    // รองรับ: FR-ENR-02, CON-ENR-02, NFR-SEC-01
    getDraft() {
      return request('/applications/draft', {}, { allowNotFound: true });
    },

    // รองรับ: FR-ENR-02, CON-ENR-02
    saveDraft(formData) {
      return request('/applications/draft', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_data: formData }),
      });
    },

    // รองรับ: FR-ENR-06, FR-ENR-07
    submitApplication() {
      return request('/applications/submit', { method: 'POST' });
    },

    // รองรับ: FR-ENR-07, NFR-DATA-01, NFR-SEC-01
    getApplication(applicationId) {
      return request(`/applications/${encodeURIComponent(applicationId)}`);
    },
  };
}

export const apiClient = createApiClient();
