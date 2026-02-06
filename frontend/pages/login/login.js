import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      
      // Redirect based on role
      if (user.role === 'STUDENT') {
        router.push('/dashboard/student');
      } else if (user.role === 'INSTRUCTOR') {
        router.push('/dashboard/instructor');
      } else if (user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login - LearnHub">
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="font-display text-4xl gradient-text mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to continue your learning journey</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-slide-down">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner mr-2" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Quick Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center mb-3">Demo Accounts (for testing)</p>
              <div className="space-y-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-semibold">Student:</span> student@example.com / password123
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-semibold">Instructor:</span> instructor@example.com / password123
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-semibold">Admin:</span> admin@example.com / password123
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
