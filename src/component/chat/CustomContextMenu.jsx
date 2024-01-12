import React, { useEffect, useRef } from 'react';
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const CustomContextMenu = ({ x, y, onDelete, setContextMenuPosition, onEdit }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setContextMenuPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setContextMenuPosition]);

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-white border border-gray-300 rounded shadow w-24"
      style={{ top: y, left: x }}
    >
        <button onClick={onEdit} className="text-green-500 hover:text-green-700 flex items-center justify-between p-2 w-full">
          <span className='text-lg'>Edit</span>
          <FaEdit />
        </button>
        
        <button onClick={onDelete} className="text-red-500 hover:text-red-700 flex items-center justify-between p-2 w-full">
          <span className='text-lg'>Delete</span>
          <MdDeleteForever />
        </button>
    </div>
  );
};

export default CustomContextMenu;
