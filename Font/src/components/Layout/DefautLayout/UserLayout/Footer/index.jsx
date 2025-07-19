import React from 'react'

import { MdArrowOutward } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { FiPhoneForwarded } from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";
import { FaAmazon } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa6";

import { Link } from 'react-router-dom';
function Footer() {
  const icons=[
    <FaFacebookF/>, <FaTiktok/>, <FaXTwitter/>, <FaAmazon/>, <FaPinterestP/>,<FiInstagram/>
  ]
  const informations=[
    {title:"Về FOXY STORE", link:""},
    {title:"Tuyền dụng", link:""},
    {title:"Kết nối với chúng tôi", link:""},
    {title:"Cửa hàng FOXY STORE", link:""},
    {title:"Tài khoản của tôi", link:""},
    // {title:"Về FOXY STORE", link:""},
    // {title:"Về FOXY STORE", link:""},

  ]
  const CustomerSevices=[
    {title:"Chính sách điều khoản", link:""},
    {title:"Hướng dẫn mua hàng", link:""},
    {title:"Chính sách thanh toán", link:""},
    {title:"Chính sách đổi trả", link:""},
    {title:"Chính sách bảo hành", link:""},
    {title:"Chính sách vận chuyển", link:""},
    {title:"Chính sách thành viên", link:""},
  ]
  return (
    <div className='lg:flex justify-between items-start mx-5 xl:mx-20 xl:my-30 gap-10 grid grid-rows-4'>
      {/* CỘT 1: Logo + Info */}
      <div className='flex-1'>
        <p className='text-xl font-semibold md:text-3xl mb-6'>
          FOXY STORE
        </p>
        <div className=''>
          <p className=' text-base md:text-xl pb-2'>
            32 Phương Canh, Bắc Từ Liêm. Hà Nội
          </p>
          <p className='text-base md:text-lg flex items-center font-semibold'>
            Thêm thông tin
            <span className='px-2 text-xl hover:rotate-45 transition-all duration-500 my-icon'>
              <MdArrowOutward />
            </span>
          </p>
        </div>
        <div className='grid grid-rows-2 gap-y-3 my-6'>
          <p className=' text-base md:text-xl flex items-center font-base'>
            <span className='text-lg md:text-3xl hover:scale-120 transition-all duration-500 my-icon mr-6'>
              <MdOutlineMail />
            </span>
            foxy@gmail.com
          </p>
          <p className='text-base md:text-xl flex items-center font-base'>
            <span className='text-lg md:text-3xl hover:scale-120 transition-all duration-500 my-icon mr-6'>
              <FiPhoneForwarded />
            </span>
            086 - 554 - 0311
          </p>
        </div>
        <div className='flex text-xl md:text-3xl gap-3 flex-wrap'>
          {icons.map((item, index) => (
            <Link
              key={index}
              className='my-icon list-none border-[1px] rounded-full p-2 cursor-pointer hover:scale-110'
              to="https://www.facebook.com/BoysTp2004"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      {/* CỘT 2: Thông tin */}
      <div className='flex-1'>
        <p className='font-semibold text-xl md:text-3xl mb-6'>
          Thông tin
        </p>
        <ul className='text-base md:text-lg'>
          {informations.map((item, index) => (
            <li key={index} className='list-none my-3 my-icon'>
              {item.title}
            </li>
          ))}
        </ul>
      </div>

      {/* CỘT 3: Dịch vụ khách hàng */}
      <div className='flex-1'>
        <p className='font-semibold text-xl md:text-3xl mb-6'>
          Dịch vụ khách hàng
        </p>
        <ul className='text-base md:text-lg'>
          {CustomerSevices.map((item, index) => (
            <li key={index} className='list-none my-3 my-icon'>
              {item.title}
            </li>
          ))}
        </ul>
      </div>
      <div className='flex-1'>
        <p className='font-semibold text-xl md:text-3xl mb-6'>
         Kết nối
        </p>
        <p>
          Để lại thông tin để kết nối với chúng tôi
        </p>
        <div className='border-[2px] border-gray-200 rounded-4xl h-10 md:h-15 px-6 my-3 md:my-10 focus-within:border-black'>
          <input type="text" name="" id="" className=' w-[50%] xl:w-full h-full outline-none' placeholder='Địa chỉ email'/>
        </div>
        <div className='flex justify-center items-center mb-4'>
          <button className='bg-black text-white rounded-md cursor-pointer hover:bg-red-600 transition-all duration-500 text-xl px-5 py-3'>Kết nối</button>
        </div>
        <p className='text-base md:text-xl cursor-pointer my-icon'>
          Thông tin và bảo mật
        </p>
      </div>
    </div>

  )
}

export default Footer
