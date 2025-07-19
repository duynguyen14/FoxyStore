import React, { useState,useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { request } from '../../untils/request';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart } from '../../redux/actions';
function ProductItem({ id, name, price, images, soldCount, sizes, discountPercent, love,handleOnclickDeleteLove }) {
  const [isHover, setIsHover] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dispatch =useDispatch();
  const products =useSelector(state=> state.cart.products);
  const toLocalePrice = (value) => {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };
  const handleSelectSize = async (size) => {
    if (!token) {
      alert("Bạn vui lòng đăng nhập để thực hiện chức năng này!");
      setTimeout(() => {
        navigate("/login");
      }, 500);
      return;
    }

    if (!window.confirm("Bạn xác nhận thêm sản phẩm này vào giỏ hàng")) return;

    try {
      const response = await request.post(
        "/cart",
        {
          productId: id,
          quantity: 1,
          sizeName: size.sizeName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSelectedSize(size);
      setShowSizes(false);
      if (response.data.code === 1000) {
        alert("Thêm sản phẩm thành công");
        dispatch(addProductToCart(response.data.result))
        
      }
    } catch (e) {
      alert("Lỗi khi thêm sản phẩm vào giỏ");
      if (e.response?.data?.code === 2000) {
        alert("Phiên của bạn đã hết hạn vui lòng đăng nhập lại");
        navigate("/login");
      }
      console.log(e.response);
    }
  };
  useEffect(()=>{
      localStorage.setItem("cart", JSON.stringify(products))
    },[products])
  const handleOnclickLove = async () => {
    try {
      if (!token) {
        alert("Bạn vui lòng đăng nhập để thực hiện chức năng này!");
        setTimeout(() => {
          navigate("/login");
        }, 500);
        return;
      }
      if (!window.confirm("Xác nhận thêm sản phẩm vào danh sách yêu thích")) return;

      const response = await request.post(
        `favorite/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Thêm sản phẩm vào danh sách yêu thích thành công");
      console.log(response.data);
    } catch (e) {
      console.log("error", e);
    }
  };
  return (
    <div className="relative">
      {/* Image */}
      <div
        className='overflow-hidden relative rounded-md cursor-pointer'
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Link to={`/product/${id}`}>
          <motion.img
            key={isHover ? "hover" : "normal"}
            src={isHover && images[1] != null
              ? `http://localhost:8080/images/${images[1]}.png`
              : `http://localhost:8080/images/${images[0]}.png`}
            alt={name}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 1, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="rounded-xs w-full object-cover md:h-[350px]"
          />
        </Link>

        {/* Discount badge */}
        {discountPercent && (
          <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs md:text-sm font-bold px-2 py-1 rounded-bl-md">
            -{discountPercent}%
          </div>
        )}

        {/* Hover icons */}
        <motion.div
          className='absolute top-[5%] right-[5%] text-base md:text-xl xl:text-xl group'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isHover ? 1 : 0, y: isHover ? 0 : -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <p className='my-2 xl:my-5 p-1 xl:px-3 xl:py-3 bg-white rounded-full hover:bg-black hover:text-white transition-all duration-500'>
            <MdOutlineRemoveRedEye />
          </p>

          {love ? (
            <p className='my-2 xl:my-5 p-1 xl:px-3 xl:py-3 bg-white rounded-full text-pink-500'
              onClick={()=>handleOnclickDeleteLove?.()}
            >
              <FaHeart />
            </p>
          ) : (
            <p
              className='my-2 xl:my-5 p-1 xl:px-3 xl:py-3 bg-white rounded-full hover:bg-pink-400 hover:text-white transition-all duration-500'
              onClick={handleOnclickLove}
            >
              <FaRegHeart />
            </p>
          )}
        </motion.div>
      </div>

      {/* Info section */}
      <div className='text-sm md:text-base mx-1'>
        <p className='my-3 text-justify h-[55px] flex items-center gap-2'>
          {name.length > 45 ? name.slice(0, 30) + '...' : name}
        </p>
        <div className='flex justify-between items-center relative'>
          <div>
            <div className='flex'>
              <p className='font-semibold'
                style={discountPercent ? { textDecorationLine: "line-through" } : {}}>
                {toLocalePrice(price)}
              </p>
              {discountPercent && (
                <p className='pl-4 font-semibold text-red-500'>
                  {toLocalePrice(price - price * discountPercent / 100)}
                </p>
              )}
            </div>
            <p className='font-base text-gray-400 pt-2'>Đã bán {soldCount}</p>
            {selectedSize && (
              <p className="text-sm text-green-600 mt-1">
                Size đã chọn: {selectedSize.name || selectedSize.sizeName || selectedSize}
              </p>
            )}
          </div>

          <div
            className='text-lg p-2 h-10 btn-secondary cursor-pointer'
            onClick={() => setShowSizes(!showSizes)}
            title="Chọn size"
          >
            <FiShoppingBag />
          </div>

          {/* Size selector popup */}
          {showSizes && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute bottom-full right-0 mt-2 bg-white rounded-lg shadow-lg p-4 w-30 z-50"
            >
              <h3 className="text-sm font-semibold mb-2 text-center">Chọn size</h3>
              <ul className="max-h-40 overflow-y-auto text-sm">
                {sizes && sizes.length > 0 ? (
                  sizes.map((size, index) => (
                    <li
                      key={index}
                      className="p-1 cursor-pointer hover:bg-gray-200 rounded text-center"
                      onClick={() => handleSelectSize(size)}
                    >
                      {size.sizeName}
                    </li>
                  ))
                ) : (
                  <p>Không có size nào.</p>
                )}
              </ul>
              <button
                className="mt-2 w-full px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
                onClick={() => setShowSizes(false)}
              >
                Đóng
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
