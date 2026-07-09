import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../lib/api';
import Link from 'next/link';
import { 
  ArrowLeft, BarChart3, TrendingUp, Users, BookOpen, 
  Star, Award, Activity, Calendar
} from 'lucide-react';

export default function AdminAnalytics() {
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

  if (!analytics) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Failed to load analytics</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Platform Analytics - Admin Dashboard">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/dashboard/admin"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl">
              <BarChart3 className="text-white" size={32} />
            </div>
            <div>
              <h1 className="font-display text-4xl gradient-text">
                Platform Analytics
              </h1>
              <p className="text-gray-600">Comprehensive platform statistics and insights</p>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Users className="text-blue-600" size={28} />
              </div>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {analytics.overview.totalUsers}
            </div>
            <div className="text-gray-600 font-medium">Total Users</div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Students</span>
                  <span className="font-semibold text-blue-600">
                    {analytics.usersByRole.STUDENT || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Instructors</span>
                  <span className="font-semibold text-purple-600">
                    {analytics.usersByRole.INSTRUCTOR || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admins</span>
                  <span className="font-semibold text-green-600">
                    {analytics.usersByRole.ADMIN || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <BookOpen className="text-purple-600" size={28} />
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {analytics.overview.totalCourses}
            </div>
            <div className="text-gray-600 font-medium">Total Courses</div>
            <div className="mt-4 text-sm text-gray-500">
              Created by {analytics.usersByRole.INSTRUCTOR || 0} instructors
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <Activity className="text-green-600" size={28} />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">
              {analytics.overview.totalEnrollments}
            </div>
            <div className="text-gray-600 font-medium">Total Enrollments</div>
            <div className="mt-4 text-sm text-gray-500">
              Avg {(analytics.overview.totalEnrollments / analytics.overview.totalCourses || 0).toFixed(1)} per course
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Star className="text-yellow-600" size={28} />
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {analytics.overview.totalReviews}
            </div>
            <div className="text-gray-600 font-medium">Total Reviews</div>
            <div className="mt-4 text-sm text-gray-500">
              Student engagement metric
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Users className="text-blue-600" size={28} />
              <span>User Distribution</span>
            </h2>
            
            <div className="space-y-4">
              {/* Students */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">Students</span>
                  <span className="text-blue-600 font-bold">
                    {analytics.usersByRole.STUDENT || 0}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((analytics.usersByRole.STUDENT || 0) / analytics.overview.totalUsers * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {((analytics.usersByRole.STUDENT || 0) / analytics.overview.totalUsers * 100).toFixed(1)}% of total users
                </div>
              </div>

              {/* Instructors */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">Instructors</span>
                  <span className="text-purple-600 font-bold">
                    {analytics.usersByRole.INSTRUCTOR || 0}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((analytics.usersByRole.INSTRUCTOR || 0) / analytics.overview.totalUsers * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {((analytics.usersByRole.INSTRUCTOR || 0) / analytics.overview.totalUsers * 100).toFixed(1)}% of total users
                </div>
              </div>

              {/* Admins */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">Admins</span>
                  <span className="text-green-600 font-bold">
                    {analytics.usersByRole.ADMIN || 0}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((analytics.usersByRole.ADMIN || 0) / analytics.overview.totalUsers * 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {((analytics.usersByRole.ADMIN || 0) / analytics.overview.totalUsers * 100).toFixed(1)}% of total users
                </div>
              </div>
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Activity className="text-green-600" size={28} />
              <span>Platform Health</span>
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="text-sm text-gray-600 mb-1">Average Enrollments per Course</div>
                <div className="text-2xl font-bold text-blue-600">
                  {(analytics.overview.totalEnrollments / analytics.overview.totalCourses || 0).toFixed(1)}
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <div className="text-sm text-gray-600 mb-1">Courses per Instructor</div>
                <div className="text-2xl font-bold text-purple-600">
                  {(analytics.overview.totalCourses / (analytics.usersByRole.INSTRUCTOR || 1)).toFixed(1)}
                </div>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <div className="text-sm text-gray-600 mb-1">Review Rate</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {((analytics.overview.totalReviews / analytics.overview.totalEnrollments || 0) * 100).toFixed(1)}%
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <div className="text-sm text-gray-600 mb-1">Student Engagement</div>
                <div className="text-2xl font-bold text-green-600">
                  {((analytics.overview.totalEnrollments / (analytics.usersByRole.STUDENT || 1))).toFixed(1)} courses/student
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Award className="text-purple-600" size={28} />
            <span>Top Performing Courses</span>
          </h2>
          
          <div className="space-y-3">
            {analytics.topCourses.slice(0, 10).map((course, index) => (
              <div 
                key={course.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`rounded-full w-12 h-12 flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                    'bg-gradient-to-r from-purple-600 to-indigo-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{course.enrollments}</div>
                    <div className="text-xs text-gray-600">Enrollments</div>
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

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
            <Calendar className="text-blue-600" size={28} />
            <span>Recent Enrollments</span>
          </h2>
          
          <div className="space-y-3">
            {analytics.recentEnrollments.map((enrollment, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="font-bold text-purple-600">
                      {enrollment.user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{enrollment.user}</div>
                    <div className="text-sm text-gray-600">
                      enrolled in <span className="font-medium">{enrollment.course}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}