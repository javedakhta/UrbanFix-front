import { fetchCategories, fetchSubCategories, fetchCities, getAllServices } from '@/app/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import Cities from '@/components/Cities';
import Services from '@/components/Services';
import LogoutButton from '@/components/LogoutButton';

export default async function HomePage() {
  // Fetch all data in parallel on the server
  const [categoriesRes, subCategoriesRes, citiesRes, servicesRes] = await Promise.all([
    fetchCategories().catch(() => ({ categories: [] })),
    fetchSubCategories().catch(() => ({ sub_categories: [] })),
    fetchCities().catch(() => ({ cities: [] })),
    getAllServices().catch(() => ({ services: [] })) // Adjust if this needs a token
  ]);

  const categories = categoriesRes.categories || [];
  const subCategories = subCategoriesRes.sub_categories || [];
  const cities = citiesRes.cities || [];
  const services = servicesRes.services || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <LogoutButton />
      <main className="flex-grow">
        <Hero />
        <Categories categories={categories} subCategories={subCategories} />
        <Services services={services} />
        <Cities cities={cities} />
      </main>

      <Footer />
    </div>
  );
}