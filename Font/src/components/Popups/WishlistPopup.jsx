import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineX } from "react-icons/hi";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { request } from '../../untils/request';

function WishlistPopup({ isLove, setIsLove }) {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const token =localStorage.getItem("token");
  const handleAddToCart = (item) => {
    setIsLove(false);
    navigate(`/product/${item.id}`)
  };
  useEffect(()=>{
    const fetch = async()=>{
      try{
        const response =await request.get("favorite/getAll",{
          headers :{
            Authorization :`Bearer ${token}`
          }
        })
        console.log(response.data);
        setWishlist(response.data.result);
      }
      catch(e){
        console.log("error ",e)
      }
    }
    fetch()
  },[])
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className='z-50'
    >
      {
        token?
        (
        <div className='w-full max-w-sm md:max-w-md lg:max-w-lg bg-white z-50 h-screen font-Montserrat border-l border-pink-200 rounded-l-2xl fixed top-0 right-0 shadow-xl flex flex-col justify-between'>

          {/* <ToastContainer /> */}
          {/* Header */}
          <div className='flex justify-between items-center px-4 py-6 text-xl md:text-2xl font-semibold border-b border-pink-200 text-pink-600'>
            <div className='flex items-center gap-2 animate-pulse'>
              <AiFillHeart className='text-pink-500 text-2xl' />
              <p>Danh sách Yêu thích ({wishlist.length})</p>
            </div>
            <p
              onClick={() => setIsLove(false)}
              className='cursor-pointer hover:scale-125 rounded-full bg-gray-200 p-2 transition-transform'
            >
              <HiOutlineX />
            </p>
          </div>

          {/* Danh sách sản phẩm */}
          <div className='flex-1 overflow-y-auto px-4 py-5 space-y-6'>
            {wishlist.length === 0 ? (
              <p className='text-center text-gray-500'>Bạn chưa thêm sản phẩm nào vào mục yêu thích.</p>
            ) : (
              wishlist.map((product) => (
                <div key={product.id} className='flex gap-4 items-start border-b border-gray-200 pb-4'>
                  <div className='relative'>
                    <img
                      src={`http://localhost:8080/images/${product.images[0]}.png`} alt={product.name}
                      className='w-28 h-36 object-cover rounded-2xl shadow'
                    />
                    <AiFillHeart className='absolute top-1 right-1 text-pink-500 text-xl drop-shadow' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-base font-semibold text-gray-800'>{product.name}</h3>
                    {/* <p className='text-sm text-gray-600'>Màu: {product.color} - Size: {product.size}</p> */}
                    <p className='text-base font-medium text-red-500 mt-1'>
                      {product.price.toLocaleString()}đ
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className='cursor-pointer mt-3 text-sm font-medium bg-gradient-to-r from-pink-400 to-red-400 text-white py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105'
                    >
                      + Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className='p-4 border-t border-gray-200'>
              
            <button
              onClick={() => {
                setIsLove(false);
                navigate("/wishlist");
              }}
              className='w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition cursor-pointer'
            >
              Xem danh sách yêu thích
            </button>
          </div>
        </div>
        ):
        (
        <div className='w-full max-w-sm md:max-w-md lg:max-w-lg bg-white z-50 h-screen font-Montserrat border-l border-pink-200 rounded-l-2xl fixed top-0 right-0 shadow-xl flex flex-col justify-between'>
          <p className='text-center text-gray-500 mt-10 text-xl'>Bạn chưa đăng nhập vui lòng đăng nhập.</p>
          <div className='p-4 border-t border-gray-200'>
              
            <button
              onClick={() => {
                setIsLove(false);
                navigate("/login");
              }}
              className='w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition cursor-pointer'
            >
              Đăng nhập
            </button>
          </div>
        </div>
        )
      }
    </motion.div>
  );
}

export default WishlistPopup;
