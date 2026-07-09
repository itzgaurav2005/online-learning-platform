import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../lib/api';
import { formatPrice, getStripe } from '../../lib/stripe';
import { Loader } from 'lucide-react';
import { Star, Users, BookOpen, Clock, Award, ChevronDown, ChevronUp } from 'lucide-react';

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourse();
      if (user && user.role === 'STUDENT') {
        checkEnrollment();
      }
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const { data } = await apiClient.get(`/courses/${id}`);
      setCourse(data);
      // Expand first module by default
      if (data.modules?.length > 0) {
        setExpandedModules({ [data.modules[0].id]: true });
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const { data } = await apiClient.get(`/courses/${id}/enrollment-status`);
      setIsEnrolled(data.isEnrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

const handleEnroll = async () => {
  if (!user) {
    router.push('/login');
    return;
  }

  if (user.role !== 'STUDENT') {
    alert('Only students can enroll in courses');
    return;
  }

  // Check if course is free or paid
  const price = parseFloat(course.price || 0);

  if (price === 0) {
    // Free course - direct enrollment
    setEnrolling(true);
    try {
      await apiClient.post(`/courses/${id}/enroll`);
      setIsEnrolled(true);
      alert('Successfully enrolled!');
      router.push('/dashboard/student');
    } catch (error) {
      alert(error.response?.data?.error || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  } else {
    // Paid course - redirect to Stripe checkout
    setProcessingPayment(true);
    try {
      const { data } = await apiClient.post('/payments/create-checkout-session', {
        courseId: id
      });

      window.location.href = data.url;
      
    } catch (error) {
      alert(error.response?.data?.error || 'Payment initialization failed');
      setProcessingPayment(false);
    }
  }
};

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        </div>
      </Layout>
    );
  }

  const totalLessons = course.modules?.reduce((sum, module) => sum + module.lessons.length, 0) || 0;
  const totalDuration = course.modules?.reduce(
    (sum, module) => sum + module.lessons.reduce((s, lesson) => s + (lesson.duration || 0), 0),
    0
  ) || 0;

  return (
    <Layout title={`${course.title} - LearnHub`}>
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl mb-4">{course.title}</h1>
            <p className="text-xl text-purple-100 mb-6">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <Star size={20} fill="currentColor" className="text-yellow-400" />
                <span className="font-semibold">
                  {course.averageRating > 0 ? course.averageRating.toFixed(1) : 'New'}
                </span>
                <span className="text-purple-200">
                  ({course._count.reviews} reviews)
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>{course._count.enrollments} students enrolled</span>
              </div>
            </div>

            <div className="text-purple-200">
              Created by <span className="font-semibold text-white">{course.instructor.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* What you'll learn */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              
              <div className="flex items-center space-x-6 text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <BookOpen size={20} />
                  <span>{course.modules?.length || 0} modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award size={20} />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={20} />
                  <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
              </div>

              {/* Modules */}
              <div className="space-y-4">
                {course.modules?.map((module) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <BookOpen size={20} className="text-purple-600" />
                        <span className="font-semibold text-left">{module.title}</span>
                        <span className="text-sm text-gray-500">
                          ({module.lessons.length} lessons)
                        </span>
                      </div>
                      {expandedModules[module.id] ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </button>

                    {expandedModules[module.id] && (
                      <div className="bg-gray-50 p-4 space-y-2">
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between py-2 px-3 hover:bg-white rounded transition-colors">
                            <span className="text-gray-700">{lesson.title}</span>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <span className="badge badge-info">{lesson.contentType}</span>
                              {lesson.duration && (
                                <span>{lesson.duration} min</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            {course.reviews && course.reviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
                <div className="space-y-6">
                  {course.reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center">
                          <span className="font-semibold text-purple-600">
                            {review.user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">{review.user.name}</div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < review.rating ? 'currentColor' : 'none'}
                                className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              
              {isEnrolled ? (
  <div className="space-y-4">
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
      <div className="text-green-800 font-semibold mb-2">You're enrolled!</div>
      <p className="text-sm text-green-600">Continue learning in your dashboard</p>
    </div>
    <button
      onClick={() => router.push('/dashboard/student')}
      className="w-full btn-primary"
    >
      Go to Dashboard
    </button>
  </div>
) : (
  <div className="space-y-4">
    <div className="text-center py-4">
      {parseFloat(course.price || 0) === 0 ? (
        <div className="text-4xl font-bold text-green-600 mb-2">Free</div>
      ) : (
        <div className="text-4xl font-bold gradient-text mb-2">
          {formatPrice(course.price, course.currency || 'usd')}
        </div>
      )}
      <p className="text-gray-600">
        {parseFloat(course.price || 0) === 0 ? 'Start learning for free' : 'One-time payment'}
      </p>
    </div>
    <button
      onClick={handleEnroll}
      disabled={enrolling || processingPayment || !user || user.role !== 'STUDENT'}
      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
    >
      {enrolling || processingPayment ? (
        <>
          <Loader className="animate-spin" size={20} />
          <span>{processingPayment ? 'Processing...' : 'Enrolling...'}</span>
        </>
      ) : (
        <span>
          {parseFloat(course.price || 0) === 0 ? 'Enroll Free' : `Enroll for ${formatPrice(course.price, course.currency || 'usd')}`}
        </span>
      )}
    </button>
    {!user && (
      <p className="text-sm text-center text-gray-500">
        Please login to enroll in this course
      </p>
    )}
  </div>
)}

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Modules</span>
                  <span className="font-semibold">{course.modules?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-semibold">{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Enrolled</span>
                  <span className="font-semibold">{course._count.enrollments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}