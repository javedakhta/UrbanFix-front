export default function Services({ services }) {
    if (!services.length) return null;

    return (
        <section id="services" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Popular Services</h2>
                        <p className="text-slate-500 mt-2">Highly rated professionals ready to help.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.slice(0, 8).map(service => (
                        <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{service.name}</h3>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-grow">{service.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                <span className="text-2xl font-black text-slate-900">
                                    ₹{service.price}
                                </span>
                                <button className="text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}