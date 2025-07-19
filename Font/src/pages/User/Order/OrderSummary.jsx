export default function OrderSummary({total}) {
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + "đ";
  };
  return (
    <div className="bg-gray-50 p-4 rounded  text-sm md:text-base">
      <h2 className="text-lg font-semibold mb-2">Tóm tắt đơn hàng</h2>
      <div className="text-sm space-y-5">
        <div className="flex justify-between"><span>Tổng tiền hàng</span><span>{formatPrice(total())}</span></div>
        <div className="flex justify-between"><span>Tạm tính</span><span>{formatPrice(total())}</span></div>
        <div className="flex justify-between"><span>Phí vận chuyển</span><span>0₫</span></div>
        <div className="flex justify-between font-bold text-black"><span>Tiền thanh toán</span><span>{formatPrice(total())}</span></div>
      </div>

    </div>
  );
}
