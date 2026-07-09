import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import { useAuth } from '../../../../context/AuthContext';
import apiClient from '../../../../lib/api';
import { BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateCourse() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await apiClient.post('/courses', formData);
      alert('Course created successfully!');
      router.push(`/dashboard/instructor/courses/${data.course.id}/edit`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'INSTRUCTOR') {
    return null;
  }

  return (
    <Layout title="Create Course - LearnHub">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/dashboard/instructor"
          className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="font-display text-4xl gradient-text mb-2">
            Create New Course
          </h1>
          <p className="text-gray-600">Share your knowledge with the world</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in animate-delay-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-slide-down">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Complete Web Development Bootcamp"
              />
              <p className="mt-1 text-xs text-gray-500">
                Choose a clear, descriptive title that tells students what they'll learn
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe what students will learn in this course..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Explain the course content, who it's for, and what students will achieve
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Next Steps</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• After creating, you'll add modules and lessons</li>
                <li>• Publish your course when it's ready</li>
                <li>• Admin will review and approve it</li>
                <li>• Then students can enroll!</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner mr-2" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                    Creating...
                  </span>
                ) : (
                  'Create Course'
                )}
              </button>
              <Link
                href="/dashboard/instructor"
                className="flex-1 btn-secondary text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}