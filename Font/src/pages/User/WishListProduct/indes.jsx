import React, { useEffect, useState } from 'react'
import ProductItem from "../../../components/OtherComponent/ProductItem.jsx"
import { request } from '../../../untils/request.js';
import { useNavigate } from 'react-router-dom';

function WishListProduct() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate =useNavigate()
  useEffect(() => {
    const fetch = async () => {
      try {
        setIsLoading(true);
        const response = await request.get("favorite/getAll", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        // console.log(response.data);
        setProducts(response.data.result);
      }
      catch (e) {
        console.log("error ", e)
      } finally {
        setIsLoading(false);
      }
    }
    fetch()
  }, [])

  const handleOnclickDeleteLove = async (id) => {
    try {
      if (!token) {
        alert("Bạn vui lòng đăng nhập để thực hiện chức năng này!");
        setTimeout(() => {
          navigate("/login");
        }, 500);
        return;
      }

      if (!window.confirm("Xác nhận xoá sản phẩm này khỏi danh sách yêu thích")) return;

      const response = await request.delete(
        `favorite/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Xoá sản phẩm khỏi danh sách yêu thích thành công");
      // console.log(response.data);
      setProducts(products.filter(item => item.id !== id))
    } catch (e) {
      console.log("error", e);
    }
  };

  // Hiển thị loading
  if (isLoading) {
    return (
      <div className='ml-3 mt-10'>
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-500">Đang tải danh sách yêu thích...</div>
        </div>
      </div>
    );
  }

  // Hiển thị khi danh sách trống
  if (!products || products.length === 0) {
    return (
      <div className='ml-3 mt-10'>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          {/* Icon trái tim */}
          <div className="mb-6">
            <svg 
              className="w-24 h-24 text-gray-300" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          
          {/* Thông báo chính */}
          <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
            Danh sách yêu thích trống
          </h3>
          
          {/* Mô tả */}
          <p className="text-gray-500 text-center mb-6 max-w-md">
            Bạn chưa thêm sản phẩm nào vào danh sách yêu thích. 
            Hãy khám phá và thêm những sản phẩm yêu thích của bạn!
          </p>
          
          {/* Nút hành động */}
          <button 
            onClick={()=>navigate("/")} 
            className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Khám phá sản phẩm
          </button>
        </div>
      </div>
    );
  }

  // Hiển thị danh sách sản phẩm
  return (
    <div className='ml-3 mt-10'>
      <div className="mt-5">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-10 mb-12">
          {products.map((product, index) => (
            <div key={index} className="relative">
              <ProductItem
                discountPercent={product.discountPercent}
                id={product.id}
                sizes={product.productSizeDTOS}
                name={product.name}
                price={product.price}
                images={product.images}
                soldCount={product.soldCount}
                love={true}
                handleOnclickDeleteLove={() => handleOnclickDeleteLove(product.id)}
              />
              <div className="absolute top-0 left-0 bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-br-md">
                NEW
              </div>
              {product.discountPercent &&
                <div className="absolute top-0 left-0 bg-red-700 text-white text-xs font-semibold px-2 py-1 rounded-br-3xl">
                  Best seller
                </div>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WishListProduct