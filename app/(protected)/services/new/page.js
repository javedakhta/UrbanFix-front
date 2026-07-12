'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createService, fetchCategories, fetchSubCategories, fetchCities } from '@/app/lib/api';
import { useAuthCheck } from '@/context/AuthContext';

export default function NewServicePage() {
    const router = useRouter();

    // States for dropdown data
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [form, setForm] = useState({
        name: '',
        category_id: '',
        sub_category_id: '',
        price: '',
        duration_minutes: '',
        description: '',
        city_ids: []
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuthCheck();

    // Fetch data on component mount
    useEffect(() => {
        async function loadFormData() {
            try {
                // Fetch all data in parallel for better performance
                const [catsRes, subCatsRes, citiesRes] = await Promise.all([
                    fetchCategories(),
                    fetchSubCategories(),
                    fetchCities()
                ]);

                // Assuming your backend returns { success: true, categories: [...] }, etc.
                setCategories(catsRes.categories || []);
                setSubCategories(subCatsRes.sub_categories || []);
                setCities(citiesRes.cities || []);
            } catch (err) {
                setError("Failed to load form data. Please try refreshing the page.");
                console.error(err);
            } finally {
                setIsLoadingData(false);
            }
        }
        loadFormData();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => {
            const updatedForm = { ...prev, [name]: value };
            // Reset sub_category if category changes
            if (name === 'category_id') {
                updatedForm.sub_category_id = '';
            }
            return updatedForm;
        });
    }

    function handleCityToggle(cityId) {
        setForm(prev => {
            const isSelected = prev.city_ids.includes(cityId);
            return {
                ...prev,
                city_ids: isSelected
                    ? prev.city_ids.filter(id => id !== cityId)
                    : [...prev.city_ids, cityId]
            };
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (form.city_ids.length === 0) {
            return setError("Please select at least one city.");
        }

        setLoading(true);
        try {
            const token = await getToken();
            const payload = {
                ...form,
                category_id: parseInt(form.category_id, 10),
                sub_category_id: parseInt(form.sub_category_id, 10),
                price: form.price,
                city_ids: form.city_ids
            };

            await createService(payload, token);
            router.push('/admin/services');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Filter sub-categories based on the dynamically fetched list
    const availableSubCategories = subCategories.filter(
        sub => sub.category_id.toString() === form.category_id.toString()
    );

    // Show a loading screen while fetching database categories
    if (isLoadingData) {
        return <div className="p-4 text-gray-500 text-sm font-medium">Loading form options...</div>;
    }

    return (
        <div className="max-w-lg">
            <h1 className="text-xl font-semibold mb-4">Add a service</h1>
            {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
                <div>
                    <label className="text-sm font-medium">Service name</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                        className="w-full mt-1 border rounded-lg px-3 py-2" placeholder="e.g. Deep Home Cleaning" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-medium">Category</label>
                        <select name="category_id" value={form.category_id} onChange={handleChange} required
                            className="w-full mt-1 border rounded-lg px-3 py-2">
                            <option value="" disabled>Select category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Sub-category</label>
                        <select name="sub_category_id" value={form.sub_category_id} onChange={handleChange} required
                            disabled={!form.category_id || availableSubCategories.length === 0}
                            className="w-full mt-1 border rounded-lg px-3 py-2 disabled:bg-gray-100">
                            <option value="" disabled>Select sub-category</option>
                            {availableSubCategories.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                        {/* Helpful hint if a category is selected but it has no sub-categories in DB yet */}
                        {form.category_id && availableSubCategories.length === 0 && (
                            <p className="text-xs text-red-500 mt-1">No sub-categories found for this category.</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-medium">Price (₹)</label>
                        <input type="number" name="price" value={form.price} onChange={handleChange} required
                            className="w-full mt-1 border rounded-lg px-3 py-2" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Duration (mins)</label>
                        <input type="number" name="duration_minutes" value={form.duration_minutes} onChange={handleChange}
                            className="w-full mt-1 border rounded-lg px-3 py-2" />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium block mb-2">Available in cities/towns</label>
                    {cities.length === 0 ? (
                        <p className="text-sm text-gray-500 border p-3 rounded-lg bg-gray-50">No cities added to database yet.</p>
                    ) : (
                        <div className="grid grid-cols-3 gap-2 p-3 border rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                            {cities.map(city => (
                                <label key={city.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.city_ids.includes(city.id)}
                                        onChange={() => handleCityToggle(city.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>{city.name}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3} required
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                <button type="submit" disabled={loading || isLoadingData}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-50">
                    {loading ? 'Saving...' : 'Add service'}
                </button>
            </form>
        </div>
    );
}