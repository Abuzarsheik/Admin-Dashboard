import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Profile
        </h1>
        <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
          Manage your account settings
        </p>
      </div>
      
      <div className="glass-card p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
              {user?.name || 'User'}
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400">
              {user?.email}
            </p>
            <span className="badge badge-primary mt-1">
              {user?.role}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              className="input w-full"
              readOnly
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="input w-full"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 