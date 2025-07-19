// components/CheckoutProgress.jsx
import React from 'react';

const CheckoutProgress = ({ currentStep }) => {
  const steps = ['Giỏ hàng', 'Đặt hàng', 'Thanh toán', 'Hoàn thành đơn'];

  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center justify-between relative">
        {/* Line behind */}
        <div className="absolute top-[10px] left-0 w-full h-[3px] bg-gray-200 z-0"></div>

        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center z-10 relative">
            {/* Circle */}
            <div
              className={`w-5 h-5 mx-auto rounded-full 
              ${index <= currentStep ? 'bg-black' : 'bg-white border-[2px] border-gray-300'}`}
            ></div>

            {/* Label */}
            <div className="mt-2 text-sm font-medium text-gray-800">
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;
