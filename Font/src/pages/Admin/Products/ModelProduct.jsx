import React from 'react';
import { X } from 'lucide-react';
import { HiOutlineX } from "react-icons/hi";
function ModelProduct({
    closeModal,
    handleSaveProduct,
    handleInputChange,
    product,
    categories,
    sizes,
    images,
    editingProduct,
    handleOnclickRemoveImage
}) {
    // console.log("formdata", product)
    // console.log("categories",categories)
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-secondary opacity-70"
                onClick={closeModal}
            ></div>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                    </h3>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form nội dung */}
                <form onSubmit={handleSaveProduct} className="p-4 w-full max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Cột trái: Upload ảnh */}
                        <div className="space-y-4">
                            <div className='h-[50%]'>

                                <label className="block text-sm font-medium text-gray-700">
                                    Ảnh Sản Phẩm *
                                </label>
                                <input
                                    type="file"
                                    name="images"
                                    multiple
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                {/* Hiển thị ảnh preview nếu có */}
                                {images && images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                                        {Array.from(images).map((file, index) => (
                                            <img
                                                key={index}
                                                src={URL.createObjectURL(file)}
                                                alt={`Ảnh ${index}`}
                                                className="w-32 h-32 object-cover rounded border"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className='flex justify-around items-center'>
                                {product.oldImageNames && product.oldImageNames.length > 0 && (
                                    <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                                        {
                                            product.oldImageNames.map((item, index) => {
                                                return (
                                                    <div key={index}
                                                        className='relative'
                                                        onClick={() => handleOnclickRemoveImage(item)}
                                                    >
                                                        <div className='text-red-500 text-md top-0 left-[85%] absolute'>
                                                            <HiOutlineX />
                                                        </div>
                                                        <img src={`http://localhost:8080/images/${item}.png`} alt="" className='w-32 h-32 bg-cover rounded-md p-2 border-[0.5px] border-gray-300' />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cột phải: Thông tin sản phẩm */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên Sản Phẩm *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Danh Mục *</label>
                                <select
                                    name="categoryId"
                                    value={product.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="">Chọn thể loại</option>
                                    {categories.map((category) => (
                                        <option key={category.categoryId} value={category.categoryId}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Giá *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Số Lượng *</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={product.quantity}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mô Tả</label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Size</label>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    {sizes.map((size) => (
                                        <label key={size.sizeId} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="sizes"
                                                value={size.sizeId}
                                                checked={product.sizeIds?.includes(size.sizeId)}
                                                onChange={handleInputChange}
                                            />
                                            {size.sizeName}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex justify-end mt-6 gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            {editingProduct ? 'Cập Nhật' : 'Thêm Mới'}
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );
}

export default ModelProduct;
