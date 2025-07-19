import React, { useState } from 'react';
import { MessageSquare, X, Star } from 'lucide-react';

function ReviewForm({showReviewForm,setShowReviewForm,handleSubmit,rating,setRating,comment,setComment,checkReview}) {
  const [hover, setHover] = useState(0);
//   const [comment, setComment] = useState('');

  return (
    <div className="p-4">
        {
            checkReview&&
            <div>

                <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
                    {/* Review Header */}
                    <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <MessageSquare size={20} className="text-white" />
                        </div>
                        <div>
                        <h2 className="text-xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
                        <p className="text-sm text-gray-600">Chia sẻ trải nghiệm của bạn về sản phẩm này</p>
                        </div>
                    </div>

                    {/* Toggle Button */}
                    <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 cursor-pointer text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center gap-2"
                    >
                        {showReviewForm ? <><X size={18} /> Đóng</> : <><MessageSquare size={18} /> Viết đánh giá</>}
                    </button>
                    </div>

                    {showReviewForm && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 space-y-6">
                        {/* Rating Selection */}
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Đánh giá của bạn
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className="p-1 rounded-full hover:bg-yellow-100 transition-colors duration-200"
                            >
                                <Star
                                className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                                    (hover || rating) >= star
                                    ? 'text-yellow-400 fill-yellow-400 transform scale-110'
                                    : 'text-gray-300 hover:text-yellow-300'
                                }`}
                                />
                            </button>
                            ))}
                            {rating > 0 && (
                            <div className="ml-3 flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">{rating} sao</span>
                                <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                {{
                                    5: 'Tuyệt vời',
                                    4: 'Rất tốt',
                                    3: 'Tốt',
                                    2: 'Khá',
                                    1: 'Cần cải thiện'
                                }[rating]}
                                </div>
                            </div>
                            )}
                        </div>
                        </div>

                        {/* Comment Input */}
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Nhận xét chi tiết
                        </label>
                        <textarea
                            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này. Điều gì bạn thích nhất? Có điều gì cần cải thiện không?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={500}
                            className="w-full p-4 border border-gray-300 rounded-xl resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                        />
                        <div className="text-xs text-gray-500 mt-2">{comment.length}/500 ký tự</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={!rating || !comment.trim()}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Gửi đánh giá
                        </button>
                        <button
                            onClick={() => {
                            setShowReviewForm(false);
                            setRating(0);
                            setHover(0);
                            setComment('');
                            }}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                        >
                            Hủy
                        </button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        }
    </div>
  );
}

export default ReviewForm;
