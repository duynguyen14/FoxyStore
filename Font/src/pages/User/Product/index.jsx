import React, { useEffect, useState } from 'react';
import { Heart, Share, Truck, HelpCircle, Eye, Minus, Plus, Star, ShoppingCart, Zap, MessageSquare, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { request } from '../../../untils/request';
import ProductReviews from './ProductReviews';
import ProductShowcase from './ProductShowcase';
import ReviewForm from './ReviewForm';
import { useDispatch, useSelector } from "react-redux";
import { logBehavior } from '../../../services/userBehavior';
import {
  addProductToCart,
} from "../../../redux/actions";

function Product() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.products);
  const [product, setProduct] = useState({
    quantity: 1,
    productSizeDTOS: [],
    price: 1,
    soldCount: 10,
    name: "",
    categoryName: "",
    images: [],
    reviews: [],
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [checkReview, setCheckReview] = useState(false);
  console.log("products : ",products);
  const handleSubmit = async() => {
    if (!rating || !comment.trim()) {
      alert('Vui lòng chọn số sao và nhập nội dung đánh giá.');
      return;
    }

    try{
      const response = await request.post(`reviews/create/${id}`,{
        comment : comment,
        rating: rating
      },{
        headers:{
          Authorization :`Bearer ${token}`
        }
      })
      // console.log('Đánh giá:', { rating, comment });
      // console.log(response.data);
      setProduct(pre=> ({
        ...pre,reviews:[...pre.reviews, response.data.result]
      }))
      alert("đánh giá thành công")
      // Reset form
      setRating(0);
      setComment('');
      setShowReviewForm(false);
    }
    catch(e){
      console.log("error",e)
    }
    // Xử lý gửi đánh giá tại đây
  };
  const [imageIndex, setImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [productRelateds, setProductRelateds] = useState([])
  const token = localStorage.getItem("token")
  const navigate = useNavigate();

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toLocalePrice = (value) => {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  useEffect(() => {
    const fetch = async () => {
      logBehavior(request,"view", id);
      try {
        const [response1, response2, response3] = await Promise.all([
          request.get(`product/${id}`),
          request.get(`product/${id}/related`),
        ])
        // console.log(response1.data);
        setProduct(response1.data.result)
        setProductRelateds(response2.data.result)
      }
      catch (e) {
        console.log("loi ", e)
      }
    }
    fetch();
  }, [id])

  const handleOnclickAddCart = async () => {
    if (selectedSize == null) {
      alert("Bạn chưa chọn size ")
      return;
    }
    if (!window.confirm("Bạn xác nhận thêm sản phẩm này vào giỏ")) {
      return;
    }
    try {
      const response = await request.post("/cart", {
        productId: product.id,
        quantity: quantity,
        sizeName: selectedSize
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      dispatch(addProductToCart(response.data.result))
      console.log(response.data)
      if (response.data.code == 1000) {
        alert("thêm sản phẩm vào giỏ hàng thành công")
      }
    }
    catch (e) {
      if (e.response.data.code == 2000) {
        alert("Phiên của bạn đã hết hạn vui lòng đăng nhập lại")
        navigate("/login")
      }
      console.log("Loi ", e)
    }
  }
  useEffect(()=>{
    localStorage.setItem("cart", JSON.stringify(products))
  },[products])
  const handleOnclickReview=async()=>{
    try{
      const response =await request.get(`reviews/check/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
        })
          setCheckReview(response.data.result)
        if(!response.data.result){
          alert("Bạn không thể đánh giá khi chưa mua sản phẩm này")
          return;
        }
    }
    catch(e){
      console.log("error ",e)
      if(e.response.data.code==2000){
        alert("Bạn cần đăng nhập để thực hiện chức năng này")
        navigate("/login");
      }
    }

  }
  return (
    product &&
    <div className="min-h-screen border-t-[1px] pt-10 border-gray-400">
      {/* Main Product Section */}
      <div className="px-4 py-8">
        <div className="bg-white w-full overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* Product Images Section */}
            <div className="lg:w-1/2 p-8">
              <div className="flex flex-col gap-6">

                {/* Main Product Image */}
                <div className="relative group">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg">
                    <img
                      src={`http://localhost:8080/images/${product.images[imageIndex]}.png`}
                      alt="Product main view"
                      className="w-full h-full cursor-pointer object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200"
                  >
                    <Heart
                      size={20}
                      className={`${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors duration-200`}
                    />
                  </button>
                </div>

                {/* Thumbnail Images */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((item, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${imageIndex === index
                          ? 'border-blue-500 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => setImageIndex(index)}
                    >
                      <img
                        src={`http://localhost:8080/images/${item}.png`}
                        alt={`Product thumbnail ${index}`}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="lg:w-1/2 p-8 lg:pl-4">

              {/* Category Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
                {product.categoryName}
              </div>

              {/* Product Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Ratings & Sales */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(134 đánh giá)</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-600">Đã bán {product.soldCount}</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {toLocalePrice(product.price)}
                </div>

                {/* Live Viewers */}
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                  <Eye size={16} />
                  <span>28 người đang xem</span>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Size: <span className="text-blue-600">{selectedSize || 'Chưa chọn'}</span>
                  </h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors">
                    Hướng dẫn chọn size
                  </button>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {product.productSizeDTOS.map((size, index) => (
                    <button
                      key={index}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-medium transition-all duration-200 ${selectedSize === size.sizeName
                          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                        }`}
                      onClick={() => setSelectedSize(size.sizeName)}
                    >
                      {size.sizeName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Số lượng:</h3>
                  <div className="flex items-center bg-gray-100 rounded-xl">
                    <button
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-l-xl transition-colors"
                      onClick={decrementQuantity}
                    >
                      <Minus size={18} />
                    </button>
                    <div className="w-16 h-12 flex items-center justify-center font-semibold bg-white">
                      {quantity}
                    </div>
                    <button
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-r-xl transition-colors"
                      onClick={incrementQuantity}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {product.quantity} sản phẩm có sẵn
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                  className="cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  onClick={() => handleOnclickAddCart()}
                >
                  <ShoppingCart size={20} />
                  Thêm vào giỏ - {toLocalePrice(product.price)}
                </button>
                <button className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  <Zap size={20} />
                  Mua ngay
                </button>
              </div>

              {/* Service Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Truck size={20} className="text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Vận chuyển</div>
                    <div className="text-sm text-gray-600">Miễn phí</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <HelpCircle size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Hỗ trợ</div>
                    <div className="text-sm text-gray-600">24/7</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Share size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Chia sẻ</div>
                    <div className="text-sm text-gray-600">Bạn bè</div>
                  </div>
                </div>
              </div>
                <div className='flex justify-end w-full mt-10'>
                  <button className='bg-amber-300 rounded-md px-3 py-2 text-xl text-white cursor-pointer'
                    onClick={()=>handleOnclickReview()}
                  >
                      Viết đánh giá
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
      {checkReview &&
        <ReviewForm showReviewForm={showReviewForm}
          setShowReviewForm={setShowReviewForm}
          handleSubmit={handleSubmit}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          checkReview={checkReview}
        />
      }
      <ProductReviews reviews={product.reviews} />
      {/* Product Showcase */}
      <ProductShowcase productRelateds={productRelateds} />
    </div>
  );
}

export default Product;