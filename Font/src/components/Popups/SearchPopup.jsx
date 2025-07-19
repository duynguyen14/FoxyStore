import React from 'react'
import { motion } from 'framer-motion'

import Image1 from "../../assets/images/1169.png"
import Image2 from "../../assets/images/1168.png"
import Image3 from "../../assets/images/1167.png"

import { HiOutlineX } from "react-icons/hi";
import { LuSearch } from "react-icons/lu";
import { li } from 'framer-motion/client';
import ProductItem from '../OtherComponent/ProductItem';


function SearchPopup({setIsSearch,setIsPopUp}) {
  const hotSearchs=["Áo sơ mi", "Đồ ngủ nam", "Đồ bơi",]
  const product=[
    {
      name:"Túi Xách Nhỏ In Hoạ Tiết Chuyển Màu",
      price:"699 000",
      images:[Image1,Image2]
    },
    {
      name:"Túi Xách Nhỏ In Hoạ Tiết Chuyển Màu",
      price:"699 000",
      images:[Image1,Image2]
    },{
      name:"Túi Xách Nhỏ In Hoạ Tiết Chuyển Màu",
      price:"699 000",
      images:[Image1,Image2]
    },{
      name:"Túi Xách Nhỏ In Hoạ Tiết Chuyển Màu",
      price:"699 000",
      images:[Image1,Image2]
    },{
      name:"Túi Xách Nhỏ In Hoạ Tiết Chuyển Màu",
      price:"699 000",
      images:[Image1,Image2]
    },

  ]
  const handleOnclickX=()=>{
    setIsPopUp(false)
    setIsSearch(false)
  }
  return (
    <motion.div
    className=''
    initial={{opacity: 0, y: 100}}
    whileInView={{opacity: 1, y:0}}
    transition={{duration: 0.5}}
    >
      <div className='mx-3 md:mx-10 z-50 '>
        {/* title */}
        <div className='flex justify-between items-center text-xl md:text-3xl py-5 md:py-10'>
          <p className=''>
            Tìm kiếm
          </p>
          <motion.div className='cursor-pointer bg-gray-100 rounded-3xl p-2'
            whileHover={{rotate: 90, scale: 1.5, color: "#e43131"} }
            onClick={()=>handleOnclickX()}
          >
            <HiOutlineX/>
          </motion.div>
        </div>
        {/* input search */}
        <div className=' h-12 md:h-14 px-3 md:px-10 border-gray-200 border-3  flex justify-between items-center rounded-xl relative focus-within:border-black hover:border-black transition-all duration-300 ease-in-out md:text-2xl'>
          <input type="" 
          placeholder='Tìm kiếm sản phẩm . . .'
          className='outline-none h-full w-full'
          />
          <p className='my-icon hover:scale-125'>
            <LuSearch/>
          </p>
        </div>
        {/* hot search */}
        <div className=' my-5 md:my-10 text-xl md:text-3xl'>
            <p>
              Từ khoá hot
            </p>
            <div className='flex flex-wrap my-3 md:my-5'>
              {
                hotSearchs.map((item,index)=>{
                  return(
                    <li key={index} className='my-icon list-none mx-2 px-3 py-2 my-2 md:px-5 border-[0.5px] rounded-full border-gray-300 text-base md:text-lg '>
                      {item}
                    </li>
                  )
                })
              }
            </div>
        </div>
        {/* recent products */}
        <div>
          <div className='text-xl md:text-3xl'>
            <p className='mb-5 md:mb-10'>
              Sản phẩm tìm kiếm gần đây
            </p>
          </div>
          {/* list products */}
          <div className='grid grid-cols-2 gap-x-5 lg:gap-x-10 md:grid-cols-4 gap-y-5 md:gap-y-10'>
              {
                product.map((item,index)=>{
                  return(
                    <li key={index} className='list-none'>
                      <ProductItem name={item.name} price={item.price} images={item.images}/>
                    </li>
                  )
                })
              }
          </div>
          <div className='flex justify-center'>
            <button className=' btn-primary px-4 py-3 md:px-8 md:py-5 '>
              Nhiều hơn
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SearchPopup
