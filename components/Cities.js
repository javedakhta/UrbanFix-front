export default function Cities({ cities }) {
    if (!cities.length) return null;

    return (
        <section id="cities" className="py-20 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">We are available in</h2>
                <p className="text-slate-500 mb-10 max-w-2xl mx-auto">We are rapidly expanding. Find trusted service professionals in these cities across the region.</p>

                <div className="flex flex-wrap justify-center gap-4">
                    {cities.map(city => (
                        <div key={city.id} className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-6 py-3 shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-default">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-semibold text-slate-700">{city.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}