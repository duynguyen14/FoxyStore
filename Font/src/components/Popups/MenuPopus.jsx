import React from 'react'
import { useState } from 'react';
import { motion } from 'framer-motion'

import { FaPlus } from "react-icons/fa";
import { RiSubtractFill } from "react-icons/ri";
import { HiOutlineX } from "react-icons/hi";
import { BsSearch } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { HiOutlinePhone } from "react-icons/hi";
function MenuPopus({ismenu,setIsmenu}) {
    const titles=[
        {name: "Thời trang nam", link:"", submenu:[
            "Áo thun", "Áo sơ mi", "Áo khoác","Quần jeans", "Quần kaki"
        ]},
        {name: "Thời trang nữ", link:"",submenu:[
            "Áo thun", "Áo sơ mi", "Áo khoác","Quần jeans", "Quần kaki"
        ]},
        {name: "Thời trang trẻ em", link:"",submenu:[
            "Áo thun", "Áo sơ mi", "Áo khoác","Quần jeans", "Quần kaki"
        ]},
        {name: "Phụ kiện thời trang", link:"",submenu:[
            "Áo thun", "Áo sơ mi", "Áo khoác","Quần jeans", "Quần kaki"
        ]},
        {name: "Về chúng tôi", link:"",submenu:[
            "Áo thun", "Áo sơ mi", "Áo khoác","Quần jeans", "Quần kaki"
        ]},
      ]
    const [isSubmenu,setIsSubmenu]= useState(null);
    const handleOnclickPlus=(index)=>{
        setIsSubmenu(index)
    }
  return (
    <motion.div
    className='font-normal bg-white w-full text-xs sm:text-base h-screen relative font-kumbh z-50'
    initial={{opacity: 0, x: -50}}
    whileInView={{opacity: 1, x: 0}}
    transition={{duration: 0.5}}
    >
    <div className='text-2xl md:text-4xl pt-5 px-2'>
        <motion.div 
        onClick={()=>setIsmenu(false)} 
        className='py-3 inline-block cursor-pointer'
        whileHover={{rotate: 180, scale: 1.5}}
        transition={{duration: 0.3}}
        style={{display: "inline-block"}}
        >
            <HiOutlineX/>
        </motion.div>
        <div className='flex justify-center relative items-center border-1 rounded-md md:mx-5'>
        <p className='absolute left-2 text-xl md:text-2xl'>
            <BsSearch/>
        </p>
        <input 
            type="text" 
            className='w-[70%] rounded-md md:h-12 h-10 placeholder:text-sm placeholder:md:text-xl placeholder:text-left focus:outline-0 px-4 py-2 mb-1'
            placeholder='Tìm kiếm sản phẩm ?'
        />
        </div>
    </div>
    <div>
    </div>
      <ul>
        {titles.map((item,index)=>{
            return (
                <li key={index}
                    className='mx-3 py-3 md:py-5 flex  justify-between border-b-1 border-gray-200 items-center relative'
                >
                    <div>
                        {item.name}
                    {
                        item.submenu&&item.submenu.length>0&&isSubmenu!=null &&isSubmenu==index&&
                        <ul className='mx-2'>
                            {item.submenu.map((submenu,index2)=>{
                                return(
                                    <li key={index2} className='py-2'>
                                        {submenu}
                                    </li>
                                )
                            })}
                        </ul>
                    }
                    </div>
                    <div className=' text-sm lg:text-lg absolute md:top-4 right-3 top-2 '>
                        {
                            isSubmenu==index?
                            <p onClick={()=>handleOnclickPlus(null)}>
                                <RiSubtractFill/>
                            </p> :
                            <p onClick={()=>handleOnclickPlus(index)}>
                                <FaPlus />
                            </p>
                        }
                    </div>
                </li>
            )
        })}
      </ul>
    <div className='absolute top-[70%]'>

      <div className='grid grid-cols-2 gap-x-3 md:gap-x-5 mx-2 text-xs md:text-sm'>
        <div className='flex items-center bg-gray-200 h-10 md:h-14 rounded-md w-full px-1'>
             <p className='px-2'>Danh sách</p> <FaRegHeart/>
        </div>
        <div className='flex items-center bg-gray-200 h-10 md:h-14 rounded-md w-full px-1'>
             <p className='px-2'>Đăng nhập</p> <FiUser/>
        </div>
      </div>
      <div className='grid grid-rows-5 gap-y-4 mx-2 my-3 md:my-6 '>
        <p className='font-semibold'>
            Thông tin liên lạc
        </p>
        <p>
            29 Cầu diễn Nam Từ Liêm Hà Nội
        </p>
        <p className='font-semibold'>
            Liên hệ từ xa
        </p>
        <p className='flex items-center'>
            <MdOutlineEmail/> <span className='px-2'>Foxy@gmail.com</span>
        </p>
        <p className='flex items-center'>
            <HiOutlinePhone/> <span className='px-2'>09234665999</span>
        </p>
      </div>
    </div>
    </motion.div>
  )
}

export default MenuPopus
