import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineX } from 'react-icons/hi';
function UserPopUp({setIsUser,setIsPopUp}) {
    const token =localStorage.getItem("token");
    const navigate=useNavigate()
    
    const handleOnclickProfile=()=>{
        setIsUser(false)
        navigate("/profile")
    }
    const handleOnclickX=()=>{
        setIsPopUp(false)
        setIsUser(false)
    }
    const handleOnclickLogin=()=>{
        setIsUser(false)
        setIsPopUp(false)
        navigate("/login")
    }
    return (
        <motion.div
        className='px-2 pt-3 pb-14 z-50'
        initial={{opacity: 0, y: 100}}
        whileInView={{opacity: 1 , y: 0}}
        transition={{duration: 0.5}}
        >   
            <div className='flex justify-end text-2xl mx-5 py-5'>
                <motion.div 
                    className='cursor-pointer bg-gray-100 rounded-3xl p-2'
                    whileHover={{rotate: 90, scale: 1.5, color: "#e43131"} }
                    onClick={()=>handleOnclickX()}
                >
                    <HiOutlineX/>
                </motion.div>
            </div>
            {   
                token? 
                <div>
                    <div className='flex justify-center items-center mb-10'
                        onClick={()=>handleOnclickProfile()}
                    >
                    <button className='btn-primary px-20 py-3'>
                            Hồ sơ của tôi
                    </button>
                </div>
                </div>
                :
                <div>
                <div className='flex justify-center items-center mb-10'>
                    <button className='btn-primary px-20 py-3'
                        onClick={()=>handleOnclickLogin()}
                    >
                        
                            Đăng nhập 
                    
                    </button>
                </div>
                <p className='text-xl flex justify-center pb-5 border-b-1 border-gray-200'>
                    Bạn chưa có tài khoản? <span className='font-semibold my-icon'> <Link to={"/register"}>Đăng ký</Link></span> 
                </p>
                </div>
            }
        <p className='text-xl mx-5 mt-5'>
            Bạn cần hỗ trợ ?
        </p>  
        </motion.div>
  )
}

export default UserPopUp
