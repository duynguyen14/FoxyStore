import React from "react";
import { useNavigate } from "react-router-dom";

function CartSummary({ products,handleOnclickOrder }) {
  const total = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const navigate =useNavigate()
  return (
    <div className=" h-full w-[100%] lg:max-w-[400px] md:w-full p-6 rounded-2xl bg-primary  transition-all duration-300 mx-auto mb-10">
      <h3 className="font-medium text-xl mb-5 text-gray-800">Tổng tiền giỏ hàng</h3>
      <ul className="text-sm mb-5 space-y-2 text-gray-700">
        <li className="flex justify-between pb-3">
          <span>Tổng sản phẩm</span>
          <span className="font-medium">{products.length}</span>
        </li>
        <li className="flex justify-between  pb-3">
          <span>Tổng tiền hàng</span>
          <span className="font-semibold text-gray-700 text-base">
            {total.toLocaleString("vi-VN")}đ
          </span>
        </li>
        <li className="flex justify-between font-medium  pb-3 ">
          <span className="text-gray-500">Thành tiền</span>
          <span className="text-base font-semibold">{total.toLocaleString("vi-VN")}đ</span>
        </li>
        <li className="flex justify-between font-medium  pb-1 ">
          <span className="text-gray-500">Tạm tính</span>
          <span className="text-base font-semibold">{total.toLocaleString("vi-VN")}đ</span>
        </li>
      </ul>

      <p className="text-red-600 text-xs mb-4 italic">
        ⚠️ Các sản phẩm giảm giá trên 50% không hỗ trợ đổi trả.
      </p>

      <button className="w-full py-3 btn-secondary "onClick={()=>handleOnclickOrder()}>
        ĐẶT HÀNG NGAY
      </button>
    </div>
  );
}

export default CartSummary;
