import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { request } from '../../../untils/request';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "userName":
        if (!value.trim()) error = "Tên đăng nhập không được để trống!";
        else if (value.length < 5) error = "Tên đăng nhập phải có ít nhất 5 ký tự!";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) error = "Email không được để trống!";
        else if (!emailRegex.test(value)) error = "Email không đúng định dạng!";
        break;
      case "password":
        if (!value) error = "Mật khẩu không được để trống!";
        else if (value.length < 8) error = "Mật khẩu phải có ít nhất 8 ký tự!";
        break;
      case "confirmPassword":
        if (!value) error = "Xác nhận mật khẩu không được để trống!";
        else if (value !== user.password) error = "Mật khẩu xác nhận không khớp!";
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleOnChangeInput = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(user).forEach((key) => {
      validateField(key, user[key]);
      if (!user[key]) newErrors[key] = "Vui lòng nhập đầy đủ thông tin!";
    });

    const hasError = Object.values({ ...errors, ...newErrors }).some(err => err);
    if (hasError) {
      alert("Vui lòng sửa các lỗi trước khi đăng ký.");
      return;
    }

    try {
      const { confirmPassword, ...userData } = user;
      const response = await request.post("user/register", userData);
      console.log(response);
      alert("Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.log("Lỗi đăng ký:", error);
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div className="border-y border-gray-300 bg-white min-h-screen flex flex-col justify-center">
      <div className="container max-w-6xl px-4 py-12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Left - Đăng ký */}
        <div className="w-full">
          <h2 className="text-3xl font-bold uppercase text-center mb-2">Đăng ký tài khoản</h2>
          <p className="text-center mb-6">Vui lòng nhập đầy đủ thông tin</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Tên đăng nhập */}
            <div className="relative md:pb-3">
              <label className="block font-medium mb-1">
                Tên đăng nhập <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="userName"
                placeholder="Nhập tên đăng nhập"
                className="w-full px-4 py-3 border rounded"
                value={user.userName}
                onChange={handleOnChangeInput}
              />
              {errors.userName && <p className="absolute text-red-500 text-sm mt-1">{errors.userName}</p>}
            </div>

            {/* Mật khẩu */}
            <div className="relative md:pb-3">
              <label className="block font-medium mb-1">
                Mật khẩu <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 border rounded"
                  value={user.password}
                  onChange={handleOnChangeInput}
                />
                <div
                  className="absolute top-3.5 right-3 cursor-pointer text-xl text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </div>
              </div>
              {errors.password && <p className="absolute text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="relative  md:pb-3">
              <label className="block font-medium mb-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  className="w-full px-4 py-3 border rounded"
                  value={user.confirmPassword}
                  onChange={handleOnChangeInput}
                />
                <div
                  className="absolute top-3.5 right-3 cursor-pointer text-xl text-gray-600"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </div>
              </div>
              {errors.confirmPassword && <p className="absolute text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Email */}
            <div className="relative  md:pb-3">
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                className="w-full px-4 py-3 border rounded"
                value={user.email}
                onChange={handleOnChangeInput}
              />
              {errors.email && <p className="absolute text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Checkbox */}
            <div className="space-y-2 text-sm">
              <label className="flex items-start">
                <input type="checkbox" className="mr-2 mt-1" defaultChecked />
                Tôi đồng ý Điều kiện – Điều khoản & Chính sách bảo mật của FOXY
              </label>
              <label className="flex items-start">
                <input type="checkbox" className="mr-2 mt-1" />
                Nhận thông tin và khuyến mãi mới nhất từ FOXY
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="w-full bg-black text-white py-3 rounded-full hover:bg-red-600 transition uppercase">
              Đăng ký ngay
            </button>
          </form>
        </div>

        {/* Right - Chuyển hướng đăng nhập */}
        <div className="bg-gray-50 p-8 rounded shadow-sm flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-center mb-4">Khách hàng mới của FoxyStore</h3>
          <p className="text-center mb-6 text-gray-600">
            Nếu bạn đã có tài khoản foxystore.com, hãy sử dụng tùy chọn này để đăng nhập.
            Quá trình mua hàng sẽ thú vị và nhanh chóng hơn!
          </p>
          <Link
            to="/login"
            className="block text-center bg-black text-white py-3 rounded-full hover:bg-red-600 transition uppercase"
          >
            ĐĂNG NHẬP
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
