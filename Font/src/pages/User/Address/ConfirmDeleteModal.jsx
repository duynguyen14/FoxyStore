import React from 'react';

function ConfirmDeleteModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-[350px]">
        <h3 className="text-lg font-semibold mb-4">Xác nhận xoá</h3>
        <p className="mb-4">Bạn có chắc chắn muốn xoá địa chỉ này?</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Huỷ</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">Xoá</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
