import React from 'react'
import { useTheme } from '../../Contexts/ThemeContext'
import { motion } from "framer-motion";
function RequestButton({ name,  handleClick, loading }) {
    const { theme } = useTheme()
    return (
       
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              
                onClick={handleClick}
                className={`w-full py-3 px-3 xl:text-[1rem] lg:text-[0.6rem] text-center 2xl:px-4 flex justify-center items-center rounded-xl focus:outline-none ${theme === "dark" ? "bg-[#479cff] text-white" : "bg-[#479cff] text-white "
                    }`}
            >
                {loading ? <motion.div
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin"
                                /> : name}

            </motion.button>
    )
}

export default RequestButton