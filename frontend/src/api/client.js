const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function apiRequest(path, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const init = { ...options, headers };
    if (options.body !== undefined) {
        init.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_URL}${path}`, init);

    let data = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (response.status === 401 && token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new CustomEvent('auth:expired'));
    }

    if (!response.ok) {
        const message = (data && (data.error || data.message)) || response.statusText;
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }

    return data;
}

export const api = {
    get: (path) => apiRequest(path),
    post: (path, body) => apiRequest(path, { method: 'POST', body }),
    put: (path, body) => apiRequest(path, { method: 'PUT', body }),
    patch: (path, body) => apiRequest(path, { method: 'PATCH', body }),
    delete: (path) => apiRequest(path, { method: 'DELETE' })
};
