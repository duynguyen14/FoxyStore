import React, { useState } from "react";
import { Check, X, FileText } from "lucide-react";

// Mock data
const mockPayments = [
  {
    PaymentId: 1,
    UserName: "Nguyễn Văn A",
    Amount: 1200000,
    Status: "Đã thanh toán", // Đã thanh toán | Chờ xác nhận | Thất bại
    Method: "VNPay",
    Time: "2024-06-01 09:30",
    TransactionCode: "VNP123456",
  },
  {
    PaymentId: 2,
    UserName: "Trần Thị B",
    Amount: 500000,
    Status: "Chờ xác nhận",
    Method: "Momo",
    Time: "2024-06-02 14:10",
    TransactionCode: "MOMO78910",
  },
];

function formatPrice(price) {
  return price.toLocaleString("vi-VN") + " đ";
}

function PaymentManagement() {
  const [payments, setPayments] = useState(mockPayments);
  const [message, setMessage] = useState("");

  // Kiểm tra trạng thái (demo: xác nhận thanh toán)
  const handleConfirm = (paymentId) => {
    setPayments(payments.map(p =>
      p.PaymentId === paymentId
        ? { ...p, Status: "Đã thanh toán" }
        : p
    ));
    setMessage(`Đã xác nhận thanh toán cho giao dịch #${paymentId}`);
  };

  // Xuất báo cáo (demo)
  const handleExport = () => {
    setMessage("Đã xuất báo cáo thanh toán (demo)");
    // TODO: Thực tế sẽ xuất file Excel/PDF
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Quản lý thanh toán</h2>
        <button
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          onClick={handleExport}
        >
          <FileText size={18} className="mr-2" /> Xuất báo cáo
        </button>
      </div>
      {message && (
        <div className="mb-4 px-4 py-2 rounded bg-green-50 text-green-700 border border-green-200 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="ml-2 text-green-700 hover:text-green-900">
            <X size={16} />
          </button>
        </div>
      )}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-indigo-50 text-indigo-700">
            <tr>
              <th className="p-3 font-semibold">Mã giao dịch</th>
              <th className="p-3 font-semibold">Người thanh toán</th>
              <th className="p-3 font-semibold">Số tiền</th>
              <th className="p-3 font-semibold">Phương thức</th>
              <th className="p-3 font-semibold">Thời gian</th>
              <th className="p-3 font-semibold">Trạng thái</th>
              <th className="p-3 text-center font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.PaymentId} className="border-t hover:bg-indigo-50 transition">
                <td className="p-3 font-semibold">{payment.TransactionCode}</td>
                <td className="p-3">{payment.UserName}</td>
                <td className="p-3">{formatPrice(payment.Amount)}</td>
                <td className="p-3">{payment.Method}</td>
                <td className="p-3">{payment.Time}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${payment.Status === "Đã thanh toán"
                      ? "bg-green-100 text-green-700"
                      : payment.Status === "Chờ xác nhận"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }`}>
                    {payment.Status}
                  </span>
                </td>
                <td className="p-3 flex justify-center space-x-2">
                  {payment.Status === "Chờ xác nhận" && (
                    <button
                      className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-100 transition"
                      title="Xác nhận thanh toán"
                      onClick={() => handleConfirm(payment.PaymentId)}
                    >
                      <Check size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  Không có giao dịch nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentManagement;
