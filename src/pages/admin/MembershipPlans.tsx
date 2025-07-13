// src/pages/admin/MembershipPlan.tsx

import React, { useState, useEffect } from 'react';
import { getAllPackageTypes, createPackageType, updatePackageType, deletePackageType } from '@/api/membershipApi';
import type { PackageType, PackageTypeCreateDto, PackageTypeUpdateDto } from '@/api/membershipApi';

// Define the shape of the form data, now matching PackageTypeCreateDto/UpdateDto
interface PackageFormState {
    id?: string; // Optional for new packages, required for updates
    name: string;
    description: string;
    des1: string;
    des2: string;
    des3: string;
    des4: string;
    des5: string;
    price: number;
    duration: number; // Added duration
}

const MembershipPlans: React.FC = () => {
    const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentPackage, setCurrentPackage] = useState<PackageType | null>(null); // For editing
    const [formState, setFormState] = useState<PackageFormState>({
        name: '',
        description: '',
        des1: '',
        des2: '',
        des3: '',
        des4: '',
        des5: '',
        price: 0,
        duration: 0, // Initialize duration
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null); // For success/error messages

    const fetchPackageTypes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllPackageTypes();
            setPackageTypes(data);
        } catch (err: any) {
            console.error("Error fetching package types:", err);
            setError("Unable to load package type list. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchPackageTypes();
    }, []);

    // Handle input changes in the form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: (name === 'price' || name === 'duration') ? parseFloat(value) : value,
        }));
    };

    // Open modal for creating a new package
    const handleCreateClick = () => {
        setCurrentPackage(null); // Clear current package for new creation
        setFormState({
            name: '',
            description: '',
            des1: '',
            des2: '',
            des3: '',
            des4: '',
            des5: '',
            price: 0,
            duration: 0,
        });
        setMessage(null); // Clear any previous messages
        setIsModalOpen(true);
    };

    // Open modal for editing an existing package
    const handleEditClick = (pkg: PackageType) => {
        setCurrentPackage(pkg);
        setFormState({
            id: pkg.id,
            name: pkg.name,
            description: pkg.description,
            des1: pkg.des1,
            des2: pkg.des2,
            des3: pkg.des3,
            des4: pkg.des4,
            des5: pkg.des5,
            price: pkg.price,
            duration: pkg.duration, // Populate duration
        });
        setMessage(null); // Clear any previous messages
        setIsModalOpen(true);
    };

    // Handle form submission (create or update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            if (currentPackage) {
                // Update existing package
                const updateData: PackageTypeUpdateDto = {
                    name: formState.name,
                    description: formState.description,
                    des1: formState.des1,
                    des2: formState.des2,
                    des3: formState.des3,
                    des4: formState.des4,
                    des5: formState.des5,
                    price: formState.price,
                    duration: formState.duration,
                };
                const updated = await updatePackageType(currentPackage.id, updateData);
                setMessage(`Cập nhật gói "${updated.name}" thành công!`);
            } else {
                // Create new package
                const createData: PackageTypeCreateDto = {
                    name: formState.name,
                    description: formState.description,
                    des1: formState.des1,
                    des2: formState.des2,
                    des3: formState.des3,
                    des4: formState.des4,
                    des5: formState.des5,
                    price: formState.price,
                    duration: formState.duration,
                };
                const newPackage = await createPackageType(createData);
                setMessage(`Tạo gói "${newPackage.name}" thành công!`);
            }
            setIsModalOpen(false);
            fetchPackageTypes(); // Re-fetch data to update the list
        } catch (err: any) {
            setMessage(`Lỗi: ${err.message || 'Không thể thực hiện thao tác.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle package deletion
    const handleDeleteClick = async (id: string, name: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa gói "${name}" này không?`)) {
            setLoading(true); // Show loading while deleting
            setError(null);
            setMessage(null);
            try {
                await deletePackageType(id);
                setMessage(`Xóa gói "${name}" thành công!`);
                fetchPackageTypes(); // Re-fetch data
            } catch (err: any) {
                setError(err.message || `Không thể xóa gói "${name}".`);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl mt-8">
            <h1 className="text-3xl font-bold text-green-700 mb-6 border-b pb-3">Manage Membership Packages</h1>

            {message && (
        <div className={`p-3 mb-4 rounded-lg text-white ${message.startsWith('Error') ? 'bg-red-500' : 'bg-green-500'}`}>
          {message}
        </div>
      )}

      {loading && (
        <div className="text-center text-blue-600 text-lg">Loading data...</div>
      )}

      {error && (
        <div className="text-center text-red-600 text-lg p-4 bg-red-100 rounded-lg border border-red-300">
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add new package
            </button>
          </div>

          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Gói</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời Lượng (ngày)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả 1</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả 2</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả 3</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả 4</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả 5</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packageTypes.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{pkg.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.price.toLocaleString('vi-VN')} VNĐ</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.duration} ngày</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{pkg.des1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{pkg.des2}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{pkg.des3}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{pkg.des4}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden text-ellipsis">{pkg.des5}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(pkg)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-150 ease-in-out transform hover:scale-110"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(pkg.id, pkg.name)}
                        className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out transform hover:scale-110"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal for Add/Edit Package */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {currentPackage ? 'Chỉnh Sửa Gói Thành Viên' : 'Thêm Gói Thành Viên Mới'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Pakage name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formState.description}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (VNĐ)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formState.price}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration (day)</label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formState.duration}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                    min="0"
                  />
                </div>
                {/* Description fields */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={`des${i + 1}`}>
                    <label htmlFor={`des${i + 1}`} className="block text-sm font-medium text-gray-700 mb-1">Description {i + 1}</label>
                    <input
                      type="text"
                      id={`des${i + 1}`}
                      name={`des${i + 1}`}
                      value={(formState as any)[`des${i + 1}`]}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (currentPackage ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPlans;
