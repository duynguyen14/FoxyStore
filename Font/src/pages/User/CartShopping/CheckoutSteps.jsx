
import React from "react";
import { useState, useEffect } from "react";

const steps = [
  { label: "Giỏ hàng", icon: "🛒" },
  { label: "Đặt hàng", icon: "📝" },
  { label: "Thanh toán", icon: "💳" },
  { label: "Hoàn thành", icon: "✅" },
];

const CheckoutSteps = ({ currentStep = 1 }) => {
  const [mounted, setMounted] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  
  return (
    <div className="w-full rounded-xl p-4 md:p-6 mb-6 md:mb-10 border border-gray-300 bg-white shadow-sm">
      {/* Progress line that fills based on current step */}
      <div className="relative mb-6 mt-3">
        <div className="absolute top-0 left-0 h-2 bg-gray-200 rounded-full w-full" />
        <div 
          className="absolute top-0 left-0 h-2 bg-blue-600 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="flex items-start justify-between relative">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div 
              key={index} 
              className={`flex flex-col items-center flex-1 text-center transition-all duration-300 ease-in-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Step indicator */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2
                  transition-all duration-300 ease-in-out transform
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-400 border border-gray-300"
                  }
                  ${isCurrent ? "scale-110 ring-4 ring-blue-100" : ""}
                `}
              >
                {isCompleted ? "✓" : step.icon}
              </div>
              
              {/* Label */}
              <span className={`
                font-medium text-xs sm:text-sm md:text-base
                ${isActive ? "text-blue-600" : "text-gray-500"}
              `}>
                {step.label}
              </span>
              
              {/* Step number - visible only on medium screens and up */}
              <span className={`
                hidden md:block text-xs mt-1
                ${isActive ? "text-blue-600" : "text-gray-400"}
              `}>
                Bước {stepNumber}/{steps.length}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;