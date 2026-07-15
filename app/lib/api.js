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

// --- NEW: Helper function to upload images to R2 ---
export async function uploadImageToR2(file, token) {
    if (!file) return null;

    const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });

    const uploadRes = await fetch(`${BASE_URL}/upload-image`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            imageBase64: base64String,
            mimeType: file.type,
            originalName: file.name
        }),
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");

    return uploadData.imageUrl;
}

export function getAllServices(token) {
    return authedRequest('/services', token);
}

export function createService(payload, token) {
    return authedRequest('/services', token, { method: 'POST', body: JSON.stringify(payload) });
}

export async function fetchCategories() {
    const res = await fetch(`${BASE_URL}/services/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}

// Updated to accept imageUrl
export async function createCategory(name, imageUrl, token) {
    const res = await fetch(`${BASE_URL}/services/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, imageUrl }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create category');
    return data;
}

// Updated to accept imageUrl
export async function createSubCategory(category_id, name, imageUrl, token) {
    const res = await fetch(`${BASE_URL}/services/sub-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ category_id, name, imageUrl }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create sub-category');
    return data;
}

// Updated to accept imageUrl
export async function createCity(name, imageUrl, token) {
    const res = await fetch(`${BASE_URL}/services/cities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, imageUrl }),
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

export async function getServiceById(id) {
    const res = await fetch(`${BASE_URL}/services/${id}`);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch service details');
    }
    return res.json();
}