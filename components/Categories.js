export default function Categories({ categories, subCategories }) {
    if (!categories.length) return null;

    return (
        <section id="categories" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900">What are you looking for?</h2>
                    <p className="text-slate-500 mt-4 text-lg">Browse our wide range of professional services.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map(category => {
                        // Find sub-categories that belong to this category
                        const subs = subCategories.filter(s => s.category_id === category.id);

                        return (
                            <div key={category.id} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                                <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                                {subs.length > 0 ? (
                                    <ul className="space-y-3">
                                        {subs.map(sub => (
                                            <li key={sub.id} className="flex items-center text-slate-600">
                                                <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                                {sub.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">More coming soon...</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}