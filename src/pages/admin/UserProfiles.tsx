// src/pages/admin/UserProfiles.tsx

import { useState, useEffect } from "react";
import { getUserById } from "@/api/userApi";
import type { UserInfo } from "@/api/userApi";
import { getAllSurveysOfUser } from "@/api/usersurveyApi";
import type { UserSurveyDto } from "@/api/usersurveyApi";
import { getActivePlanOfAnUser } from "@/api/userPlanApi";
import type { UserPlan } from "@/api/userPlanApi";
import { getAllBadgesOfUser } from "@/api/userBadgeApi";
import type { UserEarnedBadgeDetails } from "@/api/userBadgeApi";
import { hasActiveMembership, getActiveMembershipDetailsByUserId } from "@/api/membershipApi";
import type { MembershipPackageDto } from "@/api/membershipApi";


// Define an extended UserInfo type for internal use in UserProfile
interface UserProfileInfo extends UserInfo {
    username: string; // Add username as it's used in User info section
}

interface UserProfileProps {
    userId: string;
    onClose: () => void;
}

type ProfileTab = "userInfo" | "quitPlan" | "badges" | "survey" | "membership";

const UserProfile: React.FC<UserProfileProps> = ({ userId, onClose }) => {
    // Main user info (always fetched first)
    const [userInfo, setUserInfo] = useState<UserProfileInfo | null>(null);
    const [loadingUserInfo, setLoadingUserInfo] = useState<boolean>(true);
    const [errorUserInfo, setErrorUserInfo] = useState<string | null>(null);

    // Data for each section
    const [quitPlan, setQuitPlan] = useState<UserPlan | null>(null);
    const [badges, setBadges] = useState<UserEarnedBadgeDetails[]>([]);
    const [surveys, setSurveys] = useState<UserSurveyDto[]>([]);
    const [hasMembership, setHasMembership] = useState<boolean | null>(null);
    const [membershipDetails, setMembershipDetails] = useState<MembershipPackageDto | null>(null);

    // Loading and error states for each section
    const [loadingQuitPlan, setLoadingQuitPlan] = useState<boolean>(false);
    const [errorQuitPlan, setErrorQuitPlan] = useState<string | null>(null);

    const [loadingBadges, setLoadingBadges] = useState<boolean>(false);
    const [errorBadges, setErrorBadges] = useState<string | null>(null);

    const [loadingSurveys, setLoadingSurveys] = useState<boolean>(false);
    const [errorSurveys, setErrorSurveys] = useState<string | null>(null);

    const [loadingMembership, setLoadingMembership] = useState<boolean>(false);
    const [errorMembership, setErrorMembership] = useState<string | null>(null);


    // Active tab state
    const [activeTab, setActiveTab] = useState<ProfileTab>("userInfo");

    // Fetch User Info (always on initial load)
    useEffect(() => {
        const fetchInitialUserInfo = async () => {
            setLoadingUserInfo(true);
            setErrorUserInfo(null);
            try {
                const userData = await getUserById(userId);
                setUserInfo({
                    ...userData,
                    username: userData.email.split('@')[0] // Derive username from email for display
                });
            } catch (err) {
                console.error("Failed to fetch initial user info:", err);
                setErrorUserInfo("Unable to load user information. Please try again.");
            } finally {
                setLoadingUserInfo(false);
            }
        };

        if (userId) {
            fetchInitialUserInfo();
        }
    }, [userId]);

    // Fetch data for each tab when activeTab changes
    useEffect(() => {
        const fetchDataForTab = async () => {
            switch (activeTab) {
                case "quitPlan":
                    if (quitPlan === null) { // Only fetch if not already fetched
                        setLoadingQuitPlan(true);
                        setErrorQuitPlan(null);
                        try {
                            const planData = await getActivePlanOfAnUser(userId);
                            setQuitPlan(planData);
                        } catch (err) {
                            console.error("Failed to fetch quit plan:", err);
                            setErrorQuitPlan("Unable to load the quit smoking plan. Please try again.");
                        } finally {
                            setLoadingQuitPlan(false);
                        }
                    }
                    break;
                case "badges":
                    if (badges.length === 0) { // Only fetch if not already fetched
                        setLoadingBadges(true);
                        setErrorBadges(null);
                        try {
                            const badgesData = await getAllBadgesOfUser(userId);
                            setBadges(badgesData);
                        } catch (err) {
                            console.error("Failed to fetch badges:", err);
                            setErrorBadges("Unable to load badge. Please try again.");
                        } finally {
                            setLoadingBadges(false);
                        }
                    }
                    break;
                case "survey":
                    if (surveys.length === 0) { // Only fetch if not already fetched
                        setLoadingSurveys(true);
                        setErrorSurveys(null);
                        try {
                            const surveysData = await getAllSurveysOfUser(userId);
                            setSurveys(surveysData);
                        } catch (err) {
                            console.error("Failed to fetch surveys:", err);
                            setErrorSurveys("Unable to load surveys. Please try again.");
                        } finally {
                            setLoadingSurveys(false);
                        }
                    }
                    break;
                case "membership":
                    if (hasMembership === null && membershipDetails === null) {
                        setLoadingMembership(true);
                        setErrorMembership(null);
                        try {
                            // Bước 1: Kiểm tra xem người dùng có gói active không
                            const isActive = await hasActiveMembership(userId);
                            setHasMembership(isActive);

                            // Bước 2: Nếu có gói active, fetch chi tiết gói
                            if (isActive) {
                                const details = await getActiveMembershipDetailsByUserId(userId);
                                setMembershipDetails(details);
                            } else {
                                setMembershipDetails(null); // Đảm bảo null nếu không có active
                            }
                        } catch (err: any) {
                            console.error("Failed to fetch membership info for user:", err);
                            setHasMembership(false); // Coi như không có active membership nếu có lỗi
                            setMembershipDetails(null);
                            // Xử lý thông báo lỗi chi tiết hơn nếu cần
                            if (err.message.includes("User does not exist")) {
                                setErrorMembership("This user was not found or membership information could not be retrieved.");
                            } else if (err.message.includes("No access to this user's membership information")) {
                                setErrorMembership("You do not have permission to access this user's membership information.");
                            }
                            else {
                                setErrorMembership("Unable to load membership package information. Please try again.");
                            }
                        } finally {
                            setLoadingMembership(false);
                        }
                    }
                    break;

                default:
                    // User info is already loaded initially
                    break;
            }
        };

        fetchDataForTab();
    }, [activeTab, userId, quitPlan, badges, surveys, hasMembership, membershipDetails]);

    // Helper function to get dependency level description
    const getDependencyLevelDescription = (level: number): string => {
        if (level <= 2) return "Very Low";
        if (level <= 4) return "Low";
        if (level <= 6) return "Moderate";
        if (level <= 8) return "High";
        return "Very High";
    };

    // Overall loading/error state for the modal itself
    if (loadingUserInfo) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl relative">
                    <div className="text-center py-8 text-gray-600">Loading user information...</div>
                </div>
            </div>
        );
    }

    if (errorUserInfo) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition-colors duration-200"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center shadow-sm">
                        {errorUserInfo}
                    </div>
                </div>
            </div>
        );
    }

    if (!userInfo) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition-colors duration-200"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <div className="text-center py-8 text-gray-600">User information not found.</div>
                </div>
            </div>
        );
    }

    // Helper function to render loading/error/no data states for sections
    const renderSectionContent = (
        loading: boolean,
        error: string | null,
        data: any, // Can be array or object
        renderData: () => React.ReactElement,
        noDataMessage: string
    ) => {
        if (loading) {
            return <div className="text-center py-4 text-gray-600">Loading data...</div>;
        }
        if (error) {
            return <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center text-sm">{error}</div>;
        }
        if (Array.isArray(data) ? data.length === 0 : !data) {
            return <p className="text-gray-600 italic">{noDataMessage}</p>;
        }
        return renderData();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl relative h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition-colors duration-200"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h3 className="text-2xl font-bold text-green-700 mb-6 border-b pb-2">User profile: {userInfo.fullName}</h3>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6 sticky top-0 bg-white z-10">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "userInfo" ? "border-b-2 border-green-600 text-green-600" : "text-gray-600 hover:text-gray-800"}`}
                        onClick={() => setActiveTab("userInfo")}
                    >
                        Information
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "quitPlan" ? "border-b-2 border-green-600 text-green-600" : "text-gray-600 hover:text-gray-800"}`}
                        onClick={() => setActiveTab("quitPlan")}
                    >
                        Plan
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "badges" ? "border-b-2 border-green-600 text-green-600" : "text-gray-600 hover:text-gray-800"}`}
                        onClick={() => setActiveTab("badges")}
                    >
                        Badge
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "survey" ? "border-b-2 border-green-600 text-green-600" : "text-gray-600 hover:text-gray-800"}`}
                        onClick={() => setActiveTab("survey")}
                    >
                        Survey
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "membership" ? "border-b-2 border-green-600 text-green-600" : "text-gray-600 hover:text-gray-800"}`}
                        onClick={() => setActiveTab("membership")}
                    >
                        Membership
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-grow overflow-y-auto">
                    {activeTab === "userInfo" && (
                        <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">User Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                <p><strong>Fullname:</strong> {userInfo.fullName}</p>
                                <p><strong>Email:</strong> {userInfo.email}</p>
                                <p><strong>User name:</strong> {userInfo.username}</p>
                                <p><strong>D.O.B:</strong> {userInfo.dob || "Not updated yet"}</p>
                                <p><strong>Phone:</strong> {userInfo.phoneNumber || "Not updated yet"}</p>
                            </div>
                        </section>
                    )}

                    {activeTab === "quitPlan" && (
                        <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Quit Smoking Plan</h4>
                            {renderSectionContent(
                                loadingQuitPlan,
                                errorQuitPlan,
                                quitPlan,
                                () => (
                                    <div className="space-y-2 text-gray-700">
                                        <p><strong>Method:</strong> {quitPlan?.method}</p>
                                        <p><strong>Status:</strong> {quitPlan?.status}</p>
                                        <p><strong>Start date:</strong> {quitPlan?.startDate}</p>
                                        <p><strong>Target date:</strong> {quitPlan?.targetDate}</p>
                                        <p><strong>Last updated:</strong> {quitPlan?.updatedAt}</p>
                                    </div>
                                ),
                                "This user has no active quit plan."
                            )}
                        </section>
                    )}

                    {activeTab === "badges" && (
                        <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Badge</h4>
                            {renderSectionContent(
                                loadingBadges,
                                errorBadges,
                                badges,
                                () => (
                                    <div className="flex flex-wrap gap-3">
                                        {badges.map((badge) => (
                                            <span key={badge.id} className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
                                                {badge.badgeName}
                                            </span>
                                        ))}
                                    </div>
                                ),
                                "This user has no badges yet."
                            )}
                        </section>
                    )}

                    {activeTab === "survey" && (
                        <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Survey</h4>
                            {renderSectionContent(
                                loadingSurveys,
                                errorSurveys,
                                surveys,
                                () => (
                                    <div className="space-y-6">
                                        {surveys.map((survey, index) => (
                                            <div key={survey.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h5 className="text-lg font-semibold text-gray-800">Survey #{index + 1}</h5>
                                                    <span className="text-sm text-gray-500">Created: {new Date(survey.createAt).toLocaleDateString()}</span>
                                                </div>
                                                
                                                {/* Basic Information */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-sm text-gray-600"><strong>Smoke Duration:</strong> {survey.smokeDuration}</p>
                                                        <p className="text-sm text-gray-600"><strong>Cigarettes Per Day:</strong> {survey.cigarettesPerDay}</p>
                                                        <p className="text-sm text-gray-600"><strong>Price Each:</strong> ${survey.priceEach}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600"><strong>Tried to Quit:</strong> {survey.triedToQuit ? "Yes" : "No"}</p>
                                                        <p className="text-sm text-gray-600"><strong>Health Status:</strong> {survey.healthStatus}</p>
                                                        <p className="text-sm text-gray-600">
                                                            <strong>Dependency Level:</strong> 
                                                            <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                                                                survey.dependencyLevel <= 4 ? 'bg-green-100 text-green-800' :
                                                                survey.dependencyLevel <= 6 ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                                {survey.dependencyLevel}/10 ({getDependencyLevelDescription(survey.dependencyLevel)})
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Survey Answers */}
                                                <div className="border-t pt-4">
                                                    <h6 className="font-semibold text-gray-800 mb-2">Survey Answers:</h6>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                        {survey.a1 && <p><strong>Q1:</strong> {survey.a1}</p>}
                                                        {survey.a2 && <p><strong>Q2:</strong> {survey.a2}</p>}
                                                        {survey.a3 && <p><strong>Q3:</strong> {survey.a3}</p>}
                                                        {survey.a4 && <p><strong>Q4:</strong> {survey.a4}</p>}
                                                        {survey.a5 && <p><strong>Q5:</strong> {survey.a5}</p>}
                                                        {survey.a6 && <p><strong>Q6:</strong> {survey.a6}</p>}
                                                        {survey.a7 && <p><strong>Q7:</strong> {survey.a7}</p>}
                                                        {survey.a8 && <p><strong>Q8:</strong> {survey.a8}</p>}
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                {survey.note && (
                                                    <div className="border-t pt-4 mt-4">
                                                        <h6 className="font-semibold text-gray-800 mb-2">Notes:</h6>
                                                        <p className="text-sm text-gray-600 italic">{survey.note}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ),
                                "This user has not completed any surveys yet."
                            )}
                        </section>
                    )}

                    {activeTab === "membership" && (
                        <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Membership</h4>
                            {renderSectionContent(
                                loadingMembership,
                                errorMembership,
                                hasMembership !== null, // Sử dụng hasMembership để kiểm tra dữ liệu chung
                                () => (
                                    <div className="space-y-2 text-gray-700">
                                        <p>
                                            <strong>Status:</strong>{' '}
                                            {hasMembership ? (
                                                <span className="font-bold text-green-600">Have an active package</span>
                                            ) : (
                                                <span className="font-bold text-red-600">No packages are active</span>
                                            )}
                                        </p>
                                        {hasMembership && membershipDetails && (
                                            <>
                                                <p><strong>Package type:</strong> {membershipDetails.packageTypeName || "No update"}</p>
                                                <p><strong>Start date:</strong> {membershipDetails.startDate}</p>
                                                <p><strong>End date:</strong> {membershipDetails.endDate}</p>
                                            </>
                                        )}
                                        {hasMembership && !membershipDetails && !loadingMembership && (
                                            <p className="text-yellow-700 italic">Confirmed active package but unable to load details.</p>
                                        )}
                                    </div>
                                ),
                                // Message khi không có gói nào hoạt động (hasMembership là false)
                                "This user currently has no active memberships."
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;