import React from "react";

const CustomButton = ({ title, customClassname, onClick, type }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full flex items-center border-none justify-center px-10 py-2 
   ${customClassname}`}
    >
      {title}
    </button>
  );
};

export default CustomButton;
