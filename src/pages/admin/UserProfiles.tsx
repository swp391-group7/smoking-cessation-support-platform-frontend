// src/components/UserProfile.tsx
import { useState, useEffect } from "react";
import { getUserById } from "@/api/userApi";
import type { UserInfo } from "@/api/userApi";
import { getAllSurveysOfUser } from "@/api/usersurveyApi";
import type { SurveyDetailDTO } from "@/api/usersurveyApi";
import { getActivePlanOfAnUser } from "@/api/userPlanApi"; 
import type { UserPlan } from "@/api/userPlanApi";

// Temporary interfaces for Membership and Badge as APIs are not provided yet
interface UserMembership {
    id: string;
    userId: string;
    packageName: string;
    startDate: string;
    endDate: string;
    status: string;
    features?: string[]; // Added features for more detail
}

interface UserBadge {
    id: string;
    userId: string;
    badgeName: string;
    awardedDate: string;
}

// Define an extended UserInfo type for internal use in UserProfile
interface UserProfileInfo extends UserInfo {
    username: string; // Add username as it's used in User info section
}

interface UserProfileProps {
    userId: string;
    onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onClose }) => {
    const [userInfo, setUserInfo] = useState<UserProfileInfo | null>(null);
    const [quitPlan, setQuitPlan] = useState<UserPlan | null>(null);
    const [badges, setBadges] = useState<UserBadge[]>([]);
    const [surveys, setSurveys] = useState<SurveyDetailDTO[]>([]); // Changed to SurveyDetailDTO[]
    const [membership, setMembership] = useState<UserMembership | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Mock data for Membership and Badges (until actual APIs are provided)
    const mockBadges: UserBadge[] = [
        { id: "b1", userId: "1", badgeName: "Newbie", awardedDate: "2024-01-15" },
        { id: "b2", userId: "1", badgeName: "First Week Clean", awardedDate: "2024-01-22" },
        { id: "b3", userId: "2", badgeName: "Determined", awardedDate: "2024-03-01" },
        { id: "b4", userId: "3", badgeName: "Admin Pro", awardedDate: "2023-01-01" },
    ];

    const mockMemberships: UserMembership[] = [
        {
            id: "m1", userId: "1", packageName: "Gói Premium", startDate: "2024-01-01", endDate: "2025-01-01", status: "Active",
            features: ["Truy cập đầy đủ tính năng", "Hỗ trợ 24/7", "Huấn luyện viên riêng"]
        },
        {
            id: "m2", userId: "2", packageName: "Gói Cơ bản", startDate: "2024-03-15", endDate: "2024-09-15", status: "Active",
            features: ["Truy cập tính năng cơ bản", "Hỗ trợ cộng đồng"]
        },
        {
            id: "m3", userId: "3", packageName: "Gói Premium", startDate: "2023-06-01", endDate: "2024-06-01", status: "Expired",
            features: ["Truy cập đầy đủ tính năng", "Hỗ trợ 24/7", "Huấn luyện viên riêng"]
        },
    ];


    useEffect(() => {
        const fetchUserProfileData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch User Info
                const userData = await getUserById(parseInt(userId));
                setUserInfo({
                    ...userData,
                    username: userData.email.split('@')[0] // Derive username from email for display
                });

                // Fetch Quit Plan
                const planData = await getActivePlanOfAnUser(userId); // Use new API function
                setQuitPlan(planData);

                // Fetch Badges (using mock for now)
                const userBadges = mockBadges.filter(b => b.userId === userId);
                setBadges(userBadges);

                // Fetch Surveys (using new API function)
                const surveysData = await getAllSurveysOfUser(userId);
                setSurveys(surveysData);

                // Fetch Membership (using mock for now)
                const userMembership = mockMemberships.find(m => m.userId === userId);
                setMembership(userMembership || null);

            } catch (err) {
                console.error("Failed to fetch user profile data:", err);
                setError("Không thể tải dữ liệu hồ sơ người dùng. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfileData();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl relative">
                    <div className="text-center py-8 text-gray-600">Đang tải dữ liệu hồ sơ người dùng...</div>
                </div>
            </div>
        );
    }

    if (error) {
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
                        {error}
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
                <h3 className="text-2xl font-bold text-green-700 mb-6 border-b pb-2">Hồ sơ người dùng: {userInfo.fullName}</h3>

                <div className="space-y-8">
                    {/* 1. User Info */}
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

                    {/* 2. Quit Plan */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Kế hoạch cai thuốc</h4>
                        {quitPlan ? (
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Phương pháp:</strong> {quitPlan.method}</p>
                                <p><strong>Trạng thái:</strong> {quitPlan.status}</p>
                                <p><strong>Ngày bắt đầu:</strong> {quitPlan.startDate}</p>
                                <p><strong>Ngày mục tiêu:</strong> {quitPlan.targetDate}</p>
                                <p><strong>Cập nhật lần cuối:</strong> {quitPlan.updatedAt}</p>
                            </div>
                        ) : (
                            <p className="text-gray-600 italic">Người dùng này chưa có kế hoạch cai thuốc hoạt động.</p>
                        )}
                    </section>

                    {/* 3. Badges */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Huy hiệu</h4>
                        <div className="flex flex-wrap gap-3">
                            {badges.length > 0 ? (
                                badges.map((badge) => (
                                    <span key={badge.id} className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
                                        {badge.badgeName}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-600 italic">Người dùng này chưa có huy hiệu nào.</p>
                            )}
                        </div>
                    </section>

                    {/* 4. Survey */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Khảo sát</h4>
                        {surveys.length > 0 ? (
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
                        ) : (
                            <p className="text-gray-600 italic">Người dùng này chưa hoàn thành khảo sát nào.</p>
                        )}
                    </section>

                    {/* 5. Subscription */}
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h4 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Gói thành viên</h4>
                        {membership ? (
                            <div className="space-y-2 text-gray-700">
                                <p><strong>Tên gói:</strong> {membership.packageName}</p>
                                <p><strong>Trạng thái:</strong> {membership.status}</p>
                                <p><strong>Ngày bắt đầu:</strong> {membership.startDate}</p>
                                <p><strong>Ngày kết thúc:</strong> {membership.endDate}</p>
                                {membership.features && membership.features.length > 0 && (
                                    <div>
                                        <strong>Tính năng:</strong>
                                        <ul className="list-disc list-inside ml-4">
                                            {membership.features.map((feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-600 italic">Người dùng này hiện không có gói thành viên nào.</p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
