import React, { useState, useEffect } from 'react';
import { Menu, LogOut, User, Truck, MapPin, Heart, HelpCircle, X, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
function Sidebar() {
  const [showMenu, setShowMenu] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const activeItem = location.pathname;
  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowMenu(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: <User size={20} />, label: 'Thông tin cá nhân', link: '/profile' },
    { icon: <Truck size={20} />, label: 'Quản lý đơn hàng', link: '/ordermanagement' },
    { icon: <MapPin size={20} />, label: 'Thiết lập địa chỉ', link: '/address' },
    { icon: <Heart size={20} />, label: 'Sản phẩm yêu thích', link: '/wishlist' },
    { icon: <HelpCircle size={20} />, label: 'Hỗ trợ tài khoản', link: '/support' },
    { icon: <LogOut size={20} />, label: 'Đăng xuất', link: '#', special: true },
  ];

  return (
    <div className="mt-10">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 display-hover pb-10">
        <p className="text-gray-500">Trang chủ -</p>
        <p className="text-black">
          {menuItems.find(item => item.link === activeItem)?.label || ''}
        </p>
      </div>

      {/* Sidebar */}
      <div className={`bg-white md:bg-gradient-to-b md:from-gray-50 md:to-white  md:static fixed top-0 left-0 z-40 h-full w-72 transition-all duration-300 ${showMenu ? 'translate-x-0' : '-translate-x-full'
        } rounded-r-3xl md:rounded-xl overflow-hidden border-r md:border-gray-50`}>

        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-xl">Foxy Store</h2>
              <p className="text-blue-100 text-sm mt-1">Tài khoản của bạn</p>
            </div>
            {isMobile && (
              <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-5">
          <ul className="space-y-1 text-gray-700">
            {menuItems.map((item, index) => {
              if (item.special) {
                // Đăng xuất
                return (
                  <li key={index}>
                    <button
                      onClick={() => {
                        if (!window.confirm("Xác nhận đăng xuất")) {
                          return;
                        }
                        localStorage.removeItem("token");
                        localStorage.removeItem("cart")
                        alert("Đăng xuất thành công");
                        setTimeout(()=>{
                          navigate("/login");
                        },500)
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
                    >
                      <div className="flex items-center gap-3 text-red-500">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </button>
                  </li>
                );
              }

              // Các item bình thường
              return (
                <li key={index}>
                  <Link
                    to={item.link}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeItem === item.link
                        ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                        : 'hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`${activeItem === item.link ? 'text-blue-600' : 'text-gray-500'
                          }`}
                      >
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`${activeItem === item.link ? 'opacity-50' : 'opacity-0'
                        } text-blue-600 transition-opacity`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
