import React, { useState, useEffect } from 'react';

function AddressModal({ onClose, onSave, data }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [detail, setDetail] = useState('');

  useEffect(() => {
    if (data) {
      setName(data.name);
      setPhone(data.phone);
      setCity(data.city);
      setDetail(data.detail);
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: data?.id, name, phone, city, detail });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h3 className="text-lg font-semibold mb-4">{data ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Tên người nhận" value={name} onChange={e => setName(e.target.value)} required className="w-full border p-2 rounded"/>
          <input type="text" placeholder="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full border p-2 rounded"/>
          <input type="text" placeholder="Thành phố" value={city} onChange={e => setCity(e.target.value)} required className="w-full border p-2 rounded"/>
          <input type="text" placeholder="Địa chỉ chi tiết" value={detail} onChange={e => setDetail(e.target.value)} required className="w-full border p-2 rounded"/>
          <div className="flex justify-end space-x-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Huỷ</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddressModal;
