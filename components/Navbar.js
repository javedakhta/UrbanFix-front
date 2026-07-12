import Link from 'next/link';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            ServiceHub
                        </Link>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium">Home</Link>
                        <Link href="#services" className="text-slate-600 hover:text-blue-600 font-medium">Services</Link>
                        <Link href="#cities" className="text-slate-600 hover:text-blue-600 font-medium">Locations</Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-slate-600 hover:text-blue-600 font-medium">Log in</Link>
                        <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}