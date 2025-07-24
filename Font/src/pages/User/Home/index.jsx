import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import NewProduct from "./NewProduct";
import ProductHot from "./ProductHot";
import Collections from "./Collections";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {getOrCreateSessionId} from "../../../untils/session";
// import { getProductForYou } from "../../../services/product";
import { request } from "../../../untils/request";
import ProductForYou from "../../../components/OtherComponent/ProductForYou";
function Home() {
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => {
    if (location.state?.successLogin) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const [newProduct,setNewProduct] =useState([]);
  const[saleProduct,setSaleProduct] =useState([])
  useEffect(()=>{
    getOrCreateSessionId();
    const fetch=async()=>{
      try{
        const response =await request.get("products/home")
        console.log(response.data)
        if(response.data.code ===1000){
          setNewProduct(response.data.result.productsNew);
          setSaleProduct(response.data.result.productsSale)
        }
      } catch (e) {
        console.log("Lỗi " + e);
      }
    };
    fetch();
  }, []);

  return (
    <div className=" lg:my-5 font-Montserrat">
      {showSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-green-300 text-white px-6 py-3 rounded-lg shadow-2xl z-50 transition-all duration-500 animate-fade-in">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-semibold text-lg">Đăng nhập thành công!</span>
        </div>
      )}
      <Banner />
      <motion.div>
        <div className="my-5 lg:my-10">
          <NewProduct newProduct={newProduct} />
        </div>
        <div className="my-5 lg:my-10">
          <ProductForYou/>
        </div>
        <div className="my-5 lg:my-10">
          <ProductHot saleProduct={saleProduct}/>
        </div>
        <div className="my-5 lg:my-10">
          <Collections />
        </div>
      </motion.div>
    </div>
  );
}
export default Home;

