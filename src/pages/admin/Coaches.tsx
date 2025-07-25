import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Mail, Phone, Calendar, Edit, X, UserCheck } from 'lucide-react';

// Import your existing APIs
import { registerUser, type RegisterUserRequest } from '@/api/./adminapi/adminCoachApi';
import { updateCoachById, type UpdateCoachRequest, type CoachDto, fetchAllCoaches } from '@/api/./adminapi/adminCoachApi';
import { getUserById, type UserInfo } from '@/api/userApi';

interface CombinedCoachInfo extends CoachDto {
  userInfo: UserInfo;
}

const CoachesManagement = () => {
  const [coaches, setCoaches] = useState<CombinedCoachInfo[]>([]);
  const [filteredCoaches, setFilteredCoaches] = useState<CombinedCoachInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoach, setSelectedCoach] = useState<CombinedCoachInfo | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCoachId, setNewCoachId] = useState<string | null>(null);

  // Create coach form state
  const [createForm, setCreateForm] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    dob: '',
    sex: 'Male',
    phoneNumber: ''
  });

  // Update coach form state
  const [updateForm, setUpdateForm] = useState({
    bio: '',
    qualification: ''
  });

  // Load coaches on component mount
  useEffect(() => {
    loadCoaches();
  }, []);

  // Filter coaches based on search term
  useEffect(() => {
    const filtered = coaches.filter(coach =>
      coach.userInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoaches(filtered);
  }, [coaches, searchTerm]);

  const loadCoaches = async () => {
    try {
      setIsLoading(true);
      const coachesData = await fetchAllCoaches();
      
      // Get user info for each coach
      const combinedCoaches = await Promise.all(
        coachesData.map(async (coach) => {
          const userInfo = await getUserById(coach.userId);
          return {
            ...coach,
            userInfo
          };
        })
      );
      
      setCoaches(combinedCoaches);
      setFilteredCoaches(combinedCoaches);
    } catch (error) {
      console.error('Error loading coaches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      const registerData: RegisterUserRequest = {
        username: createForm.username,
        password: createForm.password,
        email: createForm.email,
        fullName: createForm.fullName,
        dob: createForm.dob,
        sex: createForm.sex,
        roleName: 'coach'
      };

      const newUser = await registerUser(registerData);
      setNewCoachId(newUser.id);
      
      // Reset form and show update form for bio/qualification
      setCreateForm({
        username: '',
        password: '',
        email: '',
        fullName: '',
        dob: '',
        sex: 'Male',
        phoneNumber: ''
      });
      
      setShowCreateForm(false);
      setShowUpdateForm(true);
      
    } catch (error) {
      console.error('Error creating coach:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      const coachId = newCoachId || selectedCoach?.userId;
      if (!coachId) return;

      const updateData: UpdateCoachRequest = {
        userId: coachId,
        bio: updateForm.bio,
        qualification: updateForm.qualification
      };

      await updateCoachById(coachId, updateData);
      
      // Reset form and reload coaches
      setUpdateForm({ bio: '', qualification: '' });
      setShowUpdateForm(false);
      setNewCoachId(null);
      setSelectedCoach(null);
      
      await loadCoaches();
      
    } catch (error) {
      console.error('Error updating coach:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCoach = async (coach: CombinedCoachInfo) => {
    setSelectedCoach(coach);
  };

  const handleEditCoach = (coach: CombinedCoachInfo) => {
    setSelectedCoach(coach);
    setUpdateForm({
      bio: coach.bio,
      qualification: coach.qualification
    });
    setShowUpdateForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-green-800">Coaches Management</h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add New Coach
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search coaches by full name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Coaches Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach) => (
              <div key={coach.userId} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="text-green-600" size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">{coach.userInfo.fullName}</h3>
                      <p className="text-gray-600">@{coach.userInfo.username}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Mail size={16} className="mr-2" />
                      <span className="text-sm">{coach.userInfo.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <UserCheck size={16} className="mr-2" />
                      <span className="text-sm">{coach.qualification || 'No qualification set'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewCoach(coach)}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded text-sm transition-colors "
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEditCoach(coach)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Coach Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-800">Create New Coach</h2>
                <button onClick={() => setShowCreateForm(false)}>
                  <X className="text-gray-500 hover:text-gray-700" size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateCoach} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={createForm.username}
                    onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={createForm.password}
                    onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={createForm.fullName}
                    onChange={(e) => setCreateForm({...createForm, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={createForm.email}
                    onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={createForm.dob}
                    onChange={(e) => setCreateForm({...createForm, dob: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={createForm.sex}
                    onChange={(e) => setCreateForm({...createForm, sex: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Creating...' : 'Create Coach'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Coach Bio/Qualification Modal */}
        {showUpdateForm && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-800">
                  {newCoachId ? 'Complete Coach Profile' : 'Update Coach Info'}
                </h2>
                <button onClick={() => {
                  setShowUpdateForm(false);
                  setNewCoachId(null);
                  setSelectedCoach(null);
                }}>
                  <X className="text-gray-500 hover:text-gray-700" size={24} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateCoach} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    required
                    rows={4}
                    value={updateForm.bio}
                    onChange={(e) => setUpdateForm({...updateForm, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter coach bio..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    required
                    value={updateForm.qualification}
                    onChange={(e) => setUpdateForm({...updateForm, qualification: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Enter qualifications..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUpdateForm(false);
                      setNewCoachId(null);
                      setSelectedCoach(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Coach Details Modal */}
        {selectedCoach && !showUpdateForm && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-green-800">Coach Details</h2>
                <button onClick={() => setSelectedCoach(null)}>
                  <X className="text-gray-500 hover:text-gray-700" size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="text-green-600" size={32} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-800">{selectedCoach.userInfo.fullName}</h3>
                    <p className="text-gray-600">@{selectedCoach.userInfo.username}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <Mail className="text-green-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedCoach.userInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="text-green-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedCoach.userInfo.phoneNumber || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="text-green-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium">{selectedCoach.userInfo.dob || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="text-green-600 mr-3" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-medium">{selectedCoach.userInfo.sex || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Professional Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Qualification</p>
                      <p className="font-medium">{selectedCoach.qualification || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bio</p>
                      <p className="font-medium">{selectedCoach.bio || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedCoach(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleEditCoach(selectedCoach)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit Coach
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachesManagement;