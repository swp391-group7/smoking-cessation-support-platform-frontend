// src/pages/admin/MembershipPlan.tsx

import React, { useState, useEffect } from 'react';
import {
    getAllPackageTypes,
    createPackageType,
    updatePackageType,
    deletePackageType,
    PackageType,
    PackageTypeCreateUpdateDto
} from '@/api/membershipApi'; // Đảm bảo import đúng đường dẫn

// Component hoặc trang chính để quản lý Package Types
const AdminMembershipPlanPage: React.FC = () => {
    const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingPackage, setEditingPackage] = useState<PackageType | null>(null); // Để lưu gói đang chỉnh sửa
    const [showForm, setShowForm] = useState<boolean>(false); // Để ẩn/hiện form tạo/sửa

    // State cho form
    const [formData, setFormData] = useState<PackageTypeCreateUpdateDto>({
        name: '',
        description: '',
        des1: '',
        des2: '',
        des3: '',
        des4: '',
        des5: '',
        price: 0,
    });

    useEffect(() => {
        fetchPackageTypes();
    }, []);

    const fetchPackageTypes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllPackageTypes();
            setPackageTypes(data);
        } catch (err: any) {
            console.error("Error fetching package types:", err);
            setError("Không thể tải danh sách loại gói. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value
        }));
    };

    const handleCreateUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (editingPackage) {
                // Cập nhật
                await updatePackageType(editingPackage.id, formData);
                alert("Cập nhật loại gói thành công!");
            } else {
                // Tạo mới
                await createPackageType(formData);
                alert("Tạo loại gói mới thành công!");
            }
            setShowForm(false);
            setEditingPackage(null);
            resetForm();
            fetchPackageTypes(); // Refresh list
        } catch (err: any) {
            console.error("Error creating/updating package type:", err);
            setError(err.message || "Lỗi khi thực hiện thao tác.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa loại gói này?")) {
            setLoading(true);
            setError(null);
            try {
                await deletePackageType(id);
                alert("Xóa loại gói thành công!");
                fetchPackageTypes(); // Refresh list
            } catch (err: any) {
                console.error("Error deleting package type:", err);
                setError(err.message || "Lỗi khi xóa loại gói.");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEditClick = (packageType: PackageType) => {
        setEditingPackage(packageType);
        setFormData({
            name: packageType.name,
            description: packageType.description,
            des1: packageType.des1,
            des2: packageType.des2,
            des3: packageType.des3,
            des4: packageType.des4,
            des5: packageType.des5,
            price: packageType.price,
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            des1: '',
            des2: '',
            des3: '',
            des4: '',
            des5: '',
            price: 0,
        });
        setEditingPackage(null);
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl mt-8">
            <h2 className="text-3xl font-bold text-green-700 mb-6 border-b pb-3">Quản lý các loại gói Membership</h2>

            <button
                onClick={() => { setShowForm(!showForm); resetForm(); }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6 transition duration-200"
            >
                {showForm ? "Ẩn Form" : "Thêm loại gói mới"}
            </button>

            {showForm && (
                <div className="bg-gray-100 p-6 rounded-lg mb-6 shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {editingPackage ? `Chỉnh sửa loại gói: ${editingPackage.name}` : "Thêm loại gói mới"}
                    </h3>
                    <form onSubmit={handleCreateUpdate} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên gói</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                required
                            ></textarea>
                        </div>
                        {/* Các trường des1-des5 */}
                        {Array.from({ length: 5 }, (_, i) => `des${i + 1}`).map((desField) => (
                            <div key={desField}>
                                <label htmlFor={desField} className="block text-sm font-medium text-gray-700">
                                    Mô tả chi tiết {i + 1}
                                </label>
                                <input
                                    type="text"
                                    id={desField}
                                    name={desField}
                                    value={(formData as any)[desField]}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    required
                                />
                            </div>
                        ))}
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Giá</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                                disabled={loading}
                            >
                                {editingPackage ? "Cập nhật" : "Tạo mới"}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); resetForm(); }}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition duration-200"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading && <div className="text-center py-4 text-gray-600">Đang tải danh sách loại gói...</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center text-sm mb-4">{error}</div>}

            {!loading && !error && packageTypes.length === 0 && (
                <p className="text-gray-600 italic">Hiện chưa có loại gói membership nào.</p>
            )}

            {!loading && !error && packageTypes.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Tên gói</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Mô tả</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Giá</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packageTypes.map((pkg) => (
                                <tr key={pkg.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800 font-medium">{pkg.name}</td>
                                    <td className="py-3 px-4 text-gray-700 text-sm">{pkg.description}</td>
                                    <td className="py-3 px-4 text-gray-700">{pkg.price}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => handleEditClick(pkg)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-3 rounded mr-2 transition duration-200"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded transition duration-200"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminMembershipPlanPage;