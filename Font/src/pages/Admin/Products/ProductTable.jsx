import React from 'react'
import { Edit, Trash2 } from 'lucide-react';
function ProductTable({products,formatPrice,openEditModal,handleDeleteProduct,searchTerm}) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản Phẩm
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ảnh
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số Lượng
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao Tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product,index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        {/* {product.name}&& */}
                        <div className="text-sm font-medium text-gray-900">
                          {product.name.length>25
                            ? product.name.slice(0,25) :product.name
                          } 
                        </div>
                      
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex justify-center items-center">
                        {
                          product.images &&
                        <div className="text-sm text-gray-500 w-32 h-32">
                          <img src={`http://localhost:8080/images/${product.images[0]}.png`} alt=""  className='w-full h-full rounded-md'/>
                        </div>
                        }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium  ${
                        product.quantity > 20 
                          ? 'bg-green-100 text-green-800' 
                          : product.quantity > 10 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.quantity} sản phẩm
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2 justify-center">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-white hover:bg-blue-600 p-1 rounded transition-colors cursor-pointer px-3 py-2 bg-blue-500"
                          title="Sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.productId)}
                          className="text-white hover:bg-red-600  bg-red-500 p-1 rounded transition-colors cursor-pointer px-3 py-2"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</div>
              <p className="text-gray-400 mt-2">
                {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy thêm sản phẩm đầu tiên'}
              </p>
            </div>
          )}
        </div>
  )
}

export default ProductTable
