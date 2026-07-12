export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">ServiceHub</h3>
                    <p className="text-sm text-slate-400">Professional home services on demand. Quality, reliability, and transparent pricing.</p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Partner with us</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
                &copy; {new Date().getFullYear()} ServiceHub. All rights reserved.
            </div>
        </footer>
    );
}