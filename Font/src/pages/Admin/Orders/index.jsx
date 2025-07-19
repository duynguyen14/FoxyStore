import React, { useState, useEffect } from "react";
import {
  Eye,
  Printer,
  ChevronUp,
  Check,
  X,
  Truck,
  FileText,
} from "lucide-react";

function formatPrice(price) {
  return price?.toLocaleString("vi-VN") + " đ";
}

const STATUS_LIST = [
  "Chờ xác nhận",
  "Đã xác nhận",
  "Đang giao",
  "Đã giao",
  "Đã hủy",
];

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [message, setMessage] = useState("");
  const [searchId, setSearchId] = useState("");
  const [statusPickerForOrderId, setStatusPickerForOrderId] = useState(null);
  const token =localStorage.getItem("token");
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:8080/api/v1/bill/admin",{
      method:"GET",
      headers:{
         "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((bill) => ({
          BillId: bill.billId,
          UserName: bill.userName,
          Status: bill.status,
          Time: new Date(bill.time).toLocaleString("vi-VN"),
          Products: bill.billDetails.map((d) => ({
            Name: d.productName,
            Quantity: d.quantity,
            Price: d.price || 0,
          })),
          Address: bill.address,
          Total: bill.billDetails.reduce(
            (sum, d) => sum + (d.price || 0) * d.quantity,
            0
          ),
        }));
        setOrders(mapped);
      })
      .catch(() => setMessage("Lỗi tải danh sách đơn hàng"));
  }, []);

  const toggleExpand = (billId) => {
    setExpanded(expanded === billId ? null : billId);
  };

  const openStatusPicker = (billId) => {
    setStatusPickerForOrderId(
      statusPickerForOrderId === billId ? null : billId
    );
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((o) =>
        o.BillId === orderId ? { ...o, Status: newStatus } : o
      )
    );
    setMessage(`Đã cập nhật trạng thái đơn #${orderId} sang "${newStatus}"`);
    setStatusPickerForOrderId(null);

    fetch(
      `http://localhost:8080/api/v1/bill/admin/${orderId}/status?status=${encodeURIComponent(
        newStatus
      )}`,
      {
        method: "PUT",
        headers:{
           "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
      },
      
    ).catch(() => setMessage("Lỗi khi cập nhật trạng thái đơn hàng"));
  };

  const handlePrint = (order) => {
    window.print();
    setMessage(`Đã gửi lệnh in hóa đơn cho đơn #${order.BillId}`);
  };

  const handleCancelOrder = (order) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy đơn #${order.BillId}?`)) {
      updateOrderStatus(order.BillId, "Đã hủy");
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.BillId.toString().includes(searchId.trim())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
            <Truck size={28} className="text-indigo-500" /> Quản lý đơn hàng
          </h2>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Tìm theo mã đơn..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {message && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center justify-between text-base shadow">
            <span>{message}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMessage("");
              }}
              className="ml-2 text-green-700 hover:text-green-900"
              aria-label="Close message"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="overflow-x-auto bg-white shadow-2xl rounded-2xl">
          <table className="min-w-full text-base text-left">
            <thead className="bg-indigo-100 text-indigo-700">
              <tr>
                <th className="p-4 font-semibold">Mã đơn</th>
                <th className="p-4 font-semibold">Khách hàng</th>
                <th className="p-4 font-semibold">Trạng thái</th>
                <th className="p-4 font-semibold">Ngày đặt</th>
                <th className="p-4 font-semibold">Tổng tiền</th>
                <th className="p-4 text-center font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-gray-500">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              )}
              {paginatedOrders.map((order) => (
                <React.Fragment key={order.BillId}>
                  <tr
                    className="border-t hover:bg-indigo-50 transition cursor-pointer"
                    onClick={() => toggleExpand(order.BillId)}
                  >
                    <td className="p-4 font-semibold text-indigo-700">
                      #{order.BillId}
                    </td>
                    <td className="p-4">{order.UserName}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow
                        ${
                          order.Status === "Đã giao"
                            ? "bg-green-100 text-green-700"
                            : order.Status === "Đang giao" ||
                              order.Status === "Đã xác nhận"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.Status === "Đã hủy"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.Status}
                      </span>
                    </td>
                    <td className="p-4">{order.Time}</td>
                    <td className="p-4 font-semibold">
                      {formatPrice(order.Total)}
                    </td>
                    <td className="p-4 flex justify-center space-x-2 relative">
                      {/* <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleExpand(order.BillId);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                        title="Xem chi tiết"
                      >
                        {expanded === order.BillId ? (
                          <ChevronUp size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button> */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePrint(order);
                        }}
                        className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition"
                        title="In hóa đơn"
                      >
                        <FileText size={20} />
                      </button>
                      {order.Status !== "Đã giao" &&
                        order.Status !== "Đã hủy" && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openStatusPicker(order.BillId);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition"
                              title="Chọn trạng thái"
                            >
                              <Check size={20} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCancelOrder(order);
                              }}
                              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                              title="Hủy đơn hàng"
                            >
                              <X size={20} />
                            </button>
                          </>
                        )}
                      {statusPickerForOrderId === order.BillId && (
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="absolute top-full right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-50"
                        >
                          {STATUS_LIST.map((status) => (
                            <div
                              key={status}
                              onClick={() =>
                                updateOrderStatus(order.BillId, status)
                              }
                              className={`cursor-pointer px-4 py-2 hover:bg-indigo-100 ${
                                status === order.Status
                                  ? "font-bold bg-indigo-200"
                                  : ""
                              }`}
                            >
                              {status}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>

                  {expanded === order.BillId && (
                    <tr>
                      <td colSpan={6} className="bg-indigo-50 p-6">
                        <div className="mb-2 font-semibold text-indigo-700 text-lg">
                          Sản phẩm trong đơn
                        </div>
                        <table className="min-w-full text-sm mb-2 bg-white rounded-xl shadow">
                          <thead>
                            <tr>
                              <th className="p-2">Tên sản phẩm</th>
                              <th className="p-2">Số lượng</th>
                              <th className="p-2">Đơn giá</th>
                              <th className="p-2">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.Products.map((prod, idx) => (
                              <tr key={idx}>
                                <td className="p-2">{prod.Name}</td>
                                <td className="p-2">{prod.Quantity}</td>
                                <td className="p-2">
                                  {formatPrice(prod.Price)}
                                </td>
                                <td className="p-2">
                                  {formatPrice(prod.Price * prod.Quantity)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">
                              Địa chỉ giao hàng:
                            </span>{" "}
                            {order.Address}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Tổng tiền:</span>{" "}
                            {formatPrice(order.Total)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Pagination UI */}
          <div className="flex justify-center items-center gap-2 mt-6 mb-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-white border rounded shadow disabled:opacity-50"
            >
              &laquo;
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded shadow ${
                  page === currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-indigo-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-white border rounded shadow disabled:opacity-50"
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;
