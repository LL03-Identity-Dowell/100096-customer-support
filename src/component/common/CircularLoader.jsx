import React from 'react';

const CircularLoader = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
};

export default CircularLoader;
