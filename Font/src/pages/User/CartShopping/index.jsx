import React, { useEffect } from "react";
import CartItemList from "./CartItemList";
import CartSummary from "./CartSummary";
import CheckoutSteps from "./CheckoutSteps";
import { request } from "../../../untils/request.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductFromCart,
  removeProductFromCart,
  updateProductFromCart,
} from "../../../redux/actions";
function CartShopping() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.cart.products);
  useEffect(()=>{
    localStorage.setItem("cart",JSON.stringify(products))
  },[products])
  // Gọi API để lấy giỏ hàng khi load lại trang
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await request.get("cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("Token gửi lên:", token);
        if (res.data.code === 1000) {
          dispatch(getProductFromCart(res.data.result)); // cập nhật Redux
        }
      } catch (error) {
        if(error.response.data.code==2000){
          alert("Phiên của bạn đã hết hạn vui lòng đăng nhập lại")
          navigate("/login");
        }
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    };

    if (token) fetchCart();
  }, [dispatch, token]);

  // Tăng số lượng
  const handleOnclickPlus = async(item) => {
    try{
        const response =await request.patch("cart/update",{
            productSizeId: item.productSizeId,
            quantity : item.quantity+1
          ,
        },
        {
          headers :{
            Authorization :`Bearer ${token}`
          }
        }
        )
        console.log(response)
        if(response.data.code==1000){
          dispatch(updateProductFromCart(item.productSizeId, item.quantity + 1));
        }
      }
      catch(e){
        if(e.response.data.code==2000){
          alert("Phiên của bạn đã hết hạn vui lòng đăng nhập lại")
          return;
        }
      }
  };

  // Giảm số lượng
  const handleOnclickSubtract = async(item) => {
    if (item.quantity === 1) {
      if (window.confirm("Bạn chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?")) {
        dispatch(removeProductFromCart(item.productSizeId));
        alert("Xoá sản phẩm khỏi giỏ hàng thành công!");
        return;
      }
    } else {
      try{
        const response =await request.patch("cart/update",{
            productSizeId: item.productSizeId,
            quantity : item.quantity-1
          ,
        },
        {
          headers :{
            Authorization :`Bearer ${token}`
          }
        }
        )
        console.log(response)
        if(response.data.code==1000){
          dispatch(updateProductFromCart(item.productSizeId, item.quantity - 1));
        }
      }
      catch(e){
        if(e.response.data.code==2000){
          alert("Phiên của bạn đã hết hạn vui lòng đăng nhập lại")
          return;
        }
      }
    }
  };

  // Xoá sản phẩm
  const handeleOnclickDelete = async (item) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?")) return;

    try {
      const response = await request.delete(`cart/${item.productSizeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.code === 1000) {
        alert("Xoá sản phẩm thành công");
        dispatch(removeProductFromCart(item.productSizeId));
      }
    } catch (e) {
      console.error("Lỗi khi xoá sản phẩm:", e);
    }
  };

  // Đặt hàng
  const handleOnclickOrder = () => {
    // localStorage.setItem("cart", JSON.stringify(products));
    navigate("/order", { state: { products } });
  };

  return (
    <div className="mx-auto py-10 border-gray-300 border-y-[1px]">
      <div className="flex flex-col lg:flex-row gap-6">
        <div>
          <CheckoutSteps currentStep={1} />
          <CartItemList
            products={products}
            handleOnclickSubtract={handleOnclickSubtract}
            handleOnclickPlus={handleOnclickPlus}
            handeleOnclickDelete={handeleOnclickDelete}
          />
        </div>
        <CartSummary products={products} handleOnclickOrder={handleOnclickOrder} />
      </div>
    </div>
  );
}

export default CartShopping;
