import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import AddressList from "./AddressList";
import AddressFormModal from "./AddressFormModal";
import EditAddressModal from "./EditAddressModal";
import {request} from "../../../untils/request.js"
import { useNavigate } from "react-router-dom";
export default function Address() {
  const token =localStorage.getItem("token");
  const [addresses, setAddresses] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const navigate =useNavigate();
  useEffect(()=>{
    const fetch= async()=>{
      if(!token){
        alert("Phiên của bạn đã hết hạn vui lòng đăng nhập lại")
        navigate("/login");
      }
      try{
        const response =await request.get("address",{
          headers :{
            Authorization : `Bearer ${token}`
          }
        })
        // console.log(response);
        setAddresses(response.data.result)
      }
      catch(e){
        console.log("loi",e)
      }
    }
    fetch()
  },[])
  const handleEditAddress = (address) => {
    setEditAddress({
      id: address.id,
      name: address.name,
      phoneNumber: address.phoneNumber,
      city: address.city,
      detailAddress: address.detailedAddress, // mapping đúng key
      street: address.street,
      isDefault: address.isDefault,
    });
    setShowEditModal(true);
  };
  // console.log(editAddress)
  const handleSaveEditAddress = async() => {
    try{
      const response =await request.patch("address",editAddress,
        {
          headers :{
            Authorization :`Bearer ${token}`
          }
        }
      )
      // console.log(response)
      alert("Cập nhật địa chỉ thành công")
      setAddresses(prev =>
        prev.map(addr =>
          addr.id === editAddress.id
            ? {
              ...editAddress,
              isDefault: editAddress.isDefault
            }
            : {
              ...addr,
              isDefault: editAddress.isDefault ? false : addr.isDefault
            }
        )
      );
      setShowEditModal(false);

    }
    catch(e){
      console.log("error ",e)
    }
  };
  const [showAddModal, setShowAddModal] = useState(false);
  const handleAddAddress = async(newAddress) => {
    console.log(newAddress.isDefault)
    try{

      const response = await request.post("address",newAddress,{
        headers :{
          Authorization : `Bearer ${token}`
        }
      })
      alert("Thêm địa chỉ thành công")
      // console.log(response);
      setAddresses(response.data.result)
      // setAddresses([...addresses, newAddress]);
      setShowAddModal(false);
    }
    catch (e){
      console.log("error",e)
    }
  };

  const deleteAddress = async(id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá địa chỉ này")) {
      return
    }
    try{
      const response =await request.delete(`address/${id}`,{
        headers :{
          Authorization :`Bearer ${token}`
        }
      })
      // console.log(response)
      setAddresses(response.data.result)
      // setAddresses(addresses.filter(addr => addr.id !== id));
      alert("Xoá địa chỉ thành công");

    }
    catch(e){
      console.log("error ",e)
    }
  };

  const setDefaultAddress = async(address) => {
    if (!window.confirm("Bạn chắc chắn muốn thiết lập địa chỉ này mặc định")) {
      return;
    }
    try{
      const response = await request.patch("address",{
        id: address.id,
        name: address.name,
        detailAddress: address.detailAddress,
        phoneNumber: address.phoneNumber,
        city: address.city,
        isDefault:true,
      },{
        headers :{
          Authorization :`Bearer ${token}`
        }
      })
      // console.log(response);
      alert("Thiết lập địa chỉ mặc định thành công")
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === address.id
      })));
    }
    catch(e){
      console.log("error",e)
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-20 max-w-6xl mx-auto bg-white rounded-lg mt-10">
  <div className="flex flex-col-2  justify-between items-start sm:items-center mb-6 gap-4">
    <h1 className="text-base md:text-xl font-bold text-gray-800">
      Địa chỉ của tôi
    </h1>
    <button
      onClick={() => setShowAddModal(true)}
      className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
    >
      <Plus className="text-base md:text-xl w-2 h-4 sm:w-5 sm:h-5 mr-2" />
      <span>Thêm địa chỉ mới</span>
    </button>
  </div>

  {addresses&&addresses.length <= 0 && (
    <div className="text-center text-base sm:text-lg lg:text-xl">
      <p>Chưa có địa chỉ nào được thiết lập</p>
    </div>
  
  )}
  <AddressList
    addresses={addresses}
    deleteAddress={deleteAddress}
    setDefaultAddress={setDefaultAddress}
    editAddress={handleEditAddress}
  />


  {showAddModal && (
    <AddressFormModal
      onClose={() => setShowAddModal(false)}
      onSave={handleAddAddress}
    />
  )}
  {showEditModal && (
    <EditAddressModal
      address={editAddress}
      onClose={() => setShowEditModal(false)}
      onChange={(updated) => setEditAddress(updated)}
      onSave={handleSaveEditAddress}
    />
  )}
</div>
  );
}
