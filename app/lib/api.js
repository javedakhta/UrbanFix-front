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

// export function getMyProfile(token) {
//     return authedRequest('/users/me', token);
// }

export function getAllServices(token) {
    return authedRequest('/services', token);
}

export function createService(payload, token) {
    return authedRequest('/services', token, { method: 'POST', body: JSON.stringify(payload) });
}

// export function deleteService(id, token) {
//     return authedRequest(`/services/${id}`, token, { method: 'DELETE' });
// }

export async function fetchCategories() {
    const res = await fetch(`${BASE_URL}/services/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}

export async function createCategory(name, token) {
    const res = await fetch(`${BASE_URL}/services/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create category');
    return data;
}

export async function createSubCategory(category_id, name, token) {
    const res = await fetch(`${BASE_URL}/services/sub-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ category_id, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create sub-category');
    return data;
}

export async function createCity(name, token) {
    const res = await fetch(`${BASE_URL}/services/cities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create city');
    return data;
}


export async function fetchSubCategories() {
    const res = await fetch(`${BASE_URL}/services/sub-categories`);
    if (!res.ok) throw new Error('Failed to fetch sub-categories');
    return res.json();
}

export async function fetchCities() {
    const res = await fetch(`${BASE_URL}/services/cities`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return res.json();
}

// @/app/lib/api.js

export async function getServiceById(id) {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
        // Optional: If you want Next.js to revalidate this data periodically
        // next: { revalidate: 60 } 
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch service details');
    }

    return res.json();
}