import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../lib/api';
import Link from 'next/link';
import { 
  ArrowLeft, Users, Search, Filter, Trash2, 
  Mail, Calendar, BookOpen, Award, AlertCircle
} from 'lucide-react';

export default function AdminUsers() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/');
      } else {
        fetchUsers();
      }
    }
  }, [user, authLoading, page, roleFilter]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (roleFilter !== 'ALL') {
        params.role = roleFilter;
      }
      
      const { data } = await apiClient.get('/admin/users', { params });
      setUsers(data.users);
      setFilteredUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (searchTerm) {
      const filtered = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiClient.delete(`/admin/users/${userId}`);
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete user');
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
    total: users.length,
    students: users.filter(u => u.role === 'STUDENT').length,
    instructors: users.filter(u => u.role === 'INSTRUCTOR').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
  };

  return (
    <Layout title="Manage Users - Admin Dashboard">
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
            User Management
          </h1>
          <p className="text-gray-600">Manage all platform users</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold gradient-text">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-blue-600">{stats.students}</div>
            <div className="text-sm text-gray-600">Students</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-purple-600">{stats.instructors}</div>
            <div className="text-sm text-gray-600">Instructors</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-2xl font-bold text-green-600">{stats.admins}</div>
            <div className="text-sm text-gray-600">Admins</div>
          </div>
        </div>

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
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students</option>
                <option value="INSTRUCTOR">Instructors</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((userData, index) => (
                    <tr 
                      key={userData.id}
                      className="hover:bg-gray-50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center">
                            <span className="font-semibold text-purple-600">
                              {userData.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="font-medium text-gray-900">{userData.name}</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail size={14} />
                          <span>{userData.email}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${
                          userData.role === 'ADMIN' ? 'badge-danger' :
                          userData.role === 'INSTRUCTOR' ? 'badge-info' :
                          'badge-success'
                        }`}>
                          {userData.role}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm space-y-1">
                          {userData.role === 'INSTRUCTOR' && (
                            <div className="flex items-center space-x-1 text-purple-600">
                              <BookOpen size={14} />
                              <span>{userData._count.coursesCreated} courses</span>
                            </div>
                          )}
                          {userData.role === 'STUDENT' && (
                            <>
                              <div className="flex items-center space-x-1 text-blue-600">
                                <BookOpen size={14} />
                                <span>{userData._count.enrollments} enrolled</span>
                              </div>
                              <div className="flex items-center space-x-1 text-yellow-600">
                                <Award size={14} />
                                <span>{userData._count.reviews} reviews</span>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          <span>
                            {new Date(userData.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteUser(userData.id, userData.name)}
                          disabled={userData.id === user.id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title={userData.id === user.id ? "Cannot delete yourself" : "Delete user"}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

        {/* Warning */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">Important Note:</p>
            <p>Deleting a user will permanently remove all their data including courses, enrollments, and reviews. This action cannot be undone.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}