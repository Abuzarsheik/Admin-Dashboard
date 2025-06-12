import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usersAPI, apiHelpers } from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getUsers({
        page: currentPage,
        limit: 10,
        search: searchQuery
      });
      const data = apiHelpers.formatResponse(response);
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      apiHelpers.handleError(error, 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.deleteUser(userId);
        apiHelpers.showSuccess('User deleted successfully');
        loadUsers();
      } catch (error) {
        apiHelpers.handleError(error, 'Failed to delete user');
      }
    }
  };

  const handleStatusToggle = async (userId) => {
    try {
      await usersAPI.activateUser(userId);
      apiHelpers.showSuccess('User status updated');
      loadUsers();
    } catch (error) {
      apiHelpers.handleError(error, 'Failed to update user status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading users..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Users Management
          </h1>
          <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
            Manage user accounts and permissions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          Add New User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full"
            />
          </div>
          <div className="flex gap-2">
            <select className="input w-auto">
              <option>All Roles</option>
              <option>Admin</option>
              <option>User</option>
            </select>
            <select className="input w-auto">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-medium text-secondary-700 dark:text-secondary-300">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-700 dark:text-secondary-300">
                  User
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-700 dark:text-secondary-300">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-700 dark:text-secondary-300">
                  Role
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-700 dark:text-secondary-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-700 dark:text-secondary-300">
                  Last Login
                </th>
                <th className="text-left py-3 px-4 font-medium text-secondary-700 dark:text-secondary-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-white/5 hover:bg-white/5 dark:hover:bg-black/5"
                >
                  <td className="py-4 px-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-secondary-100">
                          {user.name}
                        </p>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                          ID: {user._id?.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-secondary-900 dark:text-secondary-100">
                    {user.email}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`badge ${
                      user.role === 'admin' ? 'badge-primary' : 'badge-secondary'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`badge ${
                      user.status === 'active' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-secondary-600 dark:text-secondary-400">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="btn-sm btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleStatusToggle(user._id)}
                        className={`btn-sm ${
                          user.status === 'active' ? 'btn-warning' : 'btn-success'
                        }`}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Showing {users.length} users
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-sm btn-secondary"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-secondary-700 dark:text-secondary-300">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-sm btn-secondary"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users; 