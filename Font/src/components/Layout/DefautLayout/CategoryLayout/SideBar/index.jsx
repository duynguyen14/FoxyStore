import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { RiSubtractLine } from "react-icons/ri";

function Sidebar() {
  const [open, setOpen] = useState(new Set());

  const toggle = (name) => {
    setOpen((prev) => {
      const newSet = new Set(prev);
      newSet.has(name) ? newSet.delete(name) : newSet.add(name);
      return newSet;
    });
  };

  const filters = [
    {
      name: "Size",
      submenu: [
        { label: "S" },
        { label: "M" },
        { label: "L" },
        { label: "XL" },
      ],
    },
    {
      name: "Màu sắc",
      submenu: [
        { label: "Đen" },
        { label: "Trắng" },
        { label: "Xanh" },
      ],
    },
    {
      name: "Mức giá",
      submenu: [
        { label: "100.000đ", value: 100000 },
        { label: "500.000đ", value: 500000 },
        { label: "1.000.000đ", value: 1000000 },
        { label: "2.000.000đ", value: 2000000 },
      ],
    },
    
    {
      name: "Nâng cao",
      submenu: [],
    },
  ];

  return (
    <div className=''>
      <p className='text-base text-gray-400 mb-6'>
        Trang chủ – <span className='text-gray-700 font-medium'>NEW ARRIVAL</span>
      </p>

      <div className='space-y-6 mt-16'>
        {filters.map((filter, i) => (
          <div key={i}>
            <div
              onClick={() => toggle(filter.name)}
              className='flex justify-between items-center cursor-pointer text-base text-gray-700 mr-4'
            >
              {filter.name}
              {open.has(filter.name) ? <RiSubtractLine /> : <FaPlus />}
            </div>

            {open.has(filter.name) && filter.submenu.length > 0 && (
              <ul className='mt-2 ml-4 text-xs text-gray-500 grid grid-cols-2 space-x-6 space-y-2 '>
                {filter.submenu.map((item, idx) => (
                  <li
                    key={idx}
                    className='text-center' 
                  >
                    <p className='cursor-pointer p-2 mx-3 border rounded-md hover:bg-gray-100 w-20 '>
                       {item.label}

                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Nút lọc */}
      <div className='mt-10 flex gap-4'>
        <button className=' px-6 py-2 btn-secondary text-base'>LỌC</button>
      </div>
    </div>
  );
}

export default Sidebar;
