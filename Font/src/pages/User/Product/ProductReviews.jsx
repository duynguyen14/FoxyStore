import { useState } from 'react';
import { Search, ChevronDown, Check, Star, MessageCircle, Image, Filter } from 'lucide-react';

export default function ProductReviews({reviews}) {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="  p-6">
      {
        reviews && reviews.length > 0 ? (
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-2xl  p-8 mb-8 border border-gray-100">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    ĐÁNH GIÁ SẢN PHẨM
                  </h2>
                  <p className="text-gray-600">Những phản hồi chân thực từ khách hàng</p>
                </div>
                <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-6xl font-bold text-yellow-600 mr-4">5</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium">Dựa trên {reviews.length} đánh giá từ khách hàng</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Enhanced Left Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 sticky top-6">
                  {/* Search */}
                  <div className="relative mb-6">
                    <input
                      type="text"
                      placeholder="Tìm kiếm đánh giá..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  </div>

                  {/* Rating Filter */}
                  <div className="mb-8">
                    <h3 className="text-gray-700 font-semibold mb-4 flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      Phân loại xếp hạng
                    </h3>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center mb-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <input type="checkbox" className="mr-3 h-4 w-4 text-blue-600 rounded" />
                        <label className="flex items-center cursor-pointer">
                          <span className="mr-2 font-medium">{rating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Verification Badge */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl mb-6 border border-blue-200">
                    <div className="flex items-start">
                      <Check className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={20} />
                      <p className="text-sm text-blue-800 leading-relaxed">
                        Các review đều đến từ khách hàng đã thực sự mua hàng của Foxyshop
                      </p>
                    </div>
                  </div>

                  {/* Response Filter */}
                  <div>
                    <h3 className="text-gray-700 font-semibold mb-4 flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Lọc phản hồi
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <input type="checkbox" className="mr-3 h-4 w-4 text-blue-600 rounded" />
                        <label className="cursor-pointer">Đã phản hồi</label>
                      </div>
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <input type="checkbox" className="mr-3 h-4 w-4 text-blue-600 rounded" />
                        <label className="cursor-pointer flex items-center">
                          <Image className="w-4 h-4 mr-2" />
                          Chỉ có hình ảnh
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Reviews List */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl p-6">
                  {/* Sort Header */}
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <p className="text-gray-600 font-medium">Hiển thị {reviews.length} đánh giá</p>
                    <div className="relative">
                      <button className="flex items-center bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl px-6 py-2 transition-colors">
                        <span className="mr-2">Sắp xếp</span>
                        <ChevronDown size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div key={review.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        {/* Review Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                              {review.userName.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800">{review.userName}</h3>
                              <span className="text-gray-500 text-sm">{review.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>

                        {/* Review Comment */}
                        <p className="text-gray-700 leading-relaxed mb-4 bg-white p-4 rounded-lg border border-gray-100">
                          {review.comment}
                        </p>

                        {/* Store Reply */}
                        {review.reply && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 ml-4">
                            <div className="flex items-start">
                              <MessageCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={18} />
                              <div>
                                <span className="font-semibold text-blue-800 block mb-1">
                                  Phản hồi từ FoxyStore:
                                </span>
                                <p className="text-blue-700">{review.reply}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="text-center bg-white rounded-xl p-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có đánh giá nào</h3>
              <p className="text-gray-500">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
          </div>
        )
      }
    </div>
  );
}