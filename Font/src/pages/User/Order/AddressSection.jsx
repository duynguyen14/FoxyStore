export default function AddressSection({ addresses, selectedAddress, onSelectOther,setShowAddModal,handleAddAddress }) {
  const hasAddress = addresses && addresses.length > 0;
  // const defaultAddress = hasAddress ? addresses.find(addr => addr.isDefault) || addresses[0] : null;
  // set
  const handleAddAddress1=()=>{
    setShowAddModal(true)
    // handleAddAddress();
  }
  return (
    <div className="text-sm md:text-base">
      {!hasAddress&&!selectedAddress ? (
        <div className="flex justify-between px-5">
          <h2 className="text-lg font-semibold mb-2">Địa chỉ giao hàng</h2>
          <button className="btn-secondary px-4 py-3"
            onClick={()=>handleAddAddress1()}
          >
            Thiết lập địa chỉ
          </button>
        </div>
      ) : (
        <div className="mb-2 rounded-tl-3xl rounded-br-3xl border-[1px] p-6 border-gray-300">
          <h2 className="text-lg font-semibold mb-2">Địa chỉ giao hàng</h2>
          <div className="mb-4 flex items-center justify-between">
            <span className="font-bold">
              {selectedAddress.name || ""} ({selectedAddress.city || "Nhà riêng"})
            </span>
            <button className="btn-secondary px-3 py-2 cursor-pointer" onClick={onSelectOther}>
              Chọn địa chỉ khác
            </button>
          </div>
          <div className="text-gray-700">
            <p className="mb-2">Điện thoại: {selectedAddress.phoneNumber}</p>
            <p>Địa chỉ: {selectedAddress.detailAddress}</p>
          </div>
        </div>
      )}
    </div>
  );
}
