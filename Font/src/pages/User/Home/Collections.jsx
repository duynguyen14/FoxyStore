import React from 'react'

import Image1 from "../../../assets/images/collection1.png";
import Image2 from "../../../assets/images/collection2.png";
import Image3 from "../../../assets/images/collection3.png";
import Image4 from "../../../assets/images/1306.png";
import Image5 from "../../../assets/images/collection4.png";
import Image6 from "../../../assets/images/1291.png";

import { MdOutlineRemoveRedEye } from "react-icons/md";

import { motion } from 'framer-motion';
function Collections() {
  const collections=[
    {name:"Kính mắt", image: Image1},
    {name:"Kính mắt", image: Image2},
    {name:"Kính mắt", image: Image3},
    {name:"Kính mắt", image: Image4},
    {name:"Kính mắt", image: Image5},
    {name:"Kính mắt", image: Image6},
  ]
  return (
    <motion.div 
      className='font-kumbh my-30'
      initial={{opacity:0 ,y:100}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 1.2}}
      viewport={{ once: true }}
    >
      <div className=''>
        <p className='text-lg  md:text-xl lg:text-5xl font-semibold text-center mb-2 md:mb-4 my-icon'>
            Bộ sưu tập mới
        </p>
        <p className='text-sm md:text-xl lg:text-xl font-light text-center mb-12'>
            Khám phá ngay thời trang thương hiệu!
        </p>
      </div>
      <div className='grid grid-cols-6 gap-x-4 '>
        {
          collections.map((item,index)=>{
            return(
              <motion.li 
                key={index} 
                className=' list-none overflow-hidden rounded-3xl relative group'
                initial={{opacity:0 ,y: (index+1)*30}}
                whileInView={{opacity: 1, y: 0}}
                transition={{duration: 1.2}}
                viewport={{ once: true }}
                >
                <img src={item.image} alt="" className='rounded-3xl w-full h-full group-hover:scale-110 group-hover:brightness-90 transition-all duration-700 ease-in-out cursor-pointer'/>
                <p className='absolute top-[20%] right-[10%] text-2xl p-2 bg-white rounded-full group-hover:opacity-100 opacity-0 transition-opacity duration-500 hover:cursor-pointer hover:bg-gray-700 hover:text-white'>
                  <MdOutlineRemoveRedEye/>
                </p>
              </motion.li>

            )
          })
        }
      </div>
      
    </motion.div>
  )
}

export default Collections
