// import { getAllServices } from './lib/api';

const CATEGORIES = ['Cleaning', 'Plumbing', 'Electrical', 'Salon & Spa', 'Appliance Repair', 'Painting', 'Pest Control', 'Food Delivery'];

export default async function HomePage() {
  let services = [];
  // try {
  //   services = await getAllServices();
  // } catch {
  //   services = []; // backend not ready yet / no services added — fall back gracefully
  // }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <section className="bg-blue-600 text-white rounded-2xl p-8 mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">UrbanFix</h1>
        <p className="text-blue-100">Home services & food delivery, right here in Uttarakhand</p>
      </section>

      <h2 className="text-xl font-semibold mb-4">Browse categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {CATEGORIES.map(cat => (
          <div key={cat} className="bg-white border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition">
            <div className="w-10 h-10 bg-blue-50 rounded-full mx-auto mb-2" />
            <p className="text-sm font-medium">{cat}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Popular services</h2>
      {services.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          <p className="font-medium mb-1">Services coming soon</p>
          <p className="text-sm">Our team is setting things up for your city. Check back shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map(s => (
            <div key={s.id} className="bg-white border rounded-xl p-4 shadow-sm">
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-gray-500">₹{s.price}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}