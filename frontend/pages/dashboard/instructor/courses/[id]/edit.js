import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../../components/Layout';
import { useAuth } from '../../../../../context/AuthContext';
import apiClient from '../../../../../lib/api';
import Link from 'next/link';
import { 
  ArrowLeft, Save, Plus, Edit, Trash2, ChevronDown, ChevronUp,
  BookOpen, FileText, Video, CheckCircle, AlertCircle
} from 'lucide-react';

export default function EditCourse() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedModules, setExpandedModules] = useState({});
  
  // Form states
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    isPublished: false,
    price: 0,
    currency: 'usd',
  });
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleData, setModuleData] = useState({ title: '', orderIndex: 0 });
  const [showLessonForm, setShowLessonForm] = useState(null); // moduleId
  const [lessonData, setLessonData] = useState({
    title: '',
    contentType: 'VIDEO',
    videoUrl: '',
    textContent: '',
    duration: 0,
    orderIndex: 0,
  });

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await apiClient.get(`/courses/${id}`);
      setCourse(data);
      setCourseData({
        title: data.title,
        description: data.description,
        isPublished: data.isPublished,
        price: data.price || 0,
        currency: data.currency || 'usd',
      });
      // Expand first module by default
      if (data.modules?.length > 0) {
        setExpandedModules({ [data.modules[0].id]: true });
      }
    } catch (error) {
      setError('Failed to load course');
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseUpdate = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await apiClient.put(`/courses/${id}`, courseData);
      setSuccess('Course updated successfully!');
      fetchCourse();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`/courses/${id}/modules`, moduleData);
      setShowModuleForm(false);
      setModuleData({ title: '', orderIndex: 0 });
      fetchCourse();
      setSuccess('Module added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add module');
    }
  };

  const handleDeleteModule = async (moduleId, moduleTitle) => {
    if (!confirm(`Delete module "${moduleTitle}"?`)) return;
    
    try {
      await apiClient.delete(`/modules/${moduleId}`);
      fetchCourse();
      setSuccess('Module deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete module');
    }
  };

  const handleAddLesson = async (e, moduleId) => {
    e.preventDefault();
    try {
      await apiClient.post(`/modules/${moduleId}/lessons`, lessonData);
      setShowLessonForm(null);
      setLessonData({
        title: '',
        contentType: 'VIDEO',
        videoUrl: '',
        textContent: '',
        duration: 0,
        orderIndex: 0,
      });
      fetchCourse();
      setSuccess('Lesson added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add lesson');
    }
  };

  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    if (!confirm(`Delete lesson "${lessonTitle}"?`)) return;
    
    try {
      await apiClient.delete(`/lessons/${lessonId}`);
      fetchCourse();
      setSuccess('Lesson deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete lesson');
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
          <h2 className="text-2xl font-bold">Course not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Edit ${course.title} - LearnHub`}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/instructor"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          
          <h1 className="font-display text-4xl gradient-text mb-2">
            Edit Course
          </h1>
          <p className="text-gray-600">Manage your course content and settings</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 animate-slide-down">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3 animate-slide-down">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <BookOpen size={24} className="text-purple-600" />
                <span>Course Information</span>
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={courseData.isPublished}
                    onChange={(e) => setCourseData({ ...courseData, isPublished: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isPublished" className="text-sm font-semibold text-gray-700">
                    Publish this course (make it visible to students)
                  </label>
                </div>

                <button
                  onClick={handleCourseUpdate}
                  disabled={saving}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Course Price
  </label>
  <div className="flex items-center space-x-3">
    <select
      value={courseData.currency}
      onChange={(e) => setCourseData({ ...courseData, currency: e.target.value })}
      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    >
      <option value="usd">USD ($)</option>
      <option value="eur">EUR (€)</option>
      <option value="gbp">GBP (£)</option>
      <option value="inr">INR (₹)</option>
    </select>
    <input
      type="number"
      step="0.01"
      min="0"
      value={courseData.price}
      onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })}
      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      placeholder="0.00"
    />
  </div>
  <p className="mt-1 text-xs text-gray-500">
    Set to 0 for free courses. Students will need to pay to enroll in paid courses.
  </p>
</div>

            {/* Modules */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <FileText size={24} className="text-purple-600" />
                  <span>Course Content</span>
                </h2>
                <button
                  onClick={() => setShowModuleForm(!showModuleForm)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add Module</span>
                </button>
              </div>

              {/* Add Module Form */}
              {showModuleForm && (
                <form onSubmit={handleAddModule} className="mb-6 p-4 bg-purple-50 rounded-lg space-y-3">
                  <input
                    type="text"
                    placeholder="Module Title"
                    value={moduleData.title}
                    onChange={(e) => setModuleData({ ...moduleData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="number"
                    placeholder="Order Index"
                    value={moduleData.orderIndex}
                    onChange={(e) => setModuleData({ ...moduleData, orderIndex: parseInt(e.target.value) })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex space-x-2">
                    <button type="submit" className="btn-primary">Add Module</button>
                    <button 
                      type="button" 
                      onClick={() => setShowModuleForm(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Modules List */}
              {course.modules?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>No modules yet. Add your first module to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {course.modules?.map((module) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Module Header */}
                      <div className="bg-gray-50 p-4">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleModule(module.id)}
                            className="flex-1 flex items-center space-x-3 text-left"
                          >
                            {expandedModules[module.id] ? (
                              <ChevronUp size={20} className="text-gray-400" />
                            ) : (
                              <ChevronDown size={20} className="text-gray-400" />
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">{module.title}</div>
                              <div className="text-sm text-gray-500">
                                {module.lessons.length} lessons
                              </div>
                            </div>
                          </button>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setShowLessonForm(module.id)}
                              className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                              title="Add Lesson"
                            >
                              <Plus size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteModule(module.id, module.title)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete Module"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Lessons */}
                      {expandedModules[module.id] && (
                        <div className="p-4 space-y-3">
                          {/* Add Lesson Form */}
                          {showLessonForm === module.id && (
                            <form 
                              onSubmit={(e) => handleAddLesson(e, module.id)} 
                              className="p-4 bg-blue-50 rounded-lg space-y-3"
                            >
                              <input
                                type="text"
                                placeholder="Lesson Title"
                                value={lessonData.title}
                                onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              />
                              
                              <select
                                value={lessonData.contentType}
                                onChange={(e) => setLessonData({ ...lessonData, contentType: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                              >
                                <option value="VIDEO">Video</option>
                                <option value="TEXT">Text</option>
                              </select>

                              {lessonData.contentType === 'VIDEO' ? (
                                <input
                                  type="url"
                                  placeholder="Video URL"
                                  value={lessonData.videoUrl}
                                  onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                              ) : (
                                <textarea
                                  placeholder="Text Content"
                                  value={lessonData.textContent}
                                  onChange={(e) => setLessonData({ ...lessonData, textContent: e.target.value })}
                                  rows={4}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                              )}

                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="number"
                                  placeholder="Duration (minutes)"
                                  value={lessonData.duration}
                                  onChange={(e) => setLessonData({ ...lessonData, duration: parseInt(e.target.value) })}
                                  className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                  type="number"
                                  placeholder="Order Index"
                                  value={lessonData.orderIndex}
                                  onChange={(e) => setLessonData({ ...lessonData, orderIndex: parseInt(e.target.value) })}
                                  required
                                  className="px-4 py-2 border border-gray-300 rounded-lg"
                                />
                              </div>

                              <div className="flex space-x-2">
                                <button type="submit" className="btn-primary text-sm">Add Lesson</button>
                                <button 
                                  type="button" 
                                  onClick={() => setShowLessonForm(null)}
                                  className="btn-secondary text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}

                          {/* Lessons List */}
                          {module.lessons.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No lessons yet. Click + to add a lesson.
                            </p>
                          ) : (
                            module.lessons.map((lesson) => (
                              <div 
                                key={lesson.id}
                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  {lesson.contentType === 'VIDEO' ? (
                                    <Video size={18} className="text-purple-600" />
                                  ) : (
                                    <FileText size={18} className="text-blue-600" />
                                  )}
                                  <div>
                                    <div className="font-medium text-gray-900">{lesson.title}</div>
                                    <div className="text-xs text-gray-500">
                                      {lesson.contentType} • {lesson.duration} min
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-4">Course Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Published</span>
                  {course.isPublished ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <AlertCircle className="text-yellow-600" size={20} />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Approved</span>
                  {course.isApproved ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <AlertCircle className="text-yellow-600" size={20} />
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Modules</span>
                    <span className="font-semibold">{course.modules?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-semibold">
                      {course.modules?.reduce((sum, m) => sum + m.lessons.length, 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Enrollments</span>
                    <span className="font-semibold">{course._count?.enrollments || 0}</span>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="btn-secondary w-full text-center mt-4"
                >
                  Preview Course
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}