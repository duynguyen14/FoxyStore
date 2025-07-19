import React from 'react';

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN') + "đ";
};

function ListProduct({ products }) {
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">Giỏ hàng trống</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Giỏ hàng của bạn</h2>

      {/* Header chỉ hiện ở md trở lên */}
      <div className="hidden md:grid grid-cols-4 font-semibold text-gray-500 border-b border-gray-200 pb-3">
        <div className="col-span-2">TÊN SẢN PHẨM</div>
        <div className="text-center">SỐ LƯỢNG</div>
        <div className="text-right">TỔNG TIỀN</div>
      </div>

      {products.map((product, index) => (
        <div key={index} className="border-b border-gray-200 py-4">
          <div className="flex flex-col md:grid md:grid-cols-4 md:items-center gap-4">
            <div className="flex md:col-span-2">
              <div className="w-30 md:w-36 flex-shrink-0">
                <img
                  src={`http://localhost:8080/images/${product.images[0]}.png`}
                  alt={product.productName}
                  className="w-full h-auto object-cover rounded"
                />
              </div>
              <div className="ml-4 flex flex-col md:block">
                <p className="font-medium text-base md:text-base ">{product.productName}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Màu sắc: {product.colorName} &nbsp;|&nbsp; Size: {product.sizeName}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-center mt-2 md:mt-0">
              <p className="block md:hidden">Số lượng</p>
              <input
                type="number"
                value={product.quantity}
                readOnly
                className="w-16 text-center border rounded px-2 py-1"
              />
            </div>

            <div className="flex items-center justify-between md:justify-end mt-2 md:mt-0">
              <p className="block md:hidden">Thành tiền</p>
              <span className="font-semibold text-base md:text-lg">
                {formatPrice(product.price * product.quantity)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListProduct;
