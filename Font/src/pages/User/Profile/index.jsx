import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Calendar, Edit2, Lock, AlertCircle } from 'lucide-react';
import { request } from "../../../untils/request.js";
import { motion } from 'framer-motion';
const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userInfo, setUserInfo] = useState({
    userName :"",
    email:"",
    dob:"",
    gender:""
  });
  const token = localStorage.getItem("token");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Lấy thông tin user khi component được mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await request.get("user/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log(response);
        setUserInfo(response.data.result);
      }
      catch (e) {
        console.log("error: ", e);
      }
    }
    fetch();
  }, []);


  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };

  // Xử lý chọn giới tính
  const handleGenderChange = (gender) => {
    setUserInfo({
      ...userInfo,
      gender
    });
  };

  // Xử lý cập nhật thông tin
  const handleUpdateProfile = async () => {
    if(!window.confirm("xác nhận cập nhật thông tin tài khoản tài khoản")){
      return;
    }
    try {
      const response = await request.patch("user/profile", userInfo, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response);
      // setUserInfo(response.data.result)
      localStorage.setItem("token",response.data.result)
      alert("cập nhật tài khoản thành công")
    }
    catch (e) {
      console.log("error", e);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }

    try {
      const response = await request.post(
        'user/change-password',
        {
          oldPassword : passwordData.oldPassword,
          newPassword : passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      alert("Cập nhật mật khẩu thành công!");
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      if(e.response.data.code==1008){
        alert("Mật khẩu cũ không chính xác!")
        return;
      }
      console.error(e);
      alert('Có lỗi xảy ra khi đổi mật khẩu!');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-white-50 to-white-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="text-center mb-5">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800">TÀI KHOẢN CỦA TÔI</h1>
        </div>

        {/* Content */}
        <div className="pt-10 px-6 pb-10 md:px-16">
          <>
            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      name="userName"
                      className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={userInfo.userName||" "}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={userInfo.dob|| ""}
                      onChange={handleInputChange}
                      // placeholder=''
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      name="email"
                      className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={userInfo.email||" "}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="relative flex justify-center items-center p-4 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="gender"
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        checked={userInfo.gender === "Nam"}
                        onChange={() => handleGenderChange("Nam")}
                      />
                      <span className="ml-3 text-gray-700">Nam</span>
                    </label>
                    <label className="relative flex justify-center items-center p-4 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="gender"
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        checked={userInfo.gender === "Nữ"}
                        onChange={() => handleGenderChange("Nữ")}
                      />
                      <span className="ml-3 text-gray-700">Nữ</span>
                    </label>
                    <label className="relative flex justify-center items-center p-4 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="gender"
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        checked={userInfo.gender === "Khác" || userInfo.gender === ""}
                        onChange={() => handleGenderChange("Khác")}
                      />
                      <span className="ml-3 text-gray-700">Khác</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-32 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-6 justify-center">
              <button
                className={`cursor-pointer flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md text-lg ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleUpdateProfile}
                disabled={saving}
              >
                <span className="font-medium">
                  {saving ? 'ĐANG CẬP NHẬT...' : 'CẬP NHẬT'}
                </span>
              </button>
              <button
                className="flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 text-white px-8 py-4 rounded-lg hover:from-gray-800 hover:to-gray-900 transition shadow-md text-lg"
                onClick={() => setShowPasswordModal(true)}
              >
                <span className="font-medium">ĐỔI MẬT KHẨU</span>
              </button>
            </div>
          </>
          {/* )} */}
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-gray-500">
        © 2025 Foxy Store. Mọi quyền được bảo lưu.
      </div>
      {showPasswordModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Lớp nền mờ */}
          <div className="absolute inset-0 bg-secondary opacity-70" onClick={() => setShowPasswordModal(false)}></div>

          {/* Nội dung chính */}
          <motion.div
            className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md z-10 lg:max-w-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-lg font-semibold mb-4">Đổi mật khẩu</h2>
            <div className="space-y-4">
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Mật khẩu cũ"
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Mật khẩu mới"
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Xác nhận mật khẩu"
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowPasswordModal(false)}
              >
                Hủy
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleUpdatePassword}
              >
                Xác nhận
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

    </div>
  );
};

export default Profile;