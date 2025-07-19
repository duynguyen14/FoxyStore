import React, { useState, useEffect } from 'react';
import { Plus, } from 'lucide-react';
import ProductTable from './ProductTable';
import SumaryProduct from './SumaryProduct';
import FilterProduct from './FilterProduct';
import Pagination from './Pagination';
import ModelProduct from './ModelProduct';
import { request } from "../../../untils/request.js"
const ProductManagement = () => {
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilter, setIsfilter] = useState(false);
  const [summaryProduct, setSummaryProduct] = useState();
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    searchTerm: '',
    minPrice: '',
    maxPrice: '',
    categoryId: ''
  })
  const [images, setImages] = useState(null);
  // console.log(params.searchTerm)
  const [totalPages, setTotalPages] = useState(0); // Example total pages
  const [product, setProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    oldImageNames: [],
    sizeIds: [],
    categoryId: '',
  });
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const response = await request.get(`products/search?page=${params.page - 1}&size=10&minPrice=${params.minPrice}&maxPrice=${params.maxPrice}&name=${params.searchTerm}&categoryId=${params.categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setTotalPages(response.data.result.totalPages)
      setProducts(response.data.result.content)
    }
    fetch()
  }, [params])
  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await request.get("products/summary", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setSummaryProduct(response.data.result);
      }
      catch (e) {
        console.log("error", e)
      }
    }
    fetch()
  }, [])
  const handlePageChange = (pageNumber) => {
    setParams(pre => ({ ...pre, page: pageNumber }))
    window.scrollTo(0, 0); // Scroll to top when changing page
  };
  const handleOnclickFilter = () => {
    setIsfilter(!isFilter)
    setParams({
      page: 1,
      searchTerm: '',
      minPrice: '',
      maxPrice: '',
      categoryId: ''
    })
  }
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'images') {
      setImages(Array.from(files));
    } else if (name === 'sizes') {
      const id = parseInt(value)
      const updatedSizes = checked
        ? [...(product.sizeIds || []), id]
        : product.sizeIds.filter((s) => s !== id);

      setProduct((prev) => ({ ...prev, sizeIds: updatedSizes }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };
  const openAddModal = () => {
    setEditingProduct(null);
    setProduct({
      name: '',
      price: '',
      quantity: '',
      description: '',
      oldImageNames: [],
      categoryId: ''
    });
    setIsModalOpen(true);
  };

  // Mở modal sửa sản phẩm
  const openEditModal = (product) => {
    setEditingProduct(product);
    setProduct({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      description: product.description,
      sizeIds: product.sizes,
      oldImageNames: product.images,
      categoryId: product.categoryId,
    });
    setIsModalOpen(true);
  };
  const handleOnclickRemoveImage = (item) => {
    const newImages = product.oldImageNames.filter(image => image != item);
    setProduct(pre => ({ ...pre, oldImageNames: newImages }))
    setImagesToDelete([...imagesToDelete, item])
  }
  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImages([]);
    setProduct({
      name: '',
      price: '',
      quantity: '',
      description: '',
      oldImageNames: [],
      categoryId: '',
      sizeIds: [],
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.quantity) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    try {
      const formData = new FormData();
    formData.append("product", JSON.stringify(product));
    if (images && images.length > 0) {
      images.forEach(file => {
        formData.append("images", file);
      });
    }
    console.log(formData)
      if (editingProduct) {
        const response = await request.put(`products/${editingProduct.productId}`,
          formData
          , {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            }
          })
        // console.log(response.data.result)

        setProducts(prev => prev.map(p =>
          p.productId === editingProduct.productId
            ? response.data.result
            : p
        ));
      } else {
        const newProduct={
          name: product.name,
          price: product.price,
          description: product.description,
          quantity: product.quantity,
          categoryId: product.categoryId,
          sizeIds: product.sizeIds
        }
        const formData =new FormData();
        formData.append("product",JSON.stringify(newProduct))
        if(images && images.length>0){
          images.forEach(file=>{
            formData.append("images",file)
          })
        }
        const response = await request.post("products",formData,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        console.log(response.data)
        setProducts(prev => [...prev,response.data.result ]);
        // Thêm sản phẩm mới
      }

    }
    catch (e) {
      console.log("error", e)
    }

    closeModal();
  };
  console.log("new images: ", images)
  // Xóa sản phẩm
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }
    try {
      const response = await request.delete(`products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      })
      console.log(response.data);
      setProducts(prev => prev.filter(product => product.productId !== productId));
      alert("Xoá sản phẩm thành công")

    }
    catch (e) {
      console.log("error", e)
    }
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <p className='text-3xl font-semibold'>Quản lý sản phẩm</p>
        <SumaryProduct products={products} formatPrice={formatPrice} summaryProduct={summaryProduct} />
        <FilterProduct
          isFilter={isFilter}
          handleOnclickFilter={handleOnclickFilter}
          categorys={summaryProduct ? summaryProduct.categories : []}
          params={params}
          setParams={setParams}
        />
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-600 mt-1 font-semibold text-base md:text-2xl">Danh sách sản phẩm</p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Thêm Sản Phẩm
            </button>
          </div>
        </div>
        <ProductTable
          products={products}
          isModalOpen={isModalOpen}
          formatPrice={formatPrice}
          openEditModal={openEditModal}
          handleDeleteProduct={handleDeleteProduct}
          searchTerm={searchTerm}
        />
        <Pagination
          currentPage={params.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        {/* Statistics */}

      </div>

      {/* Modal */}
      {isModalOpen && (
        <ModelProduct
          closeModal={closeModal}
          handleSaveProduct={handleSaveProduct}
          handleInputChange={handleInputChange}
          product={product}
          images={images}
          handleOnclickRemoveImage={handleOnclickRemoveImage}
          categories={summaryProduct ? summaryProduct.categories : []}
          sizes={summaryProduct ? summaryProduct.sizes : []}
          editingProduct={editingProduct} />
      )}
    </div>
  );
};

export default ProductManagement;