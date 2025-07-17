import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, User, FileText, Calendar, Target, TrendingUp, CheckCircle, XCircle, Clock, Search, X, UserCircle, Phone, Mail, Calendar as CalendarIcon } from 'lucide-react';
import { type UserDto, getUsersByCoach, type MembershipPackageDto, getUserMemberships } from '@/api/dailyCheckinApi';
import { type UserSurveyDto, getAllSurveysOfUser } from '@/api/usersurveyApi';
import { type QuitPlanDto, getPlansByUser } from '@/api/userPlanApi';
import { type QuitPlanStepDto, getPlanSteps, type CessationProgressDto, getProgressByStepId } from '@/api/planStepProgressApi';

interface ExpandedState {
  users: Set<string>;
  plans: Set<string>;
  steps: Set<string>;
}

interface UserData {
  user: UserDto;
  memberships: MembershipPackageDto[];
  surveys: UserSurveyDto[];
  plans: QuitPlanDto[];
}

interface PlanData {
  plan: QuitPlanDto;
  steps: QuitPlanStepDto[];
}

interface StepData {
  step: QuitPlanStepDto;
  progress: CessationProgressDto[];
}

const CoachClients: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<ExpandedState>({
    users: new Set(),
    plans: new Set(),
    steps: new Set()
  });
  const [selectedTab, setSelectedTab] = useState<{[key: string]: 'surveys' | 'plans'}>({});
  const [planData, setPlanData] = useState<{[key: string]: PlanData}>({});
  const [stepData, setStepData] = useState<{[key: string]: StepData}>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Get coachId from localStorage
  const coachId = JSON.parse(localStorage.getItem('user') || '{}').id;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getUsersByCoach(coachId);
      
      const enrichedUsers = await Promise.all(
        usersData.map(async (user) => {
          const [memberships, surveys, plans] = await Promise.all([
            getUserMemberships(coachId, user.id),
            getAllSurveysOfUser(user.id),
            getPlansByUser(user.id)
          ]);

          // Sort plans by status (active first)
          const sortedPlans = plans.sort((a, b) => {
            if (a.status === 'active' && b.status !== 'active') return -1;
            if (a.status !== 'active' && b.status === 'active') return 1;
            return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
          });

          return {
            user,
            memberships,
            surveys,
            plans: sortedPlans
          };
        })
      );

      setUsers(enrichedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(userData => 
    userData.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    userData.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openUserModal = (userData: UserData) => {
    setSelectedUser(userData);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const UserInfoModal = () => {
    if (!selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <UserCircle className="w-6 h-6 mr-2 text-green-600" />
              Personal Information
            </h2>
            <button
              onClick={closeUserModal}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Avatar and basic information */}
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                {selectedUser.user.avatarPath ? (
                  <img 
                    src={selectedUser.user.avatarPath} 
                    alt={selectedUser.user.fullName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{selectedUser.user.fullName}</h3>
                <p className="text-gray-600">{selectedUser.user.username}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  selectedUser.user.preStatus ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedUser.user.preStatus ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{selectedUser.user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{selectedUser.user.phoneNumber}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    Date of Birth: {new Date(selectedUser.user.dob).toLocaleDateString('en-US')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Gender: {selectedUser.user.sex}</span>
                </div>
              </div>
            </div>

            {/* Membership Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Membership Information</h4>
              {selectedUser.memberships.length === 0 ? (
                <p className="text-gray-500">No memberships yet</p>
              ) : (
                <div className="space-y-3">
                  {selectedUser.memberships.map((membership) => (
                    <div key={membership.id} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-800">{membership.packageTypeName}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          membership.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {membership.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>From: {formatDate(membership.startDate)}</p>
                        <p>To: {formatDate(membership.endDate)}</p>
                        <p>Created: {formatDate(membership.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedUser.surveys.length}</p>
                  <p className="text-sm text-gray-600">Surveys</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedUser.plans.length}</p>
                  <p className="text-sm text-gray-600">Plans</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {selectedUser.plans.filter(p => p.status === 'active').length}
                  </p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {selectedUser.plans.filter(p => p.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">System Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="text-gray-800 font-mono">{selectedUser.user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="text-gray-800">{selectedUser.user.roleName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created At:</span>
                  <span className="text-gray-800">{formatDate(selectedUser.user.createdAt)}</span>
                </div>
                {selectedUser.user.providerId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider ID:</span>
                    <span className="text-gray-800 font-mono">{selectedUser.user.providerId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const toggleExpanded = (type: keyof ExpandedState, id: string) => {
    setExpanded(prev => ({
      ...prev,
      [type]: new Set(prev[type].has(id) 
        ? [...prev[type]].filter(item => item !== id)
        : [...prev[type], id]
      )
    }));
  };

  const loadPlanData = async (planId: string) => {
    if (planData[planId]) return;

    try {
      const steps = await getPlanSteps(planId);
      setPlanData(prev => ({
        ...prev,
        [planId]: {
          plan: users.flatMap(u => u.plans).find(p => p.id === planId)!,
          steps
        }
      }));
    } catch (error) {
      console.error('Error loading plan steps:', error);
    }
  };

  const loadStepData = async (stepId: string) => {
    if (stepData[stepId]) return;

    try {
      const progress = await getProgressByStepId(stepId);
      const step = Object.values(planData).flatMap(p => p.steps).find(s => s.id === stepId);
      
      if (step) {
        setStepData(prev => ({
          ...prev,
          [stepId]: {
            step,
            progress
          }
        }));
      }
    } catch (error) {
      console.error('Error loading step progress:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'missed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <Target className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'missed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Clients</h1>
          
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {searchQuery ? `${filteredUsers.length} results found` : `Total: ${users.length} clients`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-green-600 hover:text-green-800"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery ? 'No matching clients found' : 'No clients yet'}
              </p>
            </div>
          ) : (
            filteredUsers.map((userData) => (
            <div key={userData.user.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="p-4 border-l-4 border-green-500 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpanded('users', userData.user.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{userData.user.fullName}</h3>
                      <p className="text-sm text-gray-600">{userData.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {userData.surveys.length} surveys • {userData.plans.length} plans
                      </p>
                      {userData.memberships.length > 0 && (
                        <p className="text-xs text-green-600">
                          {formatDate(userData.memberships[0].startDate)} - {formatDate(userData.memberships[0].endDate)}
                        </p>
                      )}
                    </div>
                    {expanded.users.has(userData.user.id) ? 
                      <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    }
                  </div>
                </div>
              </div>

              {expanded.users.has(userData.user.id) && (
                <div className="border-t bg-gray-50">
                  <div className="flex border-b">
                    <button
                      className={`flex-1 py-3 px-4 text-sm font-medium ${
                        selectedTab[userData.user.id] === 'surveys' || !selectedTab[userData.user.id]
                          ? 'text-green-600 bg-white border-b-2 border-green-500'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      onClick={() => setSelectedTab(prev => ({ ...prev, [userData.user.id]: 'surveys' }))}
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      Surveys ({userData.surveys.length})
                    </button>
                    <button
                      className={`flex-1 py-3 px-4 text-sm font-medium ${
                        selectedTab[userData.user.id] === 'plans'
                          ? 'text-green-600 bg-white border-b-2 border-green-500'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      onClick={() => setSelectedTab(prev => ({ ...prev, [userData.user.id]: 'plans' }))}
                    >
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Plans ({userData.plans.length})
                    </button>
                  </div>

                  <div className="p-4">
                    {(selectedTab[userData.user.id] === 'surveys' || !selectedTab[userData.user.id]) && (
                      <div className="space-y-3">
                        {userData.surveys.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No surveys yet</p>
                        ) : (
                          userData.surveys.map((survey) => (
                            <div key={survey.id} className="bg-white p-4 rounded-lg border">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-800">Survey on {formatDate(survey.createAt)}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor('completed')}`}>
                                  Completed
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Smoke duration: <span className="font-medium">{survey.smokeDuration}</span></p>
                                  <p className="text-gray-600">Cigarettes/day: <span className="font-medium">{survey.cigarettesPerDay}</span></p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Dependency level: <span className="font-medium">{survey.dependencyLevel}/10</span></p>
                                  <p className="text-gray-600">Health status: <span className="font-medium">{survey.healthStatus}</span></p>
                                </div>
                              </div>
                              {survey.note && (
                                <p className="text-gray-600 text-sm mt-2">Note: {survey.note}</p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {selectedTab[userData.user.id] === 'plans' && (
                      <div className="space-y-3">
                        {userData.plans.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No plans yet</p>
                        ) : (
                          userData.plans.map((plan) => (
                            <div key={plan.id} className="bg-white rounded-lg border overflow-hidden">
                              <div 
                                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => {
                                  toggleExpanded('plans', plan.id);
                                  loadPlanData(plan.id);
                                }}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <h4 className="font-medium text-gray-800">
                                        Plan ({plan.method === 'GRADUAL' ? 'Gradual' : 'Abrupt'})
                                      </h4>
                                      <span className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(plan.status)}`}>
                                        {getStatusIcon(plan.status)}
                                        <span className="capitalize">{plan.status}</span>
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                      <div>
                                        <p>Start Date: {formatDate(plan.startDate)}</p>
                                        <p>Target Date: {formatDate(plan.targetDate)}</p>
                                      </div>
                                      <div>
                                        <p>Current Streak: {plan.currentZeroStreak} days</p>
                                        <p>Max Streak: {plan.maxZeroStreak} days</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    {expanded.plans.has(plan.id) ? 
                                      <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                                      <ChevronRight className="w-5 h-5 text-gray-500" />
                                    }
                                  </div>
                                </div>
                              </div>

                              {expanded.plans.has(plan.id) && planData[plan.id] && (
                                <div className="border-t bg-gray-50 p-4">
                                  <h5 className="font-medium text-gray-800 mb-3">
                                    Steps ({planData[plan.id].steps.length})
                                  </h5>
                                  <div className="space-y-2">
                                    {planData[plan.id].steps.map((step) => (
                                      <div key={step.id} className="bg-white rounded-lg border">
                                        <div 
                                          className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                          onClick={() => {
                                            toggleExpanded('steps', step.id);
                                            loadStepData(step.id);
                                          }}
                                        >
                                          <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                              <div className="flex items-center space-x-2 mb-1">
                                                <span className="text-sm font-medium text-gray-800">
                                                  Step {step.stepNumber}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(step.status)}`}>
                                                  {getStatusIcon(step.status)}
                                                  <span className="capitalize">{step.status}</span>
                                                </span>
                                              </div>
                                              <p className="text-sm text-gray-600 mb-1">{step.stepDescription}</p>
                                              <div className="text-xs text-gray-500">
                                                <span>{formatDate(step.stepStartDate)} - {formatDate(step.stepEndDate)}</span>
                                                <span className="mx-2">•</span>
                                                <span>Target: {step.targetCigarettesPerDay} cigarettes/day</span>
                                              </div>
                                            </div>
                                            <div className="ml-4">
                                              {expanded.steps.has(step.id) ? 
                                                <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                                                <ChevronRight className="w-4 h-4 text-gray-500" />
                                              }
                                            </div>
                                          </div>
                                        </div>

                                        {expanded.steps.has(step.id) && stepData[step.id] && (
                                          <div className="border-t bg-gray-25 p-3">
                                            <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                                              <TrendingUp className="w-4 h-4 mr-1" />
                                              Progress ({stepData[step.id].progress.length})
                                            </h6>
                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                              {stepData[step.id].progress.length === 0 ? (
                                                <p className="text-gray-500 text-sm text-center py-2">No progress data yet</p>
                                              ) : (
                                                stepData[step.id].progress.map((progress) => (
                                                  <div key={progress.id} className="bg-white p-2 rounded border text-sm">
                                                    <div className="flex justify-between items-start mb-1">
                                                      <span className="font-medium">{formatDate(progress.logDate)}</span>
                                                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(progress.status)}`}>
                                                        {progress.status}
                                                      </span>
                                                    </div>
                                                    <div className="text-gray-600">
                                                      <p>Cigarettes smoked: {progress.cigarettesSmoked}</p>
                                                      <p>Mood: {progress.mood}</p>
                                                      {progress.note && <p>Note: {progress.note}</p>}
                                                    </div>
                                                  </div>
                                                ))
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default CoachClients;