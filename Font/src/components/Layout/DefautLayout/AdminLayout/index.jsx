import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Kiểm tra kích thước màn hình khi tải trang và thay đổi kích thước cửa sổ
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };
    
    // Khởi tạo
    checkScreenSize();
    
    // Thêm sự kiện thay đổi kích thước
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [sidebarCollapsed]);

  // Xử lý toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="font-Montserrat min-h-screen font-sans flex bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 min-h-screen flex flex-col flex-1 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
      }`}>
        <Header onToggleSidebar={toggleSidebar} />
        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default AdminLayout;