'use client'

import { useState } from 'react';
import Image from 'next/image';

export default function Categories({ categories, subCategories }) {
    const [activeCategory, setActiveCategory] = useState(null);

    if (!categories.length) return null;

    const subsForActive = activeCategory
        ? subCategories.filter((s) => s.category_id === activeCategory.id)
        : [];

    return (
        <section id="categories" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900">What are you looking for?</h2>
                    <p className="text-slate-500 mt-4 text-lg">Browse our wide range of professional services.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category)}
                            className="flex flex-col items-center gap-3 group"
                        >
                            <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden group-hover:bg-blue-50 group-hover:scale-105 transition-all">
                                {category.image_url ? (
                                    <Image src={category.image_url} alt={category.name} width={64} height={64} className="object-contain" />
                                ) : (
                                    <span className="text-4xl">🛠️</span>
                                )}
                            </div>
                            <span className="text-sm font-medium text-slate-700 text-center">
                                {category.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {activeCategory && (
                <CategoryModal
                    category={activeCategory}
                    subCategories={subsForActive}
                    onClose={() => setActiveCategory(null)}
                />
            )}
        </section>
    );
}

function CategoryModal({ category, subCategories, onClose }) {
    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-2xl w-full mx-4 mt-16 mb-16 p-8 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-lg"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-slate-900 mb-8">{category.name}</h2>

                {subCategories.length === 0 ? (
                    <p className="text-slate-400 italic">More coming soon...</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {subCategories.map((sub) => (
                            <a
                                key={sub.id}
                                href={`/services?sub_category=${sub.id}`}
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center text-3xl group-hover:bg-blue-50 transition-colors">
                                    🔧
                                </div>
                                <span className="text-sm text-center text-slate-700">{sub.name}</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}