import React, { useState } from 'react';
import { Search } from 'lucide-react';

function FilterProduct({ isFilter, handleOnclickFilter, categorys,params,setParams }) {

    const handleOnchangeParmas = (e) => {
        const { name, value } = e.target;
        setParams((pre) => ({
            ...pre,
            [name]: value
        }));
    };
    // console.log(params)
    // const handleFilterClick = () => {
    //     handleChangeParmasFilter(params.minPrice, params.maxPrice, params.categoryId);
    // };
    // console.log("categoris",categorys)
    return (
        <div className='bg-white p-6 mb-6 rounded-xl shadow relative'>
            {/* Ô tìm kiếm tên sản phẩm */}
            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm theo tên"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    // Nếu muốn thêm tìm theo tên thì bổ sung name và handleOnchangeParmas
                    name="searchTerm"
                    onChange={handleOnchangeParmas}
                    value={params.searchTerm}
                />
            </div>

            {/* Bộ lọc nâng cao */}
            <div className='flex justify-end'>
                <button
                    className=' text-xl font-medium mb-4 px-3 py-2 bg-green-500 rounded-md cursor-pointer text-white '
                    onClick={() => handleOnclickFilter()}
                >
                    Bộ lọc nâng cao
                </button>
            </div>

            {isFilter && (
                <div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {/* Giá từ */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Giá từ</label>
                            <input
                                type="number"
                                placeholder="VNĐ"
                                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                name="minPrice"
                                value={params.minPrice}
                                onChange={handleOnchangeParmas}
                            />
                        </div>

                        {/* Giá đến */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Giá đến</label>
                            <input
                                type="number"
                                placeholder="VNĐ"
                                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                name="maxPrice"
                                value={params.maxPrice}
                                onChange={handleOnchangeParmas}
                            />
                        </div>

                        {/* Thể loại sản phẩm */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Thể loại</label>
                            <select
                                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                name="categoryId"
                                value={params.categoryId}
                                onChange={handleOnchangeParmas}
                            >
                                <option value="">Tất cả</option>
                                {categorys && categorys.map((item, index) => (
                                    <option value={item.categoryId} key={index}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Nút lọc */}
                    {/* <div className='mt-6 text-right'>
                        <button
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            // onClick={handleFilterClick}  
                        >
                            Lọc sản phẩm
                        </button>
                    </div> */}
                </div>
            )}
        </div>
    );
}

export default FilterProduct;
