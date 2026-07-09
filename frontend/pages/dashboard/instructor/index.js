import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../lib/api';
import Link from 'next/link';
import { 
  BookOpen, Plus, Users, TrendingUp, Eye, Edit, Trash2, 
  CheckCircle, XCircle, Star, Calendar, BarChart3 
} from 'lucide-react';

export default function InstructorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'INSTRUCTOR') {
        router.push('/');
      } else {
        fetchDashboardData();
      }
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      const { data } = await apiClient.get('/courses/instructor/my-courses');
      setCourses(data.courses);
      
      // Calculate stats
      const totalCourses = data.courses.length;
      const publishedCourses = data.courses.filter(c => c.isPublished).length;
      const totalEnrollments = data.courses.reduce((sum, c) => sum + c._count.enrollments, 0);
      const totalReviews = data.courses.reduce((sum, c) => sum + c._count.reviews, 0);
      
      setStats({
        totalCourses,
        publishedCourses,
        totalEnrollments,
        totalReviews,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiClient.delete(`/courses/${courseId}`);
      setCourses(courses.filter(c => c.id !== courseId));
      alert('Course deleted successfully');
      fetchDashboardData(); // Refresh stats
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete course');
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Instructor Dashboard - LearnHub">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 animate-fade-in">
          <div>
            <h1 className="font-display text-4xl gradient-text mb-2">
              Instructor Dashboard
            </h1>
            <p className="text-gray-600">Manage your courses and students</p>
          </div>
          <Link 
            href="/dashboard/instructor/courses/create"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Create New Course</span>
          </Link>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 rounded-lg p-3">
                  <BookOpen className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold gradient-text">{stats.totalCourses}</div>
              <div className="text-gray-600">Total Courses</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 rounded-lg p-3">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600">{stats.publishedCourses}</div>
              <div className="text-gray-600">Published</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 rounded-lg p-3">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalEnrollments}</div>
              <div className="text-gray-600">Total Students</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-100 rounded-lg p-3">
                  <Star className="text-yellow-600" size={24} />
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-600">{stats.totalReviews}</div>
              <div className="text-gray-600">Reviews</div>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>

          {courses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Create your first course and start teaching</p>
              <Link href="/dashboard/instructor/courses/create" className="btn-primary inline-block">
                <Plus className="inline mr-2" size={20} />
                Create Course
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Course Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                        <div className="flex items-center space-x-2">
                          {course.isPublished ? (
                            <span className="badge badge-success">
                              <CheckCircle size={14} className="mr-1" />
                              Published
                            </span>
                          ) : (
                            <span className="badge badge-warning">
                              <XCircle size={14} className="mr-1" />
                              Draft
                            </span>
                          )}
                          {course.isApproved && (
                            <span className="badge badge-info">Approved</span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users size={16} />
                          <span>{course._count.enrollments} students</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen size={16} />
                          <span>{course._count.modules} modules</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-yellow-500" />
                          <span>{course._count.reviews} reviews</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <Link
                        href={`/dashboard/instructor/courses/${course.id}/students`}
                        className="btn-secondary text-sm flex items-center justify-center space-x-2"
                      >
                        <Users size={16} />
                        <span>Students</span>
                      </Link>
                      
                      <Link
                        href={`/dashboard/instructor/courses/${course.id}/edit`}
                        className="btn-primary text-sm flex items-center justify-center space-x-2"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </Link>
                      
                      <Link
                        href={`/courses/${course.id}`}
                        className="btn-secondary text-sm flex items-center justify-center space-x-2"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </Link>
                      
                      <button
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm flex items-center justify-center space-x-2"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}