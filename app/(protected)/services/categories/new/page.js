'use client'
import { useState, useEffect } from 'react';
import { fetchCategories, createCategory, createSubCategory, createCity, uploadImageToR2 } from '@/app/lib/api';
import { useAuthCheck } from '@/context/AuthContext';

export default function MasterDataPage() {
    const { getToken } = useAuthCheck();
    const [categories, setCategories] = useState([]);

    // States for inputs
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState(null); // NEW

    const [cityName, setCityName] = useState('');
    const [cityImage, setCityImage] = useState(null); // NEW

    const [subCat, setSubCat] = useState({ category_id: '', name: '' });
    const [subCatImage, setSubCatImage] = useState(null); // NEW

    // Loading & Status states
    const [loading, setLoading] = useState({ category: false, subCategory: false, city: false });
    const [message, setMessage] = useState({ text: '', type: '' });

    // Fetch categories on load
    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const data = await fetchCategories();
            setCategories(data.categories || []);
        } catch (err) {
            showMsg('Failed to load categories', 'error');
        }
    }

    function showMsg(text, type) {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }

    async function handleAddCategory(e) {
        e.preventDefault();
        setLoading(prev => ({ ...prev, category: true }));
        try {
            const token = await getToken();

            // 1. Upload Image (if selected)
            const imageUrl = await uploadImageToR2(categoryImage, token);

            // 2. Create Category
            const res = await createCategory(categoryName, imageUrl, token);
            setCategories([...categories, res.category]);

            // 3. Reset form
            setCategoryName('');
            setCategoryImage(null);
            e.target.reset(); // Clears the file input UI

            showMsg('Category added successfully', 'success');
        } catch (err) {
            showMsg(err.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, category: false }));
        }
    }

    async function handleAddSubCategory(e) {
        e.preventDefault();
        setLoading(prev => ({ ...prev, subCategory: true }));
        try {
            const token = await getToken();

            // 1. Upload Image
            const imageUrl = await uploadImageToR2(subCatImage, token);

            // 2. Create Sub-Category
            await createSubCategory(parseInt(subCat.category_id), subCat.name, imageUrl, token);

            // 3. Reset form
            setSubCat({ category_id: '', name: '' });
            setSubCatImage(null);
            e.target.reset();

            showMsg('Sub-category added successfully', 'success');
        } catch (err) {
            showMsg(err.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, subCategory: false }));
        }
    }

    async function handleAddCity(e) {
        e.preventDefault();
        setLoading(prev => ({ ...prev, city: true }));
        try {
            const token = await getToken();

            // 1. Upload Image
            const imageUrl = await uploadImageToR2(cityImage, token);

            // 2. Create City
            await createCity(cityName, imageUrl, token);

            // 3. Reset form
            setCityName('');
            setCityImage(null);
            e.target.reset();

            showMsg('City added successfully', 'success');
        } catch (err) {
            showMsg(err.message, 'error');
        } finally {
            setLoading(prev => ({ ...prev, city: false }));
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Database Management</h1>

            {message.text && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">

                {/* 1. Add Category Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Add Category</h2>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Category Name</label>
                            <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required
                                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Cleaning" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Image (Optional)</label>
                            <input type="file" accept="image/jpeg, image/png, image/webp"
                                onChange={(e) => setCategoryImage(e.target.files[0])}
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none" />
                        </div>
                        <button type="submit" disabled={loading.category}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-50">
                            {loading.category ? 'Adding...' : 'Add Category'}
                        </button>
                    </form>
                </div>

                {/* 2. Add Sub-Category Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Add Sub-Category</h2>
                    <form onSubmit={handleAddSubCategory} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Parent Category</label>
                            <select
                                value={subCat.category_id}
                                onChange={(e) => setSubCat({ ...subCat, category_id: e.target.value })}
                                required
                                className="w-full mt-1 border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="" disabled>Select parent</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Sub-Category Name</label>
                            <input type="text" value={subCat.name} onChange={(e) => setSubCat({ ...subCat, name: e.target.value })} required
                                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Sofa Cleaning" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Image (Optional)</label>
                            <input type="file" accept="image/jpeg, image/png, image/webp"
                                onChange={(e) => setSubCatImage(e.target.files[0])}
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none" />
                        </div>
                        <button type="submit" disabled={loading.subCategory}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-50">
                            {loading.subCategory ? 'Adding...' : 'Add Sub-Category'}
                        </button>
                    </form>
                </div>

                {/* 3. Add City Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Add City</h2>
                    <form onSubmit={handleAddCity} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">City Name</label>
                            <input type="text" value={cityName} onChange={(e) => setCityName(e.target.value)} required
                                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. New York" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Image (Optional)</label>
                            <input type="file" accept="image/jpeg, image/png, image/webp"
                                onChange={(e) => setCityImage(e.target.files[0])}
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:outline-none" />
                        </div>
                        <button type="submit" disabled={loading.city}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-50">
                            {loading.city ? 'Adding...' : 'Add City'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}