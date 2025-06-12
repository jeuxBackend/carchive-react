import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';

function InputField({ label, type = "text", value = {}, setValue, fieldKey, isNumber, isCapital }) {
  const { theme } = useTheme();

  const handleChange = (e) => {
    let inputValue = e.target.value;

    if (isNumber) {
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }

     if (isCapital) {
            inputValue = inputValue.toUpperCase();
        }

    if (fieldKey === "vinNumber") {
      inputValue = inputValue.toUpperCase().slice(0, 17);
    }

    setValue((prev) => ({ ...prev, [fieldKey]: inputValue }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center gap-2 w-full p-5 rounded-xl font-medium ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-[#f7f7f7] border border-[#e8e8e8]"}`}
    >
      <input
        type={type}
        placeholder={label}
        value={value[fieldKey] || ""}
        required
        onChange={handleChange}
        className={`flex-1 outline-none border-none font-medium ${theme === "dark" ? "text-white" : "text-black"}`}
      /> 
    </motion.div>
  );
}

export default InputField;
