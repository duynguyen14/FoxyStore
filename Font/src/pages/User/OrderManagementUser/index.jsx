import React, { useEffect, useState } from "react";
import { Filter, CheckCircle, Truck, Clock, XCircle, Search } from "lucide-react";
import { request } from "../../../untils/request";
import { Link } from "react-router-dom";
const OrderManagementUser = () => {
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await request.get("bill/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.result || [];
        setOrders(data);
        setFilteredOrders(data);
      } catch (e) {
        console.log("error ", e);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const result = orders
      .filter((order) => {
        if (statusFilter === "Tất cả") return true;
        return order.status === statusFilter;
      })
      .filter((order) => {
        if (searchTerm.trim() === "") return true;
        const lowerSearch = searchTerm.toLowerCase();
        return (
          String(order.id).toLowerCase().includes(lowerSearch)
        );
      });

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Đang giao":
        return <Truck className="w-4 h-4 text-blue-500" />;
      case "Đã giao":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Đã huỷ":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-yellow-100 text-yellow-800";
      case "Đang giao":
        return "bg-blue-100 text-blue-800";
      case "Đã giao":
        return "bg-green-100 text-green-800";
      case "Đã huỷ":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-lg">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">QUẢN LÝ ĐƠN HÀNG</h1>

      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        {/* Tìm kiếm */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mã sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Bộ lọc trạng thái */}
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <label className="mr-2 text-gray-700 font-medium whitespace-nowrap">Trạng thái:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Đã giao">Đã hoàn thành</option>
            <option value="Đã huỷ">Đã huỷ</option>
          </select>
        </div>
      </div>

      {/* Bảng desktop */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 text-center">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Mã đơn hàng</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-blue-600 font-medium">{order.id}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {order.time && order.time.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 text-right font-medium">
                    {order.total.toLocaleString("vi-VN")}₫
                  </td>
                  <td className="px-6 py-4 text-sm  truncate max-w-sm">
                    <Link className="p-3 bg-blue-500 text-white rounded-md"
                      to={`/order/${order.id}`}
                    >
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Không tìm thấy đơn hàng nào</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-blue-600">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.time && order.time.slice(0, 10)}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  <span className="ml-1">{order.status}</span>
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-2 truncate">{order.products}</div>
              <div className="text-center font-medium text-sm text-gray-700">
                {order.total.toLocaleString("vi-VN")}₫
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManagementUser;
