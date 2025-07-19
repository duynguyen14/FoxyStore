import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";


function SortDropdown({sortOptions,open,handleSelect,selected,setOpen}) {
  const toggleDropdown = () => setOpen(!open);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-64 px-4 py-2 border border-gray-300 rounded-full text-gray-700 bg-white hover:shadow transition"
      >
        {selected.name}
        <FaChevronDown className="ml-2 text-sm" />
      </button>

      <div
        className={`absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg origin-top transition-all duration-300 ease-in-out transform ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <motion.ul className="py-1 text-gray-700"
        >
          {sortOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
            >
              {option.name}
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

export default SortDropdown;
