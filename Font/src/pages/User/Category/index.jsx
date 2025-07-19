
import React, { useEffect, useState } from 'react';
import SortDropdown from './SortDropdown';
import ProductItem from '../../../components/OtherComponent/ProductItem';
import { request } from '../../../untils/request';
import { useParams } from 'react-router-dom';
import Pagination from './Pagination';
function Category() {
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1); // Start from page 1
  const [totalPages, setTotalPages] = useState(23); // Example total pages
  const sortOptions = [
  {name:"Mới nhất", key:"newest"},
  {name:"Được mua nhiều nhất", key:"bestSold"},
  // {name:"Được yêu thích nhất", key:"bestLove"},
  {name:"Giá: cao đến thấp", key:"price_desc"},
  {name:"Giá: thấp đến cao", key:"price_asc"},
];
const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(sortOptions[0]);


  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    console.log("Sort by:", option);
  };
  useEffect(() => {
    const fetch = async () => {
      try {
        let response;
        if (id == null) {
          response = await request.get(`products?page=${currentPage-1}&sort=${selected.key}`);
        } else {
          response = await request.get(`category/${id}?page=${currentPage-1}&sort=${selected.key}`);
        }

        console.log(response);
        setProducts(response.data.result);

        // Set total pages from API response
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        }
      } catch (e) {
        console.log("Lỗi ", e);
      }
    };
    fetch();
  }, [currentPage, id,selected]);

  // Pagination component
  

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };

  return (
    <div className="ml-3">
      <div className="flex justify-between mt-10 w-full">
        <div>Mới nhất</div>
        <div><SortDropdown sortOptions={sortOptions} handleSelect={handleSelect} open={open} selected={selected} setOpen={setOpen}/></div>
      </div>

      <div className="mt-5">
        {products && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-10 mb-12">
            {products.map((product, index) => (
              <div key={index} className="relative">
                <ProductItem
                  discountPercent={product.discountPercent}
                  id={product.id}
                  sizes={product.productSizeDTOS}
                  name={product.name}
                  price={product.price}
                  images={product.images}
                  soldCount={product.soldCount}
                />
                <div className="absolute top-0 left-0 bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-br-md">
                  NEW
                </div>
                {product.discountPercent
                  &&
                  <div className="absolute top-0 left-0 bg-red-700 text-white text-xs font-semibold px-2 py-1 rounded-br-3xl">
                      Best seller
                  </div>
                }
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination component */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Category;