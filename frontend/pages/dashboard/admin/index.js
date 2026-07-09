import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../lib/api';
import Link from 'next/link';
import { 
  Users, BookOpen, TrendingUp, Star, 
  BarChart3, Activity, Award, Calendar
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchAnalytics();
      }
    }
  }, [user, authLoading]);

  const fetchAnalytics = async () => {
    try {
      const { data } = await apiClient.get('/admin/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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
    <Layout title="Admin Dashboard - LearnHub">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="font-display text-4xl gradient-text mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Platform analytics and management</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link 
            href="/dashboard/admin/users"
            className="bg-white rounded-2xl shadow-lg p-6 card-hover group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition-colors">
                <Users className="text-blue-600" size={24} />
              </div>
              <span className="text-blue-600 font-semibold">Manage →</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Users</h3>
            <p className="text-gray-600">View and manage all platform users</p>
          </Link>

          <Link 
            href="/dashboard/admin/courses"
            className="bg-white rounded-2xl shadow-lg p-6 card-hover group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-lg p-3 group-hover:bg-purple-200 transition-colors">
                <BookOpen className="text-purple-600" size={24} />
              </div>
              <span className="text-purple-600 font-semibold">Manage →</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Courses</h3>
            <p className="text-gray-600">Review and approve courses</p>
          </Link>

          <Link 
            href="/dashboard/admin/analytics"
            className="bg-white rounded-2xl shadow-lg p-6 card-hover group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-lg p-3 group-hover:bg-green-200 transition-colors">
                <BarChart3 className="text-green-600" size={24} />
              </div>
              <span className="text-green-600 font-semibold">View →</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">Detailed platform statistics</p>
          </Link>
        </div>

        {/* Overview Stats */}
        {analytics && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold gradient-text">
                  {analytics.overview.totalUsers}
                </div>
                <div className="text-gray-600">Total Users</div>
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students</span>
                    <span className="font-semibold">{analytics.usersByRole.STUDENT || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Instructors</span>
                    <span className="font-semibold">{analytics.usersByRole.INSTRUCTOR || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admins</span>
                    <span className="font-semibold">{analytics.usersByRole.ADMIN || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <BookOpen className="text-purple-600" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-600">
                  {analytics.overview.totalCourses}
                </div>
                <div className="text-gray-600">Total Courses</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 rounded-lg p-3">
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {analytics.overview.totalEnrollments}
                </div>
                <div className="text-gray-600">Total Enrollments</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 rounded-lg p-3">
                    <Star className="text-yellow-600" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-600">
                  {analytics.overview.totalReviews}
                </div>
                <div className="text-gray-600">Total Reviews</div>
              </div>
            </div>

            {/* Top Courses */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Award className="text-purple-600" size={28} />
                <span>Top Courses by Enrollment</span>
              </h3>
              
              <div className="space-y-4">
                {analytics.topCourses.slice(0, 10).map((course, index) => (
                  <div 
                    key={course.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">by {course.instructor}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-purple-600">{course.enrollments}</div>
                        <div className="text-gray-500">Students</div>
                      </div>
                      <Link 
                        href={`/courses/${course.id}`}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Enrollments */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <Activity className="text-green-600" size={28} />
                <span>Recent Enrollments</span>
              </h3>
              
              <div className="space-y-3">
                {analytics.recentEnrollments.map((enrollment, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="font-semibold text-purple-600">
                          {enrollment.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{enrollment.user}</div>
                        <div className="text-sm text-gray-600">enrolled in {enrollment.course}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      <span>{new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}