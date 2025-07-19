import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Home, Building2, X, Check } from 'lucide-react'
function ListAddressPopUp({ addresses, onClose, onSelect }) {
  const [selectedAddress, setSelectedAddress] = useState(null)

  const handleSelectAddress = (address) => {
    setSelectedAddress(address)
    onSelect(address)
  }

  const getAddressIcon = (city) => {
    if (city === "Nhà riêng" || !city) {
      return <Home className="w-5 h-5 text-blue-600" />
    }
    return <Building2 className="w-5 h-5 text-green-600" />
  }

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Lớp nền mờ */}
      <div className="absolute inset-0 bg-secondary opacity-70" onClick={onClose}></div>
      
      {/* Nội dung chính */}
      <motion.div 
        className="relative bg-white rounded-2xl shadow-2xl z-10 w-[95%] max-w-3xl max-h-[85vh] flex flex-col"
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Chọn địa chỉ giao hàng
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Address List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                className={`relative border-2 rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-300 ${
                  selectedAddress?.id === address.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md hover:bg-gray-50'
                }`}
                onClick={() => handleSelectAddress(address)}
                whileHover={{ scale: selectedAddress?.id === address.id ? 1.02 : 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Selection Indicator */}
                {selectedAddress?.id === address.id && (
                  <motion.div
                    className="absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                )}

                {/* Address Content */}
                <div className="space-y-3">
                  {/* Name and Type */}
                  <div className="flex items-center gap-3">
                    {getAddressIcon(address.city)}
                    <div className="flex-1">
                      <p className="font-bold text-base sm:text-lg text-gray-800">
                        {address.name}
                      </p>
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm font-medium mt-1">
                        {address.city || "Nhà riêng"}
                      </span>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm sm:text-base">SĐT: {address.phoneNumber}</p>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3 text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p className="text-sm sm:text-base leading-relaxed">
                      Địa chỉ: {address.detailAddress}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-colors duration-200 text-sm sm:text-base"
              onClick={onClose}
            >
              Hủy
            </button>
            {/* <button
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                selectedAddress
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => selectedAddress && onClose()}
              disabled={!selectedAddress}
            >
              Xác nhận địa chỉ
            </button> */}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
export default ListAddressPopUp
