const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function authedRequest(path, token, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        ...options,
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend Error: ${res.status} - ${errorText}`);
    }

    return res.json();
}

export function getMyProfile(token) {
    return authedRequest('/users/me', token);
}

export function getAllServices(token) {
    return authedRequest('/services', token);
}

export function createService(payload, token) {
    return authedRequest('/services', token, { method: 'POST', body: JSON.stringify(payload) });
}

export function deleteService(id, token) {
    return authedRequest(`/services/${id}`, token, { method: 'DELETE' });
}