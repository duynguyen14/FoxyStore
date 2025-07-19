import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { request } from "../../../untils/request";

const mockProducts = [
  { ProductId: 1, Name: "Áo sơ mi trắng" },
  { ProductId: 2, Name: "Quần jean xanh" },
  { ProductId: 3, Name: "Giày thể thao" },
];

function SaleManagement() {
  const [sales, setSales] = useState([]);
  const [products] = useState(mockProducts);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedSale, setSelectedSale] = useState(null);
  const [form, setForm] = useState({
    name: "",
    start: "",
    end: "",
    discountPercent: "",
    products: [],
    categories: [],
  });

  // Lấy token từ localStorage (hoặc nơi bạn lưu)
  const token = localStorage.getItem("token");

  const fetchSales = () => {
    request.get("sale/getAll", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data && res.data.code === 1000 && Array.isArray(res.data.result)) {
          setSales(
            res.data.result.map(item => ({
              id: item.id,
              name: item.name,
              start: item.start,
              end: item.end,
              discountPercent: item.discountPercent,
              products: item.products || [],
              categories: item.categories || [],
              totalAppliedProducts: item.totalAppliedProducts ?? (item.products ? item.products.length : 0),
            }))
          );
          console.log(res.data)
        } else {
          setSales([]);
        }
      })
      .catch(() => setSales([]));
  };

  // Fetch sales khi mount
  useEffect(() => {
    fetchSales();
  }, []);

  // Fetch categories từ API khi component mount
  useEffect(() => {
    request.get("category/getAll", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.data && res.data.code === 1000 && Array.isArray(res.data.result)) {
          setCategories(
            res.data.result.map(item => ({
              CategoryId: item.categoryId,
              Name: item.categoryName
            }))
          );
        } else {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]));
  }, []);

  // Mở modal
  const openModal = (type, sale = null) => {
    setModalType(type);
    setShowModal(true);
    if (type === "edit" && sale) {
      setSelectedSale(sale);
      setForm({
        name: sale.name,
        start: sale.start.slice(0, 16),
        end: sale.end.slice(0, 16),
        discountPercent: sale.discountPercent,
        products: sale.products || [],
        categories: sale.categories || [],
      });
    } else {
      setSelectedSale(null);
      setForm({
        name: "",
        start: "",
        end: "",
        discountPercent: "",
        products: [],
        categories: [],
      });
    }
  };

  // Đóng modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedSale(null);
    setForm({
      name: "",
      start: "",
      end: "",
      discountPercent: "",
      products: [],
      categories: [],
    });
  };

  // Thêm/sửa sale
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      start: form.start,
      end: form.end,
      discountPercent: Number(form.discountPercent),
      categoryIds: form.categories,
    };
    try {
      if (modalType === "add") {
        await request.post("sale/create", payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert("Thêm đợt giảm giá thành công!");
      } else if (selectedSale) {
        await request.put(`sale/update/${selectedSale.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert("Cập nhật đợt giảm giá thành công!");
      }
      fetchSales();
      closeModal();
    } catch (err) {
      alert("Có lỗi xảy ra!");
    }
  };

  // Xóa sale
  const handleDelete = async (saleId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đợt giảm giá này?")) {
      try {
        await request.delete(`sale/delete/${saleId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert("Xóa đợt giảm giá thành công!");
        fetchSales();
      } catch (err) {
        alert("Có lỗi xảy ra khi xóa!");
      }
    }
  };

  // Toggle chọn sản phẩm (giữ lại logic cũ nếu cần)
  const handleToggleProduct = (id) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(id)
        ? prev.products.filter((x) => x !== id)
        : [...prev.products, id],
    }));
  };

  // Toggle chọn thể loại
  const handleToggleCategory = (id) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(Number(id))
        ? prev.categories.filter((x) => x !== Number(id))
        : [...prev.categories, Number(id)],
    }));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Quản lý đợt giảm giá</h2>
        <button
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          onClick={() => openModal("add")}
        >
          <Plus size={18} className="mr-2" /> Thêm đợt giảm giá
        </button>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-indigo-50 text-indigo-700">
            <tr>
              <th className="p-3 font-semibold">Tên đợt giảm giá</th>
              <th className="p-3 font-semibold">Ngày bắt đầu</th>
              <th className="p-3 font-semibold">Ngày kết thúc</th>
              <th className="p-3 font-semibold">% giảm</th>
              <th className="p-3 font-semibold">Áp dụng</th>
              <th className="p-3 font-semibold">Tổng số sản phẩm</th>
              <th className="p-3 text-center font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-t hover:bg-indigo-50 transition">
                <td className="p-3">{sale.name}</td>
                <td className="p-3">{sale.start.replace("T", " ").slice(0, 16)}</td>
                <td className="p-3">{sale.end.replace("T", " ").slice(0, 16)}</td>
                <td className="p-3">{sale.discountPercent}%</td>
                <td className="p-3">
                  {sale.categories && sale.categories.length > 0 && (
                    <span>
                      Thể loại:{" "}
                      {sale.categories
                        .map(
                          (id) =>
                            categories.find((c) => c.CategoryId === Number(id))?.Name
                        )
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  )}
                  {(!sale.categories || sale.categories.length === 0) &&
                    (!sale.products || sale.products.length === 0) && (
                      <span className="text-gray-400">Chưa được áp dụng</span>
                    )}
                </td>
                <td className="p-3">
                  {typeof sale.totalAppliedProducts === "number"
                    ? sale.totalAppliedProducts
                    : (sale.products && Array.isArray(sale.products)
                        ? sale.products.length
                        : 0)}
                </td>
                <td className="p-3 flex justify-center space-x-2">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                    title="Sửa"
                    onClick={() => openModal("edit", sale)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                    title="Xóa"
                    onClick={() => handleDelete(sale.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  Không tìm thấy đợt giảm giá.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal Thêm/Sửa đợt giảm giá */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-all">
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
              {modalType === "add" ? "Thêm đợt giảm giá" : "Chỉnh sửa đợt giảm giá"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên đợt giảm giá</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phần trăm giảm (%)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={form.discountPercent}
                    onChange={e => setForm(f => ({ ...f, discountPercent: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.start}
                    onChange={e => setForm(f => ({ ...f, start: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.end}
                    onChange={e => setForm(f => ({ ...f, end: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Áp dụng cho thể loại</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <label key={cat.CategoryId} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.categories.includes(cat.CategoryId)}
                        onChange={() => handleToggleCategory(cat.CategoryId)}
                        className="accent-indigo-600"
                      />
                      <span className="text-sm">{cat.Name}</span>
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
    </div>
  );
}

export default SaleManagement;
