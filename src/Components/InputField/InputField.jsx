import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';
import { IoEye, IoEyeOff } from "react-icons/io5";

function InputField({ label, type = "text" }) {
    const { theme } = useTheme();
    const [showPass, setShowPass] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center gap-2 w-full p-3 rounded-xl font-medium ${theme === "dark" ? "bg-[#323335]" : "bg-[#f7f7f7] border border-[#e8e8e8]"}`}
        >
            {label && <p className={`${theme === "dark" ? "text-[#7f8082]" : "text-[#bcbcbd]"} text-[0.7rem] sm:text-[1.2rem]`}>{label}:</p>}
            
            <input
                type={type === "password" ? (showPass ? "text" : "password") : type}
                className={`${label === "Confirm Password" ? "w-[57%] sm:flex-1" : label === "Password" ? "sm:flex-1 w-[75%]" : "w-["} outline-none border-none font-medium ${theme === "dark" ? "text-white" : "text-black"}`}

            />
            
            {type === "password" && (
                showPass
                    ? <IoEyeOff onClick={() => setShowPass(!showPass)} className='text-[1.5rem] text-[#787e91] cursor-pointer' />
                    : <IoEye onClick={() => setShowPass(!showPass)} className='text-[1.5rem] text-[#787e91] cursor-pointer' />
            )}
        </motion.div>
    );
}

export default InputField;
