import React, { useState, useEffect } from 'react';
import { Star, Check, X, Eye, EyeOff, MessageCircle, Send, AlertCircle } from 'lucide-react';
import { request } from '../../../untils/request';
function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterRating, setFilterRating] = useState('');
  const [filterReply, setFilterReply] = useState('');
  const [searchText, setSearchText] = useState('');
  const [replyModal, setReplyModal] = useState({ open: false, review: null, value: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const token =localStorage.getItem("token");
  // Fetch reviews from API
  useEffect(() => {
    const fetch=async()=>{
      setLoading(true);
      try{
        const response =await request.get("reviews/admin",{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        console.log(response.data)
        setFeedbacks(response.data);
        setError(null);
        setLoading(false)
      }
      catch(e){
        console.log("error ",e)
      }

    }
    fetch();
  }, []);

  // Filter feedbacks based on rating, reply status, and search text
  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchRating = filterRating ? fb.rating === Number(filterRating) : true;
    const text = searchText.toLowerCase();
    const matchSearch = fb.userName.toLowerCase().includes(text) || fb.comment.toLowerCase().includes(text);
    let matchReply = true;
    if (filterReply === 'replied') {
      matchReply = fb.reply && fb.reply.trim() !== '';
    } else if (filterReply === 'not-replied') {
      matchReply = !fb.reply || fb.reply.trim() === '';
    }
    return matchRating && matchSearch && matchReply;
  });

  // Handlers for review actions
  const handleApprove = (id) => {
    setFeedbacks((fbs) => fbs.map((f) => (f.reviewId === id ? { ...f, status: 'Đã duyệt' } : f)));
  };

  const handleReject = (id) => {
    setFeedbacks((fbs) => fbs.map((f) => (f.reviewId === id ? { ...f, status: 'Từ chối' } : f)));
  };

  const handleToggleHide = (id) => {
    setFeedbacks((fbs) =>
      fbs.map((f) =>
        f.reviewId === id ? { ...f, status: f.status === 'Đã ẩn' ? 'Đã duyệt' : 'Đã ẩn' } : f
      )
    );
  };

  // Reply modal handlers
  const openReplyModal = (review) => setReplyModal({ open: true, review, value: review.reply || '' });
  const closeReplyModal = () => {
    setReplyModal({ open: false, review: null, value: '' });
    setReplyLoading(false);
  };

  const handleReply = async () => {
    if (!replyModal.value.trim()) {
      alert('Vui lòng nhập nội dung trả lời!');
      return;
    }

    setReplyLoading(true);
    const reviewId = replyModal.review.reviewId;
    const replyText = replyModal.value.trim();
    try {
      const response = await request.put(`reviews/${reviewId}/admin/reply`,{
        reply : replyText
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      const updatedReview = response.data
      setFeedbacks((fbs) =>
        fbs.map((f) => (f.reviewId === reviewId ? { ...f, reply: updatedReview.reply } : f))
      );

      closeReplyModal();
      alert('Trả lời đã được gửi thành công!');
    } catch (error) {
      alert('Gửi trả lời thất bại: ' + error.message);
    } finally {
      setReplyLoading(false);
    }
  };

  // Toggle review details
  const toggleDetails = (reviewId) => {
    setSelectedReviewId((prev) => (prev === reviewId ? null : reviewId));
  };

  // Calculate review statistics
  const totalReviews = feedbacks.length;
  const repliedReviews = feedbacks.filter((fb) => fb.reply && fb.reply.trim() !== '').length;
  const unrepliedReviews = totalReviews - repliedReviews;

  if (loading) return <div className="text-center py-12 text-gray-600">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center py-12 text-red-600 font-semibold">Lỗi: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 px-4">
          <div>
            <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-2 mb-2">
              <MessageCircle size={28} className="text-indigo-500" />
              Quản lý đánh giá
            </h2>
            <div className="flex gap-4 text-sm text-gray-600">
              <span className="bg-blue-100 px-3 py-1 rounded-full">Tổng: {totalReviews}</span>
              <span className="bg-green-100 px-3 py-1 rounded-full">Đã phản hồi: {repliedReviews}</span>
              <span className="bg-orange-100 px-3 py-1 rounded-full">Chưa phản hồi: {unrepliedReviews}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Tìm theo người dùng hoặc nội dung..."
              className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Tất cả sao</option>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} sao
                  </option>
                ))}
              </select>
              <select
                value={filterReply}
                onChange={(e) => setFilterReply(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Tất cả</option>
                <option value="replied">Đã phản hồi</option>
                <option value="not-replied">Chưa phản hồi</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-lg bg-white px-4 py-6">
          <table className="min-w-full text-sm text-left border-collapse rounded-xl overflow-hidden table-fixed">
            <thead className="bg-indigo-100 text-indigo-900 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 font-semibold w-[15%] min-w-[120px] whitespace-nowrap">Người dùng</th>
                <th className="p-4 font-semibold w-[10%] min-w-[100px] whitespace-nowrap">Mã sản phẩm</th>
                <th className="p-4 font-semibold w-[10%] min-w-[100px] whitespace-nowrap">Số sao</th>
                <th className="p-4 font-semibold w-[30%] min-w-[200px]">Nội dung</th>
                <th className="p-4 font-semibold w_[25%] min-w-[180px]">Trả lời</th>
                <th className="p-4 text-center font-semibold w-[15%] min-w-[120px] whitespace-nowrap">Hành động</th>
                <th className="p-4 font-semibold text-center w-[5%] min-w-[60px] whitespace-nowrap">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                    Không tìm thấy đánh giá phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredFeedbacks.map((fb) => (
                  <React.Fragment key={fb.reviewId}>
                    <tr className="border-b border-gray-200 hover:bg-indigo-50 transition">
                      <td className="p-4 font-medium text-gray-800 whitespace-nowrap">{fb.userName}</td>
                      <td className="p-4 text-indigo-600 font-semibold whitespace-nowrap">#{fb.productId}</td>
                      <td className="p-4 flex items-center gap-1 whitespace-nowrap">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={i < fb.rating ? 'text-yellow-400' : 'text-gray-300'}
                            fill={i < fb.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </td>
                      <td className="p-4 max-w-[200px]">
                        <p className="truncate" title={fb.comment}>
                          {fb.comment}
                        </p>
                      </td>
                      <td className="p-4 max-w-[180px]">
                        {fb.reply ? (
                          <div className="flex items-center gap-2">
                            <span className="text-green-700 italic truncate" title={fb.reply}>
                              {fb.reply}
                            </span>
                            <Check size={16} className="text-green-500 flex-shrink-0" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 italic">Chưa trả lời</span>
                            <AlertCircle size={16} className="text-orange-400 flex-shrink-0" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 flex flex-wrap justify-center gap-2 whitespace-nowrap">
                        {fb.status === 'Chờ duyệt' && (
                          <>
                            <button
                              className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-100 transition"
                              title="Duyệt"
                              onClick={() => handleApprove(fb.reviewId)}
                            >
                              <Check size={20} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition"
                              title="Từ chối"
                              onClick={() => handleReject(fb.reviewId)}
                            >
                              <X size={20} />
                            </button>
                          </>
                        )}
                        {fb.status === 'Đã duyệt' && (
                          <button
                            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition"
                            title="Ẩn đánh giá"
                            onClick={() => handleToggleHide(fb.reviewId)}
                          >
                            <EyeOff size={20} />
                          </button>
                        )}
                        {fb.status === 'Đã ẩn' && (
                          <button
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition"
                            title="Hiện đánh giá"
                            onClick={() => handleToggleHide(fb.reviewId)}
                          >
                            <Eye size={20} />
                          </button>
                        )}
                        <button
                          className={`p-2 rounded-lg transition ${
                            fb.reply
                              ? 'text-green-700 hover:text-green-900 hover:bg-green-100'
                              : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100 animate-pulse'
                          }`}
                          title={fb.reply ? 'Chỉnh sửa trả lời' : 'Trả lời'}
                          onClick={() => openReplyModal(fb)}
                        >
                          <MessageCircle size={20} />
                        </button>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          className="text-indigo-500 hover:text-indigo-800 transition"
                          onClick={() => toggleDetails(fb.reviewId)}
                          title={selectedReviewId === fb.reviewId ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                        >
                          {selectedReviewId === fb.reviewId ? '▲' : '▼'}
                        </button>
                      </td>
                    </tr>

                    {selectedReviewId === fb.reviewId && (
                      <tr className="bg-indigo-50">
                        <td colSpan="7" className="p-4 text-sm text-gray-700 space-y-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div>
                                <strong>Sản phẩm:</strong> {fb.productName || 'N/A'}
                              </div>
                              <div>
                                <strong>Ngày đánh giá:</strong> {fb.date || 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div>
                                <strong>Nội dung đầy đủ:</strong>
                              </div>
                              <p className="text-gray-600 italic mt-1 p-2 bg-white rounded border">
                                {fb.comment}
                              </p>
                              {fb.reply && (
                                <>
                                  <div className="mt-2">
                                    <strong>Phản hồi:</strong>
                                  </div>
                                  <p className="text-green-700 italic mt-1 p-2 bg-green-50 rounded border">
                                    {fb.reply}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Reply Modal */}
        {replyModal.open && (
          <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="text-indigo-600" size={24} />
                  <h3 className="text-xl font-semibold text-gray-800">Trả lời đánh giá</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Phản hồi cho <strong>{replyModal.review.userName}</strong> về sản phẩm #{replyModal.review.productId}
                </p>
              </div>

              {/* Review Content */}
              <div className="p-6 bg-gray-50 border-b">
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Đánh giá của khách hàng:</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < replyModal.review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          fill={i < replyModal.review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border italic text-gray-700">
                    "{replyModal.review.comment}"
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung phản hồi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    rows={6}
                    value={replyModal.value}
                    onChange={(e) =>
                      e.target.value.length <= 500 &&
                      setReplyModal((prev) => ({ ...prev, value: e.target.value }))
                    }
                    placeholder="Cảm ơn bạn đã đánh giá sản phẩm. Chúng tôi rất trân trọng ý kiến của bạn..."
                    disabled={replyLoading}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {replyModal.value.length}/500 ký tự
                  </div>
                </div>

                {/* Reply Suggestions */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Gợi ý phản hồi:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Cảm ơn bạn đã đánh giá sản phẩm!',
                      'Chúng tôi rất trân trọng ý kiến của bạn.',
                      'Chúng tôi sẽ cải thiện sản phẩm tốt hơn.',
                      'Hy vọng bạn sẽ tiếp tục ủng hộ chúng tôi.',
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 transition"
                        onClick={() =>
                          setReplyModal((prev) => ({
                            ...prev,
                            value: prev.value ? `${prev.value} ${suggestion}` : suggestion,
                          }))
                        }
                        disabled={replyLoading}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    onClick={closeReplyModal}
                    disabled={replyLoading}
                  >
                    Hủy
                  </button>
                  <button
                    className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 ${
                      replyLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleReply}
                    disabled={replyLoading}
                  >
                    {replyLoading ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Send size={16} />
                    )}
                    Gửi phản hồi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackManagement;