import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { request } from "../../../untils/request";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form, setForm] = useState({ Name: "", CatalogId: "" });
  const [catalogs, setCatalogs] = useState([]);

  const token = localStorage.getItem("token");

  // Lấy danh sách thể loại
  const fetchCategories = async () => {
    try {
      const res = await request.get("/category/detail", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = res.data;
      if (data.code === 1000 && Array.isArray(data.result)) {
        setCategories(
          data.result.map((item, idx) => ({
            CategoryId: item.categoryId,
            Name: item.categoryName,
            CatalogName: item.catalogName,
            CatalogId: item.catalogId,
            TotalProducts: item.totalProducts,
          }))
        );
      }
    } catch (err) {
      
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const res = await request.get("/catalog/active", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = res.data;
        if (data.code === 1000 && Array.isArray(data.result)) {
          setCatalogs(
            data.result.map((item) => ({
              CatalogId: item.catalogId,
              Name: item.name,
            }))
          );
        }
      } catch (err) {
      }
    };
    fetchCatalogs();
  }, []);

  // Mở modal Thêm/Sửa
  const openModal = (type, category = null) => {
    setModalType(type);
    setShowModal(true);
    if (type === "edit" && category) {
      setSelectedCategory(category);
      setForm({
        Name: category.Name,
        CatalogId: category.CatalogId,
      });
    } else {
      setSelectedCategory(null);
      setForm({ Name: "", CatalogId: "" });
    }
  };

  // Đóng modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setForm({ Name: "", CatalogId: "" });
  };

  // Thêm/Sửa thể loại
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalType === "add") {
      // Gọi API tạo mới
      try {
        await request.post("/category/create", {
          name: form.Name,
          catalogId: Number(form.CatalogId),
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await fetchCategories();
        alert("Thêm thể loại thành công!");
      } catch (err) {
        alert("Thêm thể loại thất bại!");
      }
    } else if (modalType === "edit" && selectedCategory) {
      // Gọi API cập nhật
      try {
        await request.put(
          `/category/update/${selectedCategory.CategoryId}`,
          {
            name: form.Name,
            catalogId: Number(form.CatalogId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        await fetchCategories();
        alert("Cập nhật thể loại thành công!");
      } catch (err) {
        alert("Cập nhật thể loại thất bại!");
      }
    }
    closeModal();
  };

  // Xóa thể loại
  const handleDelete = async (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thể loại này?")) {
      try {
        await request.delete(
          `/category/delete/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        await fetchCategories();
        alert("Xóa thể loại thành công!");
      } catch (err) {
        alert("Xóa thể loại thất bại!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-0">
      <div className="w-11/12 mx-auto max-w-full mx-auto">
        <div className="flex items-center mb-8 px-4">
          <button
            className="ml-4 flex items-center bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:scale-105 transition-all font-semibold"
            onClick={() => openModal("add")}
          >
            <Plus size={20} className="mr-2" /> Thêm thể loại
          </button>
        </div>
        <div className="flex flex-col gap-6 w-full px-0">
          {categories.map((category) => {
            return (
              <div
                key={category.CategoryId}
                className="w-full bg-white shadow-xl rounded-2xl px-8 py-6 flex items-center justify-between mx-0"
              >
                <div>
                  <span className="font-bold text-lg text-indigo-700">
                    {category.Name}
                  </span>
                  <span className="ml-3 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">
                    Danh mục: {category.CatalogName || "Không xác định"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {category.TotalProducts} sản phẩm
                  </span>
                  <button
                    className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition"
                    title="Sửa thể loại"
                    onClick={() => openModal("edit", category)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition"
                    title="Xóa thể loại"
                    onClick={() => handleDelete(category.CategoryId)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {/* Modal Thêm/Sửa thể loại */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center transition-all">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                onClick={closeModal}
                aria-label="Đóng"
              >
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
                {modalType === "add" ? <Plus size={22} /> : <Pencil size={20} />}
                {modalType === "add" ? "Thêm thể loại" : "Chỉnh sửa thể loại"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-base font-medium mb-1 text-indigo-700">
                    Tên thể loại
                  </label>
                  <input
                    type="text"
                    required
                    value={form.Name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Name: e.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium mb-1 text-indigo-700">
                    Thuộc danh mục
                  </label>
                  <select
                    required
                    value={form.CatalogId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, CatalogId: e.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
                  >
                    <option value="">Chọn danh mục</option>
                    {catalogs.map((c) => (
                      <option key={c.CatalogId} value={c.CatalogId}>
                        {c.Name}
                      </option>
                    ))}
                  </select>
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
    </div>
  );
}

export default CategoryManagement;
