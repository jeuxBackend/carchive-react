import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';
import { IoEye, IoEyeOff } from "react-icons/io5";

function DetailDiv({ label, value }) {
    const { theme } = useTheme();
    const [showPass, setShowPass] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex items-center gap-2 w-full p-3 rounded-xl ${theme === "dark" ? "bg-[#323335]" : "bg-[#f7f7f7] border border-[#e8e8e8]"}`}
        >
            {label && <p className={`${theme === "dark" ? "text-[#7f8082]" : "text-[#bcbcbd]"} text-[0.7rem] sm:text-[1.2rem]`}>{label}:</p>}
            
            <input
                type="text"
                value={value}
                className={` outline-none border-none flex-1 ${theme === "dark" ? "text-white" : "text-black"}`}

            />
            
            
        </motion.div>
    );
}

export default DetailDiv;
