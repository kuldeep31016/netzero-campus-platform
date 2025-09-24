import React, { useState } from 'react';
// TODO: Re-enable when Firebase is properly configured
// import { useAuth } from '../services/firebase';

const Profile: React.FC = () => {
  // TODO: Replace with actual auth context
  // const { currentUser, updateProfile } = useAuth();
  const currentUser = { displayName: 'Demo User', email: 'demo@example.com' };
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    department: '',
    phone: '',
    sustainabilityGoals: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // await updateProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account settings and sustainability preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Personal Information
              </h3>
              <button
                onClick={() => setEditing(!editing)}
                className="btn btn-secondary btn-sm"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="input"
                    disabled={!editing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    className="input"
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="input"
                    disabled={!editing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="input"
                    disabled={!editing}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sustainability Goals</label>
                  <textarea
                    value={formData.sustainabilityGoals}
                    onChange={(e) => setFormData({...formData, sustainabilityGoals: e.target.value})}
                    className="input"
                    rows={3}
                    disabled={!editing}
                    placeholder="What are your personal sustainability goals?"
                  />
                </div>

                {editing && (
                  <div className="flex justify-end space-x-3">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Stats & Achievements */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Your Impact
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Energy Saved</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">120 kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">CO₂ Reduced</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">45 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Challenges Won</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">3</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Recent Badges
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-xl">🌟</span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Energy Saver</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;