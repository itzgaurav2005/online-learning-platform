import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import { useAuth } from '../../../../context/AuthContext';
import apiClient from '../../../../lib/api';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle, Circle, PlayCircle, FileText, 
  ChevronRight, Award, TrendingUp, Star
} from 'lucide-react';

// Helper function to convert YouTube URLs to embed format
const getEmbedUrl = (url) => {
  if (!url) return '';
  
  // Handle different YouTube URL formats
  let videoId = '';
  
  // Format 1: https://www.youtube.com/watch?v=VIDEO_ID
  if (url.includes('youtube.com/watch?v=')) {
    const urlParams = new URLSearchParams(new URL(url).search);
    videoId = urlParams.get('v');
  }
  // Format 2: https://youtu.be/VIDEO_ID
  else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  // Format 3: Already an embed URL
  else if (url.includes('youtube.com/embed/')) {
    return url;
  }
  // Format 4: Other video platforms or direct URLs
  else {
    return url;
  }
  
  // Return YouTube embed URL
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return url;
};

export default function StudentCourse() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (id && user) {
      fetchCourseData();
    }
  }, [id, user]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        apiClient.get(`/courses/${id}`),
        apiClient.get(`/courses/${id}/progress`)
      ]);
      
      setCourse(courseRes.data);
      setProgress(progressRes.data);
      
      // Select first incomplete lesson or first lesson
      if (progressRes.data.modules?.length > 0) {
        for (const module of progressRes.data.modules) {
          const incompleteLesson = module.lessons.find(l => !l.completed);
          if (incompleteLesson) {
            setSelectedLesson(incompleteLesson);
            break;
          }
        }
        if (!selectedLesson && progressRes.data.modules[0].lessons.length > 0) {
          setSelectedLesson(progressRes.data.modules[0].lessons[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (lessonId) => {
    try {
      await apiClient.post(`/lessons/${lessonId}/complete`);
      fetchCourseData(); // Refresh progress
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/courses/${id}/reviews`, reviewData);
      alert('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit review');
    }
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

  if (!course || !progress) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Course not found</h2>
        </div>
      </Layout>
    );
  }

  const isCompleted = progress.summary.percentage === 100;

  return (
    <Layout title={`${course.title} - LearnHub`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/dashboard/student"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl gradient-text mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600">by {course.instructor.name}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold gradient-text">
                {progress.summary.percentage}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lesson Content */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Lesson Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
                  <div className="flex items-center space-x-2 text-purple-200 text-sm mb-2">
                    {selectedLesson.contentType === 'VIDEO' ? (
                      <PlayCircle size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                    <span>{selectedLesson.contentType}</span>
                    {selectedLesson.duration && (
                      <>
                        <span>•</span>
                        <span>{selectedLesson.duration} minutes</span>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{selectedLesson.title}</h2>
                  {selectedLesson.completed && (
                    <div className="flex items-center space-x-2 text-green-300">
                      <CheckCircle size={18} />
                      <span className="text-sm">Completed</span>
                    </div>
                  )}
                </div>

                {/* Lesson Content */}
                <div className="p-6">
                  {selectedLesson.contentType === 'VIDEO' ? (
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                      {selectedLesson.videoUrl ? (
                        <iframe
                          src={getEmbedUrl(selectedLesson.videoUrl)}
                          className="w-full h-full rounded-lg"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      ) : (
                        <div className="text-white text-center">
                          <PlayCircle size={64} className="mx-auto mb-4 opacity-50" />
                          <p>Video content</p>
                          <p className="text-sm text-gray-400 mt-2">{selectedLesson.videoUrl}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="prose max-w-none mb-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        {selectedLesson.textContent || 'Text content will appear here.'}
                      </div>
                    </div>
                  )}

                  {/* Mark Complete Button */}
                  {!selectedLesson.completed && (
                    <button
                      onClick={() => handleMarkComplete(selectedLesson.id)}
                      className="btn-primary w-full"
                    >
                      <CheckCircle className="inline mr-2" size={20} />
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <FileText className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a lesson to start learning
                </h3>
                <p className="text-gray-600">Choose a lesson from the curriculum on the right</p>
              </div>
            )}

            {/* Course Completed - Review Form */}
            {isCompleted && (
              <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="text-yellow-500" size={32} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Congratulations! 🎉</h3>
                    <p className="text-gray-600">You've completed this course</p>
                  </div>
                </div>

                {!showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="btn-primary w-full"
                  >
                    <Star className="inline mr-2" size={20} />
                    Leave a Review
                  </button>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewData({ ...reviewData, rating })}
                            className="focus:outline-none"
                          >
                            <Star
                              size={32}
                              fill={rating <= reviewData.rating ? 'currentColor' : 'none'}
                              className={rating <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Review (optional)
                      </label>
                      <textarea
                        value={reviewData.comment}
                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Share your thoughts about this course..."
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button type="submit" className="flex-1 btn-primary">
                        Submit Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="flex-1 btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Curriculum Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-4">Course Progress</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-purple-600">
                      {progress.summary.completedLessons} / {progress.summary.totalLessons}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress.summary.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Curriculum</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {progress.modules?.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3">
                        <div className="font-semibold text-gray-900 text-sm">{module.title}</div>
                        <div className="text-xs text-gray-500">
                          {module.lessons.filter(l => l.completed).length} / {module.lessons.length} completed
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors ${
                              selectedLesson?.id === lesson.id ? 'bg-purple-50 border-l-4 border-purple-600' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1">
                                {lesson.completed ? (
                                  <CheckCircle className="text-green-600 flex-shrink-0" size={18} />
                                ) : (
                                  <Circle className="text-gray-300 flex-shrink-0" size={18} />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-medium truncate ${
                                    lesson.completed ? 'text-gray-600' : 'text-gray-900'
                                  }`}>
                                    {lesson.title}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {lesson.contentType} • {lesson.duration} min
                                  </div>
                                </div>
                              </div>
                              {selectedLesson?.id === lesson.id && (
                                <ChevronRight className="text-purple-600" size={18} />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}