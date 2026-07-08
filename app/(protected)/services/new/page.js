'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createService } from '@/lib/api';

const CATEGORIES = ['Cleaning', 'Plumbing', 'Electrical', 'Salon & Spa', 'Appliance Repair', 'Painting', 'Pest Control', 'Food Delivery'];
const TOWNS = ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Haldwani', 'Roorkee'];

export default function NewServicePage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '', category: CATEGORIES[0], price: '', duration_minutes: '', description: '', city: TOWNS[0],
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await createService(form);
            router.push('/admin/services');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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

                <div>
                    <label className="text-sm font-medium">Category</label>
                    <select name="category" value={form.category} onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
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
                    <label className="text-sm font-medium">Available in city/town</label>
                    <select name="city" value={form.city} onChange={handleChange}
                        className="w-full mt-1 border rounded-lg px-3 py-2">
                        {TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                        className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>

                <button type="submit" disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-50">
                    {loading ? 'Saving...' : 'Add service'}
                </button>
            </form>
        </div>
    );
}