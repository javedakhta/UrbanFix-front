"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useAuthCheck } from '@/context/AuthContext';
import LogoutButton from './LogoutButton';

export default function Navbar() {
    const { user, role, loading } = useAuthCheck();
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        // adjust this route once your services listing page exists
        window.location.href = `/services?q=${encodeURIComponent(search)}`;
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            UrbanFix
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium">Home</Link>
                        <Link href="#services" className="text-slate-600 hover:text-blue-600 font-medium">Services</Link>
                        <Link href="#cities" className="text-slate-600 hover:text-blue-600 font-medium">Locations</Link>
                    </nav>

                    {/* adding code for search button  */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search services..."
                            className="w-full px-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </form>

                    <div className="flex items-center space-x-4">
                        <button className="text-slate-600 hover:text-blue-600 text-sm font-medium">
                            📍 Location
                        </button>

                        {loading ? null : !user ? (
                            <>
                                <Link href="/login" className="text-slate-600 hover:text-blue-600 font-medium">Log in</Link>
                                <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <>
                                {role === 'admin' && (
                                    <Link href="/admin" className="text-slate-600 hover:text-blue-600 font-medium">Admin</Link>
                                )}
                                <LogoutButton />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}