import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, Shield, Bell } from "lucide-react";

// Mock data
const mockEmployees = [
  {
    EmployeeId: 1,
    Name: "Nguyễn Văn D",
    Role: "Quản lý kho",
    Status: "Đang làm",
    OrdersHandled: 120,
    Permissions: ["Xem đơn", "Sửa đơn", "Xem kho"],
  },
  {
    EmployeeId: 2,
    Name: "Trần Thị E",
    Role: "Nhân viên bán hàng",
    Status: "Nghỉ việc",
    OrdersHandled: 80,
    Permissions: ["Xem đơn"],
  },
  {
    EmployeeId: 3,
    Name: "Lê Văn F",
    Role: "Chăm sóc khách hàng",
    Status: "Đang làm",
    OrdersHandled: 150,
    Permissions: ["Xem đơn", "Gửi thông báo"],
  },
];

const allPermissions = [
  "Xem đơn",
  "Sửa đơn",
  "Xem kho",
  "Gửi thông báo",
  "Quản lý nhân viên",
];

function EmployeesManagement() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // add | edit
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form, setForm] = useState({
    Name: "",
    Role: "",
    Status: "Đang làm",
    OrdersHandled: 0,
    Permissions: [],
  });
  const [showNotify, setShowNotify] = useState(false);
  const [notifyContent, setNotifyContent] = useState("");
  const [notifyTarget, setNotifyTarget] = useState(null);
  const [message, setMessage] = useState("");

  // Lọc nhân viên
  const filteredEmployees = employees.filter(
    (e) =>
      e.Name.toLowerCase().includes(search.toLowerCase()) ||
      e.Role.toLowerCase().includes(search.toLowerCase())
  );

  // Mở modal thêm/sửa
  const openModal = (type, emp = null) => {
    setModalType(type);
    setShowModal(true);
    if (type === "edit" && emp) {
      setSelectedEmployee(emp);
      setForm({
        Name: emp.Name,
        Role: emp.Role,
        Status: emp.Status,
        OrdersHandled: emp.OrdersHandled,
        Permissions: emp.Permissions,
      });
    } else {
      setSelectedEmployee(null);
      setForm({
        Name: "",
        Role: "",
        Status: "Đang làm",
        OrdersHandled: 0,
        Permissions: [],
      });
    }
  };

  // Đóng modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setForm({
      Name: "",
      Role: "",
      Status: "Đang làm",
      OrdersHandled: 0,
      Permissions: [],
    });
  };

  // Thêm/sửa nhân viên
  const handleSubmit = (e) => {
    e.preventDefault();
    const newEmp = {
      EmployeeId:
        modalType === "add"
          ? employees.length
            ? Math.max(...employees.map((e) => e.EmployeeId)) + 1
            : 1
          : selectedEmployee.EmployeeId,
      Name: form.Name,
      Role: form.Role,
      Status: form.Status,
      OrdersHandled: Number(form.OrdersHandled),
      Permissions: form.Permissions,
    };
    if (modalType === "add") {
      setEmployees([newEmp, ...employees]);
    } else {
      setEmployees(
        employees.map((e) =>
          e.EmployeeId === selectedEmployee.EmployeeId ? newEmp : e
        )
      );
    }
    closeModal();
  };

  // Xóa nhân viên
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      setEmployees(employees.filter((e) => e.EmployeeId !== id));
    }
  };

  // Toggle quyền
  const handleTogglePermission = (perm) => {
    setForm((prev) => ({
      ...prev,
      Permissions: prev.Permissions.includes(perm)
        ? prev.Permissions.filter((p) => p !== perm)
        : [...prev.Permissions, perm],
    }));
  };

  // Gửi thông báo nội bộ
  const handleSendNotify = (e) => {
    e.preventDefault();
    setMessage(
      `Đã gửi thông báo cho ${
        notifyTarget ? notifyTarget.Name : "tất cả nhân viên"
      }!`
    );
    setShowNotify(false);
    setNotifyContent("");
    setNotifyTarget(null);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Quản lý nhân viên</h2>
        <div className="flex gap-2">
          <button
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => openModal("add")}
          >
            <Plus size={18} className="mr-2" /> Thêm nhân viên
          </button>
          <button
            className="flex items-center bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
            onClick={() => {
              setShowNotify(true);
              setNotifyTarget(null);
            }}
          >
            <Bell size={18} className="mr-2" /> Gửi thông báo
          </button>
        </div>
      </div>
      {message && (
        <div className="mb-4 px-4 py-2 rounded bg-green-50 text-green-700 border border-green-200 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="ml-2 text-green-700 hover:text-green-900">
            <X size={16} />
          </button>
        </div>
      )}
      <div className="flex items-center mb-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm tên hoặc chức vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
          />
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-indigo-50 text-indigo-700">
            <tr>
              <th className="p-3 font-semibold">Tên nhân viên</th>
              <th className="p-3 font-semibold">Chức vụ</th>
              <th className="p-3 font-semibold">Trạng thái</th>
              <th className="p-3 font-semibold">Đơn hàng xử lý</th>
              <th className="p-3 font-semibold">Quyền</th>
              <th className="p-3 text-center font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.EmployeeId} className="border-t hover:bg-indigo-50 transition">
                <td className="p-3">{emp.Name}</td>
                <td className="p-3">{emp.Role}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${emp.Status === "Đang làm"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}>
                    {emp.Status}
                  </span>
                </td>
                <td className="p-3">{emp.OrdersHandled}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {emp.Permissions.map((perm, idx) => (
                      <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                        <Shield size={12} className="inline mr-1" />{perm}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3 flex justify-center space-x-2">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                    title="Sửa"
                    onClick={() => openModal("edit", emp)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                    title="Xóa"
                    onClick={() => handleDelete(emp.EmployeeId)}
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    className="text-yellow-500 hover:text-yellow-700 p-2 rounded-full hover:bg-yellow-100 transition"
                    title="Gửi thông báo"
                    onClick={() => {
                      setShowNotify(true);
                      setNotifyTarget(emp);
                    }}
                  >
                    <Bell size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Không tìm thấy nhân viên.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal Thêm/Sửa nhân viên */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-[2px] transition-all">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              onClick={closeModal}
              aria-label="Đóng"
            >
              <X size={22} />
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              {modalType === "add" ? <Plus size={22} /> : <Pencil size={20} />}
              {modalType === "add" ? "Thêm nhân viên" : "Chỉnh sửa nhân viên"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên nhân viên</label>
                  <input
                    type="text"
                    required
                    value={form.Name}
                    onChange={e => setForm(f => ({ ...f, Name: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Chức vụ</label>
                  <input
                    type="text"
                    required
                    value={form.Role}
                    onChange={e => setForm(f => ({ ...f, Role: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Trạng thái</label>
                  <select
                    value={form.Status}
                    onChange={e => setForm(f => ({ ...f, Status: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                  >
                    <option value="Đang làm">Đang làm</option>
                    <option value="Nghỉ việc">Nghỉ việc</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Đơn hàng xử lý</label>
                  <input
                    type="number"
                    min={0}
                    value={form.OrdersHandled}
                    onChange={e => setForm(f => ({ ...f, OrdersHandled: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phân quyền</label>
                <div className="flex flex-wrap gap-2">
                  {allPermissions.map((perm) => (
                    <label key={perm} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.Permissions.includes(perm)}
                        onChange={() => handleTogglePermission(perm)}
                        className="accent-indigo-600"
                      />
                      <span className="text-sm">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  onClick={closeModal}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold"
                >
                  {modalType === "add" ? "Thêm" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal gửi thông báo */}
      {showNotify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-[2px] transition-all">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              onClick={() => setShowNotify(false)}
              aria-label="Đóng"
            >
              <X size={22} />
            </button>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bell size={22} /> Gửi thông báo nội bộ
            </h3>
            <form onSubmit={handleSendNotify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Gửi tới:{" "}
                  <span className="font-semibold text-indigo-700">
                    {notifyTarget ? notifyTarget.Name : "Tất cả nhân viên"}
                  </span>
                </label>
              </div>
              <div>
                <textarea
                  value={notifyContent}
                  onChange={e => setNotifyContent(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                  rows={3}
                  required
                  placeholder="Nhập nội dung thông báo..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  onClick={() => setShowNotify(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500 transition font-semibold"
                >
                  Gửi thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesManagement;
