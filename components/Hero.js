export default function Hero() {
    return (
        <section className="relative bg-white overflow-hidden">
            <div className="absolute inset-0 bg-blue-50/50 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                        Expert services, <br className="hidden md:block" /> right at your doorstep.
                    </h1>
                    <p className="text-xl text-slate-600 mb-10">
                        From deep cleaning to expert plumbing, book trusted professionals in your city instantly.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="#services" className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30">
                            Book a Service
                        </a>
                        <a href="#categories" className="bg-white text-slate-700 px-8 py-4 rounded-full text-lg font-semibold border border-slate-200 hover:bg-slate-50 transition shadow-sm">
                            Explore Categories
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}