// src/pages/admin/UserProfiles.tsx

import { useState, useEffect } from "react";
import { getUserById } from "@/api/userApi";
import type { UserInfo } from "@/api/userApi";
import { getAllSurveysOfUser } from "@/api/usersurveyApi";
import type { SurveyDetailDTO } from "@/api/usersurveyApi";
import { getActivePlanOfAnUser } from "@/api/userPlanApi";
import type { UserPlan } from "@/api/userPlanApi";
import { getAllBadgesOfUser } from "@/api/userBadgeApi";
import type { UserEarnedBadgeDetails } from "@/api/userBadgeApi";
import { getActiveMembershipPackage } from "@/api/membershipApi";
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
    const [surveys, setSurveys] = useState<SurveyDetailDTO[]>([]);
    const [activeMembership, setActiveMembership] = useState<MembershipPackageDto | null>(null);

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
                setErrorUserInfo("Không thể tải thông tin người dùng. Vui lòng thử lại.");
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
                            setErrorQuitPlan("Không thể tải kế hoạch cai thuốc.");
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
                            setErrorBadges("Không thể tải huy hiệu.");
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
                            setErrorSurveys("Không thể tải khảo sát.");
                        } finally {
                            setLoadingSurveys(false);
                        }
                    }
                    break;
                case "membership": // Logic mới cho tab membership
                    if (activeMembership === null) { // Chỉ fetch nếu chưa có dữ liệu
                        setLoadingMembership(true);
                        setErrorMembership(null);
                        try {
                            const { data: membershipData } = await (window as any).membershipApi.get<MembershipPackageDto>(`/membership-packages/user/${userId}/active`);
                            setActiveMembership(membershipData);
                        } catch (err: any) {
                            console.error("Failed to fetch active membership:", err);
                            // Kiểm tra lỗi 404 để hiển thị thông báo "Không có membership" rõ ràng hơn
                            if (err.response && err.response.status === 404) {
                                setErrorMembership("Người dùng này hiện không có gói membership nào đang hoạt động.");
                            } else {
                                setErrorMembership("Không thể tải thông tin gói membership. Vui lòng thử lại.");
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
    }, [activeTab, userId, quitPlan, badges, surveys, activeMembership]); // Add data states to dependencies to re-run if they become null for some reason


    // Overall loading/error state for the modal itself
    if (loadingUserInfo) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl relative">
                    <div className="text-center py-8 text-gray-600">Đang tải thông tin người dùng...</div>
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
                    <div className="text-center py-8 text-gray-600">Không tìm thấy thông tin người dùng.</div>
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
            return <div className="text-center py-4 text-gray-600">Đang tải dữ liệu...</div>;
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
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl relative h-[90vh] overflow-y-auto">
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
                        Thông tin người dùng
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "quitPlan" ? "border-b-2 border-green-600 text-green-600" : "text-gray-600 hover:text-gray-800"}`}
                        onClick={() => setActiveTab("quitPlan")}
                    >
                        Kế hoạch cai thuốc
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "badges" ? "border-b-2 border-green-600 text-green-600" : "text-gray-600 hover:text-gray-800"}`}
                        onClick={() => setActiveTab("badges")}
                    >
                        Huy hiệu
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "survey" ? "border-b-2 border-green-600 text-green-600" : "text-gray-600 hover:text-gray-800"}`}
                        onClick={() => setActiveTab("survey")}
                    >
                        Khảo sát
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
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Thông tin người dùng</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                <p><strong>Họ và tên:</strong> {userInfo.fullName}</p>
                                <p><strong>Email:</strong> {userInfo.email}</p>
                                <p><strong>Tên người dùng:</strong> {userInfo.username}</p>
                                <p><strong>Ngày sinh:</strong> {userInfo.dob || "Chưa cập nhật"}</p>
                                <p><strong>Số điện thoại:</strong> {userInfo.phoneNumber || "Chưa cập nhật"}</p>
                            </div>
                        </section>
                    )}

                    {activeTab === "quitPlan" && (
                        <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Kế hoạch cai thuốc</h4>
                            {renderSectionContent(
                                loadingQuitPlan,
                                errorQuitPlan,
                                quitPlan,
                                () => (
                                    <div className="space-y-2 text-gray-700">
                                        <p><strong>Phương pháp:</strong> {quitPlan?.method}</p>
                                        <p><strong>Trạng thái:</strong> {quitPlan?.status}</p>
                                        <p><strong>Ngày bắt đầu:</strong> {quitPlan?.startDate}</p>
                                        <p><strong>Ngày mục tiêu:</strong> {quitPlan?.targetDate}</p>
                                        <p><strong>Cập nhật lần cuối:</strong> {quitPlan?.updatedAt}</p>
                                    </div>
                                ),
                                "Người dùng này chưa có kế hoạch cai thuốc hoạt động."
                            )}
                        </section>
                    )}

                    {activeTab === "badges" && (
                        <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Huy hiệu</h4>
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
                                "Người dùng này chưa có huy hiệu nào."
                            )}
                        </section>
                    )}

                    {activeTab === "survey" && (
                        <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Khảo sát</h4>
                            {renderSectionContent(
                                loadingSurveys,
                                errorSurveys,
                                surveys,
                                () => (
                                    <div className="space-y-4">
                                        {surveys.map((survey, index) => (
                                            <div key={survey.id} className="border-b pb-3 last:border-b-0">
                                                <p className="font-medium text-gray-800">Khảo sát #{index + 1} (ID: {survey.id}) - Loại: {survey.typeSurvey}</p>
                                                <p className="text-gray-700">Ngày tạo: {survey.createAt}</p>
                                                {survey.questions.length > 0 ? (
                                                    <div className="ml-4 mt-2 space-y-2">
                                                        {survey.questions.map((q) => (
                                                            <div key={q.id}>
                                                                <p className="font-semibold text-gray-700">{q.content}</p>
                                                                {q.answers.length > 0 ? (
                                                                    <ul className="list-disc list-inside text-gray-600">
                                                                        {q.answers.map((a) => (
                                                                            <li key={a.id}>{a.answerText} (Điểm: {a.point})</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="text-gray-500 italic text-sm">Không có câu trả lời.</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 italic">Không có câu hỏi nào trong khảo sát này.</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ),
                                "Người dùng này chưa hoàn thành khảo sát nào."
                            )}
                        </section>
                    )}

                    {activeTab === "membership" && (
                        <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Gói Membership đang hoạt động</h4>
                            {renderSectionContent(
                                loadingMembership,
                                errorMembership,
                                activeMembership,
                                () => (
                                    <div className="space-y-2 text-gray-700">
                                        <p><strong>ID gói Membership:</strong> {activeMembership?.id}</p>
                                        <p><strong>ID loại gói:</strong> {activeMembership?.packageTypeId || activeMembership?.packagetTypeId}</p>
                                        <p><strong>Ngày bắt đầu:</strong> {activeMembership?.startDate}</p>
                                        <p><strong>Ngày kết thúc:</strong> {activeMembership?.endDate}</p>
                                        <p><strong>Trạng thái hoạt động:</strong> {activeMembership?.active ? "Có" : "Không"}</p>
                                        {/* Bạn có thể thêm thông tin chi tiết về PackageType nếu fetch được */}
                                        {/* <p><strong>Tên gói:</strong> {activeMembership?.packageName}</p> */}
                                        {/* <p><strong>Mô tả:</strong> {activeMembership?.packageDescription}</p> */}
                                        {/* <p><strong>Giá:</strong> {activeMembership?.packagePrice}</p> */}
                                    </div>
                                ),
                                "Người dùng này hiện không có gói membership nào đang hoạt động."
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

