import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineX } from "react-icons/hi";
import Image from "../../assets/images/1168.png";
import { useNavigate } from 'react-router-dom';
import { request } from '../../untils/request';
import { useDispatch, useSelector } from 'react-redux';
import { getProductFromCart } from '../../redux/actions';

function CartShoppingPopup({ isCart, setIsCart }) {
  // const [products,setProduct] = useState([]);
  const navigate = useNavigate();
  const token =localStorage.getItem("token");
  const dispatch =useDispatch();
  const products = useSelector((state)=> state.cart.products)
  useEffect(()=>{
    const fetch =async()=>{
      try{
        const response =await request.get("/cart",{
          headers :{
            Authorization: `Bearer ${token}`
          }
        })
        dispatch(getProductFromCart(response.data.result));
        // setProduct(response.data.result)
        console.log(response);
      }
      catch(e){
        if(e.response&&e.response.code==2000){
          alert("Phiên của bạn đã hết hạn vui lòng đăng nhập lại")
          navigate("/")
        }
        console.log("loi",e)
      }
    }
    fetch()
  },[])
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className=' w-full md:max-w-md lg:max-w-lg bg-white z-10 h-screen font-Montserrat border-l border-gray-200 rounded-l-md fixed top-0 right-0 shadow-xl flex flex-col justify-between'
    >
      {/* Header */}
      <div className='flex justify-between items-center px-4 py-6 text-xl md:text-2xl font-semibold border-b border-gray-200'>
        <p>Giỏ hàng ({products.length})</p>
        <p
          onClick={() => setIsCart(false)}
          className='cursor-pointer hover:scale-125 rounded-full bg-gray-200 p-2 transition-transform'
        >
          <HiOutlineX />
        </p>
      </div>

      {/* List sản phẩm */}
      <div className='flex-1 overflow-y-auto px-4 py-5 space-y-5'>
        {products&&products.length === 0 ? (
          <p className='text-center text-gray-500'>Không có sản phẩm nào trong giỏ hàng.</p>
        ) : (
          products.map((product,index) => (
            <div key={index} className='flex gap-4 items-center border-b border-gray-200 pb-4'>
              <img src={`http://localhost:8080/images/${product.images[0]}.png`} alt={product.productName} className='w-28 h-36 object-cover rounded-md' />
              <div className='flex-1'>
                <h3 className='text-sm md:text-base font-semibold'>{product.productName}</h3>
                <p className='text-sm text-gray-600'>Size: {product.sizeName}</p>
                <p className='text-sm text-gray-800'>SL: {product.quantity}</p>
                <p className='text-sm font-medium text-red-500'>
                  {(product.price * product.quantity).toLocaleString()}đ
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer: Nút xem giỏ hàng hoặc đặt hàng */}
      <div className='p-4 border-t border-gray-200'>
        <button
          onClick={() => {
            setIsCart(false);
            navigate("/cartShopping");
          }}
          className='btn-primary w-full py-3 rounded-lg'
        >
          Xem giỏ hàng
        </button>
      </div>
    </motion.div>
  );
}

export default CartShoppingPopup;
