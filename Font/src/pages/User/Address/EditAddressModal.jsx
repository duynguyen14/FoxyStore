import React, { useState } from "react";
import { X } from "lucide-react";

const EditAddressModal = ({ address, onClose, onChange, onSave }) => {
  const [addressType, setAddressType] = useState(address?.type || "Nhà Riêng");

  if (!address) return null;

  const handleChange = (field, value) => {
    onChange({ ...address, [field]: value, type: addressType });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-secondary opacity-70"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-medium mb-6">Cập nhật địa chỉ</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Họ và tên"
              className="border border-gray-300 rounded p-2"
              value={address.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="border border-gray-300 rounded p-2"
              value={address.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
            />
          </div>

          <select
            className="border border-gray-300 rounded p-2 w-full"
            value={address.city}
            onChange={(e) => handleChange("city", e.target.value)}
          >
            <option value="" disabled>Chọn tỉnh/thành</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Hồ Chí Minh">Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Hải Phòng">Hải Phòng</option>
            <option value="Hà Nam">Hà Nam</option>
          </select>

          <input
            type="text"
            placeholder="Địa chỉ cụ thể"
            className="border border-gray-300 rounded p-2 w-full"
            value={address.detailAddress}
            onChange={(e) => handleChange("detailAddress", e.target.value)}
          />

          <div>
            <p className="font-medium mb-2">Loại địa chỉ:</p>
            <div className="flex space-x-4">
              {["Nhà Riêng", "Văn Phòng"].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setAddressType(type);
                    handleChange("type", type);
                  }}
                  className={`px-4 py-2 rounded border ${
                    addressType === type
                      ? "border-red-500 text-red-500"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={address.isDefault}
              onChange={(e) => handleChange("isDefault", e.target.checked)}
            />
            <span>Đặt làm địa chỉ mặc định</span>
          </label>

          <button
            onClick={onSave}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-4"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAddressModal;
