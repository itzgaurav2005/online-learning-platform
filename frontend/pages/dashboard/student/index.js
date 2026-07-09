import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../lib/api';
import Link from 'next/link';
import { BookOpen, TrendingUp, Award, Clock, Star, CheckCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'STUDENT') {
        router.push('/');
      } else {
        fetchEnrollments();
      }
    }
  }, [user, authLoading]);

  const fetchEnrollments = async () => {
    try {
      const { data } = await apiClient.get('/users/me/enrollments');
      setEnrollments(data.enrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
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

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => e.progress.percentage === 100).length;
  const totalProgress = enrollments.reduce((sum, e) => sum + e.progress.percentage, 0);
  const averageProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;

  return (
    <Layout title="My Dashboard - LearnHub">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="font-display text-4xl gradient-text mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-lg p-3">
                <BookOpen className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold gradient-text">{totalCourses}</div>
            <div className="text-gray-600">Enrolled Courses</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-lg p-3">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">{completedCourses}</div>
            <div className="text-gray-600">Completed</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600">{averageProgress}%</div>
            <div className="text-gray-600">Average Progress</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in animate-delay-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 rounded-lg p-3">
                <Award className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{completedCourses}</div>
            <div className="text-gray-600">Certificates</div>
          </div>
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <Link href="/courses" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors">
              Browse More →
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600 mb-6">Start learning by enrolling in a course</p>
              <Link href="/courses" className="btn-primary inline-block">
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment, index) => (
                <Link
                  key={enrollment.id}
                  href={`/dashboard/student/courses/${enrollment.course.id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="h-40 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 flex items-center justify-center">
                    <BookOpen className="text-white" size={48} />
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
                      {enrollment.course.title}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                      <Star size={14} fill="currentColor" className="text-yellow-500" />
                      <span>{enrollment.course.averageRating.toFixed(1)}</span>
                      <span className="text-gray-400">•</span>
                      <span>{enrollment.course.instructor.name}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-purple-600">
                          {enrollment.progress.percentage}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${enrollment.progress.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {enrollment.progress.completedLessons} of {enrollment.progress.totalLessons} lessons completed
                      </div>
                    </div>

                    {enrollment.progress.percentage === 100 && (
                      <div className="mt-4 badge badge-success w-full justify-center">
                        <Award size={14} className="mr-1" />
                        Completed
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}