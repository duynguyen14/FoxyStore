import React from 'react';
import { Package, Archive, DollarSign } from 'lucide-react';

function SummaryProduct({ products, formatPrice,summaryProduct }) {
    return (
        <div >
            {/* Tổng Sản Phẩm */}
            {summaryProduct&&
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">

                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">Tổng Sản Phẩm</div>
                            <div className="text-2xl font-bold text-gray-900">{summaryProduct.totalProduct}</div>
                            <div className="text-xs text-blue-600 mt-1">
                                {summaryProduct.totalProduct > 0 ? 'Đang quản lý' : 'Chưa có sản phẩm'}
                            </div>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Tổng Kho Hàng */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">Tổng Kho Hàng</div>
                            <div className="text-2xl font-bold text-gray-900">{summaryProduct.totalQuantity}</div>
                            <div className="text-xs text-green-600 mt-1">
                                {summaryProduct.totalQuantity > 100 ? 'Kho đầy đủ' : 
                                summaryProduct.totalQuantity > 50 ? 'Kho trung bình' : 
                                summaryProduct.totalQuantity > 0 ? 'Kho thấp' : 'Hết hàng'}
                            </div>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <Archive className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Giá Trị Kho */}
                <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-gray-500 mb-1">Giá Trị Kho</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {formatPrice(summaryProduct.totalPrice)}
                            </div>
                            <div className="text-xs text-purple-600 mt-1">
                                {summaryProduct.totalPrice > 1000000000 ? 'Giá trị cao' : 
                                summaryProduct.totalPrice > 500000000 ? 'Giá trị trung bình' : 
                                summaryProduct.totalPrice > 0 ? 'Giá trị thấp' : 'Không có giá trị'}
                            </div>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    );
}

export default SummaryProduct;