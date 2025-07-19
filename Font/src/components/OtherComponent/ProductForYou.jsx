import React, { use, useEffect, useState } from 'react'
import { getProductForYou } from '../../services/product';
import { motion } from 'framer-motion';
import ProductItem from './ProductItem';
import { Link } from 'react-router-dom';
function ProductForYou() {
    const [products,setProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProductForYou(); // CHỜ kết quả thực
                setProducts(data); // Đặt dữ liệu vào state
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchData();
    },[])
    console.log("product for you", products);

  return (
    
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
        >
            <p className='text-lg md:text-xl lg:text-4xl font-semibold text-center mb-2 md:mb-4 cursor-pointer'>
                Sản phẩm dành cho bạn
            </p>
            <p className='text-sm md:text-xl lg:text-xl font-light text-center mb-12'>
                đề xuất theo phong cách của bạn !
            </p>
            <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-6 md:gap-x-10 gap-y-10 mb-10'>
                {
                    products.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2 }}
                            viewport={{ once: true }}
                        >
                            <div className='relative'>
                                <ProductItem
                                    discountPercent={item.discountPercent}
                                    id={item.id}
                                    sizes={item.productSizeDTOS}
                                    name={item.name}
                                    price={item.price}
                                    images={item.images}
                                    soldCount={item.soldCount}
                                />
                                <div className="absolute top-0 left-0 bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-br-md z-10">
                                    NEW
                                </div>
                            </div>
                        </motion.div>
                    ))
                }
            </div>
            <div className='flex justify-center w-full'>
                <Link
                    className='btn-primary px-3 py-2 md:px-4 md:py-3 lg:px-8 lg:py-4'
                    to={"/category"}
                >
                    Xem tất cả
                </Link>
            </div>
        </motion.div>
    );
  
}

export default ProductForYou
