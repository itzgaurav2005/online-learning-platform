import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../lib/api';
import Link from 'next/link';
import { 
  ArrowLeft, BookOpen, Search, Filter, CheckCircle, 
  XCircle, Eye, Trash2, Users, Star, Calendar, AlertCircle
} from 'lucide-react';

export default function AdminCourses() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchCourses();
      }
    }
  }, [user, authLoading, page, statusFilter]);

  useEffect(() => {
    filterCourses();
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      
      if (statusFilter === 'PENDING') {
        params.isPublished = true;
        params.isApproved = false;
      } else if (statusFilter === 'APPROVED') {
        params.isApproved = true;
      } else if (statusFilter === 'DRAFT') {
        params.isPublished = false;
      }
      
      const { data } = await apiClient.get('/admin/courses', { params });
      setCourses(data.courses);
      setFilteredCourses(data.courses);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    if (searchTerm) {
      const filtered = courses.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  };

  const handleApproveCourse = async (courseId, currentStatus) => {
    const action = currentStatus ? 'reject' : 'approve';
    if (!confirm(`Are you sure you want to ${action} this course?`)) {
      return;
    }

    try {
      await apiClient.put(`/admin/courses/${courseId}/approve`, {
        isApproved: !currentStatus
      });
      alert(`Course ${action}d successfully`);
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.error || `Failed to ${action} course`);
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiClient.delete(`/admin/courses/${courseId}`);
      alert('Course deleted successfully');
      fetchCourses();
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

  const stats = {
    total: courses.length,
    pending: courses.filter(c => c.isPublished && !c.isApproved).length,
    approved: courses.filter(c => c.isApproved).length,
    draft: courses.filter(c => !c.isPublished).length,
  };

  return (
    <Layout title="Manage Courses - Admin Dashboard">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/admin"
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </Link>
          
          <h1 className="font-display text-4xl gradient-text mb-2">
            Course Management
          </h1>
          <p className="text-gray-600">Review and approve courses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold gradient-text">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
            <div className="text-sm text-gray-600">Draft</div>
          </div>
        </div>

        {/* Pending Approval Alert */}
        {stats.pending > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Action Required:</p>
              <p>{stats.pending} course{stats.pending > 1 ? 's' : ''} pending your review and approval.</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by course title or instructor..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="ALL">All Courses</option>
                <option value="PENDING">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredCourses.map((course, index) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                        {course.isApproved ? (
                          <span className="badge badge-info">
                            <CheckCircle size={14} className="mr-1" />
                            Approved
                          </span>
                        ) : course.isPublished ? (
                          <span className="badge badge-danger">
                            Pending Review
                          </span>
                        ) : null}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users size={14} />
                        <span>by {course.instructor.name}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Users size={14} />
                        <span>{course._count.enrollments} students</span>
                      </div>
                      <div className="flex items-center space-x-1 text-purple-600">
                        <BookOpen size={14} />
                        <span>{course._count.modules} modules</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <Star size={14} />
                        <span>{course._count.reviews} reviews</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Calendar size={14} />
                        <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 min-w-[180px]">
                    <Link
                      href={`/courses/${course.id}`}
                      className="btn-secondary text-sm flex items-center justify-center space-x-2"
                    >
                      <Eye size={16} />
                      <span>View Course</span>
                    </Link>
                    
                    {course.isPublished && (
                      <button
                        onClick={() => handleApproveCourse(course.id, course.isApproved)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                          course.isApproved
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                      >
                        {course.isApproved ? (
                          <>
                            <XCircle className="inline mr-1" size={16} />
                            Reject
                          </>
                        ) : (
                          <>
                            <CheckCircle className="inline mr-1" size={16} />
                            Approve
                          </>
                        )}
                      </button>
                    )}
                    
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
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
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
      </div>
    </Layout>
  );
}