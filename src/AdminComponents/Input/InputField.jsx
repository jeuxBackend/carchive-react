import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';
import { IoEye, IoEyeOff } from "react-icons/io5";

function InputField({label}) {
    const { theme } = useTheme();
    

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center gap-2 w-full p-3 rounded-xl font-medium ${theme === "dark" ? "bg-[#323335]" : "bg-[#f7f7f7] border border-[#e8e8e8]"}`}
        >
            <input
                type='text'
                placeholder={label}
                className={`flex-1 outline-none border-none font-medium ${theme === "dark" ? "text-white" : "text-black"}`}

            />
        </motion.div>
    );
}

export default InputField;
