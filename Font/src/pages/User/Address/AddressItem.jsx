import { Pencil, Trash2, Star, MapPin, Phone, User, Home } from 'lucide-react';

export default function AddressItem({ address, onDelete, onSetDefault, onEdit }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 mb-4 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
        {/* Address Information */}
        <div className="flex-1 space-y-4">
          {/* Name and Phone */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{address.name}</h3>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-green-500" />
              <span className="font-medium">{address.phoneNumber}</span>
            </div>
          </div>
           
          {/* Address Information with Icons */}
          <div className="space-y-3 ml-2">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full mt-0.5">
                <MapPin className="w-3 h-3 text-orange-600" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-gray-700 leading-relaxed font-medium">{address.city}</p>
                <p className="text-gray-600 leading-relaxed text-sm">{address.detailAddress}</p>
              </div>
            </div>
          </div>
           
          {/* Default Badge */}
          {address.isDefault && (
            <div className="pt-2">
              <span className="inline-flex items-center px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 rounded-full shadow-sm">
                <Star className="w-4 h-4 mr-2 fill-blue-500 text-blue-500" />
                <Home className="w-3 h-3 mr-1" />
                Địa chỉ mặc định
              </span>
            </div>
          )}
        </div>
         
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:items-end xl:items-center gap-3">
          {/* Action Links */}
          <div className="flex gap-3 order-2 sm:order-1 lg:order-2 xl:order-1">
            <button
              className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 cursor-pointer px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={onEdit}
            >
              <Pencil className="w-4 h-4" />
              Cập nhật
            </button>
            {!address.isDefault && (
              <button
                onClick={onDelete}
                className="flex items-center gap-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 cursor-pointer px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Trash2 className="w-4 h-4" />
                Xoá
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Set Default Button */}
      <div className='mt-6 pt-4 border-t border-gray-100'>
        {!address.isDefault && (
          <button
            onClick={onSetDefault}
            className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 hover:border-gray-400 hover:from-gray-100 hover:to-gray-200 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center w-5 h-5 bg-yellow-100 rounded-full">
              <Star className="w-3 h-3 text-yellow-600" />
            </div>
            <Home className="w-4 h-4" />
            Thiết lập mặc định
          </button>
        )}
      </div>
    </div>
  );
}