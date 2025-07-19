import React, { useState, useEffect } from 'react';
import { Plus, Search, X, UserPlus, Lock, Unlock, Eye, Shield } from 'lucide-react';

// Định nghĩa danh sách roles
const roles = [
    { roleId: 2, roleName: 'ADMIN', description: 'Tài khoản Admin' },
    { roleId: 1, roleName: 'USER', description: 'Tài khoản người dùng' },
];
const genders = ['Nam', 'Nữ', 'Khác'];
const token =localStorage.getItem("token")
// API functions
const api = {
    baseURL: 'http://localhost:8080/api/v1/admin/',

    async getUsers() {
        const response = await fetch(`${this.baseURL}getAll`,{
            method:"GET",
            headers:{
         "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Không thể lấy danh sách người dùng');
        }
        const data = await response.json();
        return data.result || data;
    },

    async getUserById(id) {
        const response = await fetch(`${this.baseURL}user/${id}`,{
            method:"GET",
            headers:{
         "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Không thể lấy thông tin người dùng');
        }
        const data = await response.json();
        return data.result || data;
    },

    async createUser(userData) {
        const response = await fetch(this.baseURL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,

             },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Không thể tạo người dùng');
        }
        const data = await response.json();
        return data.result || data;
    },

    async updateUserStatus(id, status) {
        const response = await fetch(`${this.baseURL}user/${id}/status`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,

             },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) {
            let errorMessage = 'Không thể cập nhật trạng thái';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                errorMessage = await response.text() || errorMessage;
            }
            throw new Error(errorMessage);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data.result || data;
        }
        return { success: true };
    },

    async updateUserRoles(id, roleIds) {
    const response = await fetch(`${this.baseURL}user/${id}/role`, { 
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            
        },
        body: JSON.stringify({ roleIds }), 
    });
    if (!response.ok) {
        let errorMessage = 'Không thể cập nhật quyền';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            errorMessage = await response.text() || errorMessage;
        }
        throw new Error(errorMessage);
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data.result || data;
    }
    return { success: true };
},
};

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [userDetail, setUserDetail] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

  
    const [form, setForm] = useState({
        userName: '',
        email: '',
        roles: [{ roleId: 2, roleName: 'User', description: 'Tài khoản người dùng' }],
        status: 'Hoạt động',
        gender: 'Nam',
        dob: '',
    });

   
    const [roleForm, setRoleForm] = useState({
        roleId: 2,
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;
    const totalPages = Math.ceil(Array.isArray(users) ? users.length / pageSize : 0);

    // Helper function to get primary role name
    const getPrimaryRole = (roles) => {
        if (!Array.isArray(roles) || roles.length === 0 || !roles[0]?.roleName) return 'User';
        return roles[0].roleName;
    };

    // Load users on component mount
    useEffect(() => {
        loadUsers();
    }, []);

    // Load users from API
    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getUsers();
            setUsers(data);
        } catch (err) {
            setError('Không thể tải danh sách người dùng: ' + err.message);
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load user detail
    const loadUserDetail = async (userId) => {
        try {
            const data = await api.getUserById(userId);
            setUserDetail(data);
            setShowDetailModal(true);
        } catch (err) {
            setError('Không thể tải thông tin chi tiết: ' + err.message);
            console.error('Error loading user detail:', err);
        }
    };

    // Lọc người dùng
    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        user.userName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
    ) : [];

    // Lấy dữ liệu trang hiện tại
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Khi search thay đổi thì về trang 1
    useEffect(() => {
        setCurrentPage(1);
    }, [search, users.length]);

    // Mở modal thêm
    const openModal = () => {
        setModalType('add');
        setShowModal(true);
        setForm({
            userName: '',
            email: '',
            roles: [{ roleId: 2, roleName: 'User', description: 'Tài khoản người dùng' }],
            status: 'Hoạt động',
            gender: 'Nam',
            dob: '',
        });
    };

    // Mở modal cập nhật quyền
    const openRoleModal = (user) => {
        setSelectedUser(user);
        setRoleForm({
            roleId: user.roles[0]?.roleId || 2,
        });
        setShowRoleModal(true);
    };

    // Đóng modal thêm
    const closeModal = () => {
        setShowModal(false);
        setForm({
            userName: '',
            email: '',
            roles: [{ roleId: 2, roleName: 'User', description: 'Tài khoản người dùng' }],
            status: 'Hoạt động',
            gender: 'Nam',
            dob: '',
        });
    };

    // Đóng modal chi tiết
    const closeDetailModal = () => {
        setShowDetailModal(false);
        setUserDetail(null);
    };

    // Đóng modal cập nhật quyền
    const closeRoleModal = () => {
        setShowRoleModal(false);
        setSelectedUser(null);
        setRoleForm({ roleId: 2 });
    };

    // Xử lý thêm người dùng
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!form.userName || !form.email) {
    //         setError('Vui lòng điền đầy đủ họ tên và email');
    //         return;
    //     }
    //     try {
    //         setError(null);
    //         const payload = {
    //             userName: form.userName,
    //             email: form.email,
    //             roles: form.roles,
    //             status: form.status,
    //             gender: form.gender,
    //             dob: form.dob,
    //         };
    //         await api.createUser(payload);
    //         await loadUsers();
    //         closeModal();
    //     } catch (err) {
    //         let errorMessage = 'Không thể lưu thông tin';
    //         if (err.message.includes('Email đã tồn tại')) {
    //             errorMessage = 'Email đã tồn tại';
    //         }
    //         setError(errorMessage);
    //         console.error('Error saving user:', err);
    //     }
    // };

    // Xử lý cập nhật quyền
    const handleUpdateRoles = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    const selectedRole = roles.find(role => role.roleId === parseInt(roleForm.roleId));
    const originalUsers = [...users];
    
    // Cập nhật UI trước
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, roles: [selectedRole] } : u));
    
    try {
        setError(null);
        // Gửi mảng roleIds thay vì mảng role objects
        await api.updateUserRoles(selectedUser.id, [selectedRole.roleId]);
        console.log('Roles updated successfully:', selectedRole);
        closeRoleModal();
    } catch (err) {
        // Rollback nếu có lỗi
        setUsers(originalUsers);
        setError('Không thể cập nhật quyền: ' + err.message);
        console.error('Error updating roles:', err);
    }
};

    // Khóa/Mở khóa người dùng
    const toggleStatus = async (user) => {
        const newStatus = user.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động';
        const originalUsers = [...users];
        setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        try {
            setError(null);
            await api.updateUserStatus(user.id, newStatus);
            console.log('Status updated successfully:', newStatus);
        } catch (err) {
            setUsers(originalUsers);
            setError('Không thể cập nhật trạng thái: ' + err.message);
            console.error('Error updating status:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Đang tải...</div>
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                    <button 
                        className="float-right font-bold text-red-700 hover:text-red-900"
                        onClick={() => setError(null)}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
                {/* <button
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    onClick={openModal}
                >
                    <Plus size={18} className="mr-2" /> Thêm người dùng
                </button> */}
            </div>

            <div className="flex items-center mb-4">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-indigo-50 text-indigo-700">
                        <tr>
                            <th className="p-3 font-semibold">Họ tên</th>
                            <th className="p-3 font-semibold">Email</th>
                            <th className="p-3 font-semibold">Giới tính</th>
                            <th className="p-3 font-semibold">Ngày sinh</th>
                            <th className="p-3 font-semibold">Vai trò</th>
                            <th className="p-3 font-semibold">Trạng thái</th>
                            <th className="p-3 text-center font-semibold">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map(user => (
                            <tr key={user.id} className="border-t hover:bg-indigo-50 transition">
                                <td 
                                    className="p-3 cursor-pointer hover:text-indigo-600 hover:underline"
                                    onClick={() => loadUserDetail(user.id)}
                                >
                                    {user.userName}
                                </td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.gender || ''}</td>
                                <td className="p-3">{user.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : ''}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${getPrimaryRole(user.roles) === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {getPrimaryRole(user.roles)}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${user.status === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-3 flex justify-center space-x-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition"
                                        title="Xem chi tiết"
                                        onClick={() => loadUserDetail(user.id)}
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        className="text-purple-600 hover:text-purple-800 p-2 rounded-full hover:bg-purple-100 transition"
                                        title="Cập nhật quyền"
                                        onClick={() => openRoleModal(user)}
                                    >
                                        <Shield size={18} />
                                    </button>
                                    <button
                                        className={`p-2 rounded-full transition ${user.status === 'Hoạt động'
                                            ? 'text-green-600 hover:text-green-800 hover:bg-green-100'
                                            : 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100'
                                        }`}
                                        title={user.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                        onClick={() => toggleStatus(user)}
                                    >
                                        {user.status === 'Đã khóa' ? <Lock size={18} /> : <Unlock size={18} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {paginatedUsers.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center p-4 text-gray-500">Không tìm thấy người dùng.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            className={`px-3 py-1 rounded-l-md border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50`}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                className={`px-3 py-1 border-t border-b border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 transition
                                    ${currentPage === idx + 1 ? 'font-bold bg-indigo-100' : ''}`}
                                onClick={() => setCurrentPage(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            className={`px-3 py-1 rounded-r-md border border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50`}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </nav>
                </div>
            )}

            {/* Modal Chi tiết người dùng */}
            {showDetailModal && userDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 backdrop-blur-[2px] transition-all">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                            onClick={closeDetailModal}
                            aria-label="Đóng"
                        >
                            <X size={22} />
                        </button>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Eye size={22} />
                            Chi tiết người dùng
                        </h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">ID</label>
                                    <p className="text-gray-900">{userDetail.id}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Họ tên</label>
                                    <p className="text-gray-900">{userDetail.userName || 'N/A'}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <p className="text-gray-900">{userDetail.email || 'N/A'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Giới tính</label>
                                    <p className="text-gray-900">{userDetail.gender || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Ngày sinh</label>
                                    <p className="text-gray-900">
                                        {userDetail.dob ? new Date(userDetail.dob).toLocaleDateString('vi-VN') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Vai trò</label>
                                    <div className="space-y-1">
                                        {Array.isArray(userDetail.roles) && userDetail.roles.map((role, index) => (
                                            <span key={index} className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mr-2
                                                ${role.roleName === 'Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {role.roleName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Trạng thái</label>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                                        ${userDetail.status === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {userDetail.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                                onClick={closeDetailModal}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Thêm người dùng */}
            {/* {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 backdrop-blur-[2px] transition-all">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                            onClick={closeModal}
                            aria-label="Đóng"
                        >
                            <X size={22} />
                        </button>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <UserPlus size={22} />
                            Thêm người dùng
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Họ tên</label>
                                <input
                                    type="text"
                                    required
                                    value={form.userName}
                                    onChange={e => setForm({ ...form, userName: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Giới tính</label>
                                <select
                                    value={form.gender}
                                    onChange={e => setForm({ ...form, gender: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                                >
                                    {genders.map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                                <input
                                    type="date"
                                    value={form.dob}
                                    onChange={e => setForm({ ...form, dob: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Vai trò</label>
                                <select
                                    value={form.roles[0]?.roleId || 2}
                                    onChange={(e) => {
                                        const selectedRole = roles.find(role => role.roleId === parseInt(e.target.value));
                                        setForm({ ...form, roles: [selectedRole] });
                                    }}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                                >
                                    {roles.map(role => (
                                        <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                                >
                                    <option value="Hoạt động">Hoạt động</option>
                                    <option value="Đã khóa">Đã khóa</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                                    onClick={closeModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold"
                                    onClick={handleSubmit}
                                >
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Modal Cập nhật quyền */}
            {showRoleModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 backdrop-blur-[2px] transition-all">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                            onClick={closeRoleModal}
                            aria-label="Đóng"
                        >
                            <X size={22} />
                        </button>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Shield size={22} />
                            Cập nhật quyền: {selectedUser.userName}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Vai trò</label>
                                <select
                                    value={roleForm.roleId}
                                    onChange={(e) => setRoleForm({ ...roleForm, roleId: parseInt(e.target.value) })}
                                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                                >
                                    {roles.map(role => (
                                        <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                                    onClick={closeRoleModal}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold"
                                    onClick={handleUpdateRoles}
                                >
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;