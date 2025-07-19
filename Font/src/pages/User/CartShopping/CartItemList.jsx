// components/CartItemList.jsx
import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

function CartItemList({ products,handleOnclickPlus,handeleOnclickDelete,handleOnclickSubtract }) {
  return (
  
    products&&products.length>0?(

      <div className="flex-1">
        <h2 className=" md:text-xl text-lg font-semibold mb-4">
          Giỏ hàng của bạn{" "}
          <span className="text-red-600 font-bold">{products.length} Sản Phẩm</span>
        </h2>
  
        <div className="hidden md:grid grid-cols-6 font-semibold  py-2">
          <div className="col-span-3">Sản phẩm</div>
          <div className="col-span-1 text-center">Số lượng</div>
          <div className="col-span-1 text-center">Giá</div>
          <div className="col-span-1 text-center"></div>
        </div>
  
        <div className="rounded-md">
          {products.map((product,index) => (
            <div
              key={index}
              className="flex flex-col md:grid md:grid-cols-6 gap-4 p-4 border-t border-gray-200"
            >
              <div className="col-span-3 flex">
                <img
                  src={`http://localhost:8080/images/${product.images[0]}.png`}
                  alt={product.productName}
                  className="w-30 h-32 md:w-40 md:h-52 object-cover rounded mr-3"
                />
                <div>
                  <h3 className="font-medium">{product.productName}</h3>
                  <p className="text-sm text-gray-600">
                     &nbsp;&nbsp; Size: {product.sizeName}
                  </p>
                </div>
              </div>
              <div className="flex justify-between md:block">
                  <p className="md:hidden">
                      Số lượng
                  </p>
                  <div className="flex items-start justify-center gap-2">
                  <button className="p-2 border rounded cursor-pointer"
                    onClick={()=>handleOnclickSubtract(product)}
                  >
                      <Minus size={16} />
                  </button>
                  <span className="mt-1">{product.quantity}</span>
                  <button className="p-2 border rounded cursor-pointer"
                    onClick={()=>handleOnclickPlus(product)}
                  >
                      <Plus size={16} />
                  </button>
                  </div>
              </div>
              <div className=" text-right whitespace-nowrap flex md:block justify-between">
                  <p className="md:hidden">
                      Tổng tiền
                  </p>
                  <p className="font-semibold">
                      {product.price.toLocaleString("vi-VN")}đ
  
                  </p>
              </div>
              <button className=" flex justify-between md:justify-center "
                onClick={()=>handeleOnclickDelete(product)}
              >
                  <p className="md:hidden">
                      Xoá sản phẩm
                  </p>
                  <p className="text-red-500 cursor-pointer ">
                      <Trash2 className="hover:scale-120 transition-all duration-300" />
                  </p>
              </button>
            </div>
          ))}
        </div>
      </div>
    )
    :
    (
      <div>
        
      </div>
    )

  );
}

export default CartItemList;
