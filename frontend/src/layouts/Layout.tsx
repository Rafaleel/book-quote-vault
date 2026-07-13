import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
