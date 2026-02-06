import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import apiClient from '../lib/api';
import { Search, Star, Users, Clock, BookOpen } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, [page, search]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/courses', {
        params: { search, page, limit: 9 }
      });
      setCourses(data.courses);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCourses();
  };

  return (
    <Layout title="Courses - LearnHub">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-display text-5xl gradient-text mb-4">
            Explore Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover thousands of courses taught by expert instructors
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in animate-delay-100">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
            />
          </form>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        ) : (
          <>
            {/* Course Grid */}
            <div className="course-grid mb-12">
              {courses.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Course Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 flex items-center justify-center">
                    <BookOpen className="text-white" size={64} />
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm font-semibold text-gray-900">
                          {course.averageRating > 0 ? course.averageRating.toFixed(1) : 'New'}
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users size={16} />
                        <span className="text-sm">{course.enrollmentCount} students</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        By {course.instructor.name}
                      </div>
                      <div className="badge badge-info">
                        {course.reviewCount} reviews
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:border-purple-500 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:border-purple-500 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
