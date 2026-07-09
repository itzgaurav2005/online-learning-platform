import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'STUDENT':
        return '/dashboard/student';
      case 'INSTRUCTOR':
        return '/dashboard/instructor';
      case 'ADMIN':
        return '/dashboard/admin';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                <BookOpen className="text-white" size={24} />
              </div>
              <span className="font-display text-2xl gradient-text">LearnHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/courses"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Courses
            </Link>

            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-lg">
                    <User size={18} className="text-purple-600" />
                    <div className="text-sm">
                      <div className="font-semibold text-gray-800">{user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-down">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link
              href="/courses"
              className="block py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>

            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="block py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <div className="py-2 px-3 bg-purple-50 rounded-lg">
                  <div className="font-semibold text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{user.role.toLowerCase()}</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-600 hover:text-red-700 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block py-2 text-purple-600 hover:text-purple-700 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
