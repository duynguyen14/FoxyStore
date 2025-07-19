import React, { useState, useEffect } from "react";
import {
  Home,
  UserCog,
  Package,
  List,
  Layers,
  ShoppingBag,
  Star,
  Tag,
  CreditCard,
  BarChart2,
  MessageCircle,
  Users2,
  X,
  ChevronLeft,LogOut,ChevronRight,
  User
} from 'lucide-react';
import { Link, useLocation } from "react-router-dom";

function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [mobileOpen]);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home size={18} />,
      path: "/admin",
      badge: null,
    },
    {
      name: "Quản lý người dùng",
      icon: <UserCog size={18} />,
      path: "/admin/users",
      badge: "12",
    },
    {
      name: "Quản lí sản phẩm",
      icon: <Package size={18} />,
      path: "/admin/products",
      badge: "25",
    },
    {
      name: "Quản lí danh mục",
      icon: <List size={18} />,
      path:"/admin/catalogs",
      badge: null,
    },
    {
      name: "Quản lí thể loại",
      icon: <Layers size={18} />,
      path:  "/admin/categories",
      badge: null,
    },
    {
      name: "Quản lý đơn hàng",
      icon: <ShoppingBag size={18} />,
      path: "/admin/orders",
      badge: "8",
    },
    {
      name: "Quản lý đánh giá",
      icon: <Star size={18} />,
      path: "/admin/feedback",
      badge: "8",
    },
    {
      name: "Quản lý khuyến mãi",
      icon: <Tag size={18} />,
      path: "/admin/coupon",
      badge: "8",
    },
    // {
    //   name: "Quản lý thanh toán",
    //   icon: <CreditCard size={18} />,
    //   path: "/admin/payment",
    //   badge: "8",
    // },
    {
      name: "Quản lý doanh thu",
      icon: <BarChart2 size={18} />,
      path: "/admin/revenue",
      badge: null,
    },
    {
      name: "Báo cáo của hàng",
      icon: <MessageCircle size={18} />,
      path: "/admin/report-product",
      badge: "5",
    },
    // {
    //   name: "Quản lí nhân viên",
    //   icon: <Users2 size={18} />,
    //   path: "/admin/employees",
    //   badge: null,
    // },
    {
      name: "Tài khoản",
      icon: <User size={18} />,
      path: "/admin/account",
      badge: null,
    },
  ];

  return (
    <>
      {/* Lớp nền mờ cho di động */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-30 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Nút mở menu trên di động */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-md shadow-md hover:scale-105 transition-all"
        aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
      >
        {mobileOpen ? <X size={20} /> : <BarChart2 size={20} />}
      </button>

      {/* Sidebar chính */}
      <aside
        className={`
          fixed inset-y-0 left-0 bg-white border-r border-indigo-100 shadow-2xl z-40
          flex flex-col
          transition-[width] duration-200 ease-in-out
          ${collapsed ? "w-[90px]" : "w-[266px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          transitionProperty: 'width, left, right, background, box-shadow',
          transitionDuration: '200ms',
          transitionTimingFunction: 'ease-in-out',
        }}
      >
        {/* Header */}
        <div className="h-16 px-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-700 to-purple-600 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-white text-indigo-700 rounded-full flex items-center justify-center font-bold text-xl shadow-md border-2 border-purple-200">
                🦊
              </div>
              <h1 className="text-white font-bold text-lg tracking-wide drop-shadow">Foxy Admin</h1>
            </div>
          ) : (
            <div className="h-10 w-10 mx-auto bg-white text-indigo-700 rounded-full flex items-center justify-center font-bold text-xl shadow-md border-2 border-purple-200">
              🦊
            </div>
          )}

          {/* Nút đóng cho di động */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white hover:bg-indigo-700 p-1 rounded-full transition"
            aria-label="Đóng sidebar"
          >
            <X size={20} />
          </button>

          {/* Nút thu gọn/mở rộng cho desktop */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block text-white hover:bg-indigo-700 p-1 rounded-md transition"
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
        {/* Menu */}
        <nav className="flex-1 h-0 overflow-y-auto overflow-x-hidden px-2 pt-4 pb-20 bg-gradient-to-b from-white to-indigo-50">
          {!collapsed && (
            <p className="text-xs font-bold text-indigo-500 uppercase mb-2 px-2 tracking-wider">
              Menu
            </p>
          )}
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.path;
              return (
                <li key={index} className="relative">
                  <Link
                    to={item.path}
                    className={`
                      group flex items-center ${collapsed ? "justify-center" : "justify-between"}
                      gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-semibold
                      ${isActive
                        ? "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 shadow border-l-4 border-indigo-500"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600"
                      }
                      relative overflow-hidden
                    `}
                    style={{ position: "relative" }}
                  >
                    <div className={`flex items-center ${collapsed ? "" : "gap-3"}`}>
                      <span
                        className={`
                          ${isActive ? "text-indigo-600" : "text-gray-400"}
                          group-hover:text-indigo-600 transition-colors
                          ${isActive ? "scale-110" : ""}
                        `}
                      >
                        {item.icon}
                      </span>
                      {!collapsed && <span>{item.name}</span>}
                    </div>
                    {!collapsed && item.badge && (
                      <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-2 bg-indigo-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                  {/* Hiệu ứng ripple khi click */}
                  <span className="pointer-events-none absolute inset-0 rounded-xl group-active:bg-indigo-100 group-active:opacity-60 transition" />
                </li>
              );
            })}
          </ul>

          {/* Đăng xuất */}
          <div className="mt-6">
            {!collapsed && (
              <p className="text-xs font-bold text-indigo-500 uppercase mb-2 px-2 tracking-wider">
                Tài khoản
              </p>
            )}
            <Link
              to="/logout"
              className={`
                group flex items-center ${collapsed ? "justify-center" : "justify-start"}
                gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors
              `}
            >
              <span className="text-gray-400 group-hover:text-red-600 transition-colors">
                <LogOut size={18} />
              </span>
              {!collapsed && <span>Đăng xuất</span>}
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
