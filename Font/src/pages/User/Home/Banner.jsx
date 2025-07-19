import React from 'react'
import { GoArrowUpRight } from "react-icons/go";
import { Link } from 'react-router-dom';
function Banner() {
  return (
    <div>
      <div className='relative w-full xl:h-[800px] overflow-hidden rounded-4xl'>
              <video 
              src="videos/bg-video1.mp4"
              autoPlay  
              loop  
              muted
              playsInline
              className='w-full rounded-4xl'
              />
              <div className='absolute bottom-[10%] md:bottom-[20%] lg:bottom-[40%] left-[2%]'>
                <p className=' text-xl md:text-4xl lg:text-8xl text-white'>
                  Thời trang
                </p>
                <p className='text-sm md:text-lg lg:text-4xl text-white mt-3 md:mt-8 lg:ml-10'>
                  Thương hiệu
                </p>
                <button className='my-5 md:my-8 lg:px-10 lg:py-5 px-2 py-2 bg-white text-black rounded-full text-xs md:text-xl lg:text-2xl cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-500 flex justify-around items-center '>
                  <Link to={"/category"}>
                    Khám phá ngay
                  </Link>
                  <p className='ml-2 lg:mt-1 lg:ml-5 font-bold text-base md:text-xl lg:text-4xl'>
                    <GoArrowUpRight/>
                  </p>
                </button>
              </div>
            </div>
    </div>
  )
}

export default Banner
