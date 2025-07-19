import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Image from "../../assets/images/1168.png"
import { Link } from 'react-router-dom';
function NavPopups({setIsNav, link, submenu }) {
  const navigate = useNavigate();
    const handleOnclickTitle=(detail)=>{
      navigate(`/category/${detail.link1}`)
      setIsNav(false)
    }
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className='w-[1365px] h-full bg-white font-Montserrat rounded-md shadow-2xl border border-gray-200 flex overflow-hidden z-50'
    >
      {/* Danh mục bên trái */}
      <div className='basis-2/3 px-8 py-6 overflow-y-auto'>
        <div className={` ${submenu[0].submenu2!=null ||submenu.length>3?'grid grid-cols-2 lg:grid-cols-3 gap-5':'block'}`}
        >
          {submenu?.map((cat, i) => (
            <div key={i}>
              <Link className='text-base font-semibold uppercase text-gray-800 mb-2 cursor-pointer hover:text-red-500 py-5'to={cat.link1!=null ? `/category/${cat.link1}`: `/`} >
                {cat.subName}
              </Link>
              <ul className='space-y-2'>
                {cat.submenu2?.map((detail, j) => (
                  <li key={j}>
                    <button
                      className='font-normal text-sm text-gray-400 hover:text-red-500 hover:underline transition cursor-pointer'
                    >
                      <div
                        onClick={()=>handleOnclickTitle(detail)}
                      >
                        {detail.subname2}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default NavPopups;
