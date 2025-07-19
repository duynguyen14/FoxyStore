import React from 'react'
import { motion } from 'framer-motion'
import ProductItem from '../../../components/OtherComponent/ProductItem'
import { Link } from 'react-router-dom'
function ProductHot({saleProduct}) {
    return (
        <motion.div
            initial={{opacity:0 ,y:100}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 1.2}}
            viewport={{ once: true }}
        >
             <p className='text-lg  md:text-xl lg:text-4xl font-semibold text-center mb-2 md:mb-4 cursor-pointer'>
                Best Seller
            </p>
            <p className='text-sm md:text-xl lg:text-xl font-light text-center mb-10'>
                Lựa chọn phong cách phù hợp với bạn !
            </p>
            <div className='grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-6 md:gap-x-10 gap-y-10 mb-12'>
                {
                   saleProduct&& saleProduct.map((item,index)=>{
                        return(
                            <motion.div key={index} 
                                        initial={{opacity:0 ,y: (index+1)*20}}
                                        whileInView={{opacity: 1, y: 0}}
                                        transition={{duration: 1.2}}
                                        viewport={{ once: true }}
                            >
                                <div className='relative'>
                                    <ProductItem discountPercent={item.discountPercent} id={item.id} sizes={item.productSizeDTOS} name={item.name} price={item.price} images={item.images} soldCount={item.soldCount}/>   
                                    <div className="absolute top-0 left-0 bg-red-700 text-white text-xs font-semibold px-2 py-1 rounded-br-3xl z-10">
                                            Best seller
                                    </div>
                                </div>
                

                            </motion.div>
                        )
                    })
                }
            </div>
            <div className='flex justify-center w-full'>

                <Link className='btn-primary px-3 py-2 md:px-4 md:py-3 lg:px-8 lg:py-4'to={"/category"}>
                    Xem tất cả
                </Link>
            </div>
        </motion.div>
  )
}
export default ProductHot