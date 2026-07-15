'use client'
import { useRef } from 'react';
import Image from 'next/image';

export default function Services({ services }) {
    const scrollRef = useRef(null);

    if (!services.length) return null;

    function scroll(direction) {
        if (!scrollRef.current) return;
        const amount = 320; // roughly one card width
        scrollRef.current.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' });
    }

    return (
        <section id="services" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-medium text-slate-900">Popular Services</h2>
                        <p className="text-slate-500 mt-2">Highly rated professionals ready to help.</p>
                    </div>
                </div>

                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>

                    <button
                        onClick={() => scroll('right')}
                        className="hidden md:flex absolute right-0 top-1/3 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:shadow-lg transition-shadow"
                        aria-label="Scroll right"
                    >
                        →
                    </button>
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ service }) {
    const hasDiscount = service.original_price && service.original_price !== service.price;

    return (
        <a
            href={`/services/${service.id}`}
            className="flex-shrink-0 w-64 group cursor-pointer"
        >
            <div className="w-full h-64 rounded-2xl overflow-hidden bg-slate-100 mb-3 relative">
                {service.image_url ? (
                    <Image
                        src={service.image_url}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300">
                        🧰
                    </div>
                )}
            </div>

            <h3 className="font-semibold text-slate-900 leading-snug mb-1">{service.name}</h3>

            <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-1">
                {service.rating > 0 && (
                    <>
                        <span className="text-black">★</span>
                        <span className="font-medium">{service.rating}</span>
                    </>
                )}
                {service.is_instant === 1 && (
                    <>
                        <span className="text-slate-400">•</span>
                        <span className="text-green-600 font-medium">⚡ Instant</span>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">₹{service.price}</span>
                {hasDiscount && (
                    <span className="text-slate-400 line-through text-sm">₹{service.original_price}</span>
                )}
            </div>
        </a>
    );
}