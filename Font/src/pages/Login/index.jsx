import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOff, IoEye } from "react-icons/io5";
import { request } from '../../untils/request.js';
import authService from '../../untils/auth.js';
import {jwtDecode} from "jwt-decode";
import {getOrCreateSessionId} from '../../untils/session.js';
function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState({
        email: "",
        password: "",
        sessionId : getOrCreateSessionId(),
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const validateField = (name, value) => {
        let msg = "";
        if (name === "email") {
            if (!value) {
                msg = "Vui lòng nhập email";
            } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(value)) {
                msg = "Email không hợp lệ";
            }
        }
        return msg;
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value),
        }));
    };
    const handleOnclickLogin = async () => {
        // Kiểm tra lại tất cả trường trước khi gửi
        const newErrors = {
            email: validateField("email", user.email),
            password: validateField("password", user.password),
        };
        setErrors(newErrors);
        if (newErrors.email || newErrors.password) {
            return;
        }

        try {
            const response = await request.post("user/login", user);
            alert("Đăng nhập thành công");
            localStorage.setItem("token", response.data.result.accessToken);
            const decoded =jwtDecode(response.data.result.accessToken);
            console.log(decoded);
            setTimeout(() => {
                if(decoded && decoded.scope.includes("USER")){
                        navigate("/");
                }
                else{
                    navigate("/admin")
                }
            }, 1000);
        }
        catch (e) {
            alert("Đăng nhập thất bại");
            console.log("Lỗi ", e);
        }
    };
    return (
        <div className="bg-white flex flex-col justify-between border-gray-300 border-y-[1px]">
            <div className="flex flex-grow items-center justify-center px-4 py-12">
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left side - Login */}
                    <div className="w-full max-w-xl">
                        <h2 className="text-3xl font-bold text-center mb-2 uppercase">Đăng nhập</h2>
                        <p className="text-center mb-6">
                            Vui lòng nhập thông tin và tận hưởng trải nghiệm cá nhân hóa cùng FOXY
                        </p>
                        <form className="space-y-4" autoComplete="off" onSubmit={e => e.preventDefault()}>
                            <div>
                                <label className="block font-medium mb-1">
                                    Email / Tên đăng nhập <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    placeholder="Nhập email hoặc tên đăng nhập của Quý khách"
                                    className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black ${errors.email ? "border-red-500" : ""}`}
                                />
                                {errors.email && (
                                    <div className="text-red-600 text-sm mt-1">{errors.email}</div>
                                )}
                            </div>

                            <div>
                                <label className="block font-medium mb-1">
                                    Mật khẩu <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={user.password}
                                        onChange={handleChange}
                                        placeholder="Nhập mật khẩu"
                                        className={`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black ${errors.password ? "border-red-500" : ""}`}
                                    />
                                    <div
                                        className="absolute right-3 top-3.5 text-xl text-gray-600 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <IoEye /> : <IoEyeOff />}
                                    </div>
                                </div>
                                {errors.password && (
                                    <div className="text-red-600 text-sm mt-1">{errors.password}</div>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input id="remember" type="checkbox" className="mr-2" />
                                <label htmlFor="remember" className="text-sm">
                                    Nhớ thông tin đăng nhập của tôi
                                </label>
                            </div>

                            <button
                                type="button"
                                className="cursor-pointer w-full bg-black text-white py-3 rounded-full hover:bg-red-600 transition uppercase"
                                onClick={handleOnclickLogin}
                            >
                                ĐĂNG NHẬP
                            </button>

                            {/* đăng nhập google */}
                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="cursor-pointer w-full flex items-center justify-center border border-gray-300 py-3 rounded hover:bg-gray-100 transition"
                                    onClick={() => {
                                        authService.login();
                                    }}
                                >
                                    <img
                                        src="https://developers.google.com/identity/images/g-logo.png"
                                        alt="Google"
                                        className="w-5 h-5 mr-3"
                                    />
                                    <span className=" font-medium text-gray-700">Đăng nhập bằng Google</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right side - Register */}
                    <div className="bg-gray-50 p-8 rounded shadow-sm flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-center mb-4">Khách hàng mới của FoxyStore</h3>
                        <p className="text-center mb-6 text-gray-600">
                            Nếu bạn chưa có tài khoản trên foxystore.com, hãy sử dụng tùy chọn này để truy cập biểu mẫu đăng ký.
                            Bằng cách cung cấp cho FoxyStore thông tin chi tiết của bạn, quá trình mua hàng trên foxystore.com sẽ là một trải nghiệm thú vị và nhanh chóng hơn!
                        </p>
                        <Link
                            to="/register"
                            className="cursor-pointer block text-center bg-black text-white py-3 rounded-full hover:bg-red-600 transition uppercase"
                        >
                            ĐĂNG KÝ
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
export default Login;
