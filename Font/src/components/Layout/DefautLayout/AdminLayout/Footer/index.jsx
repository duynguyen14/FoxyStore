import React from "react";
import { Home, Mail, MessageSquare, Users, Settings } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-indigo-50 to-purple-100 border-t border-indigo-100 shadow-inner pt-6 pb-2">
      {/* Footer trên */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo và thông tin */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-200 to-purple-200 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xl shadow-md border-2 border-purple-200">
              🦊
            </div>
            <h3 className="text-indigo-800 font-bold text-xl tracking-wide drop-shadow">Foxy Admin</h3>
          </div>
          {/* Menu footer */}
          <div className="flex items-center space-x-6">
            <a href="/admin" className="text-gray-600 hover:text-indigo-700 text-sm flex items-center gap-1.5 font-medium transition">
              <Home size={18} />
              <span>Trang chủ</span>
            </a>
            <a href="/admin/users" className="text-gray-600 hover:text-indigo-700 text-sm flex items-center gap-1.5 font-medium transition">
              <Users size={18} />
              <span>Người dùng</span>
            </a>
            <a href="/admin/messages" className="text-gray-600 hover:text-indigo-700 text-sm flex items-center gap-1.5 font-medium transition">
              <MessageSquare size={18} />
              <span>Tin nhắn</span>
            </a>
            <a href="/settings" className="text-gray-600 hover:text-indigo-700 text-sm flex items-center gap-1.5 font-medium transition">
              <Settings size={18} />
              <span>Cài đặt</span>
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-indigo-100" />

      {/* Footer dưới */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-gray-500 text-sm flex items-center gap-2">
          <span className="font-bold text-indigo-600">© {currentYear} FoxyStore Admin</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">All rights reserved.</span>
        </p>
        <div className="flex items-center space-x-4">
          <a href="/terms" className="text-xs text-indigo-600 hover:underline hover:text-purple-600 font-semibold transition">Điều khoản</a>
          <a href="/privacy" className="text-xs text-indigo-600 hover:underline hover:text-purple-600 font-semibold transition">Chính sách</a>
          <a href="/cookies" className="text-xs text-indigo-600 hover:underline hover:text-purple-600 font-semibold transition">Cookies</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;