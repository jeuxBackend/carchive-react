import React from 'react'

import { useTheme } from '../../Contexts/ThemeContext'
import { motion } from "framer-motion";
import { BeatLoader } from 'react-spinners';

function GradientButton({ name, handleClick, loading }) {
    const { theme } = useTheme()

    return (
        <div
            onClick={handleClick}
            className={`relative w-full rounded-xl p-[1px] text-center cursor-pointer flex items-center justify-center shadow-md ${theme === "dark"
                ? "bg-gradient-to-r from-[#434649] to-[#3172ad]"
                : "bg-[#ececec]"
                }`}
        >
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}

                className={`w-full py-3 px-3 xl:text-[1rem] lg:text-[0.6rem] text- 2xl:px-4 flex justify-center items-center rounded-xl focus:outline-none ${theme === "dark" ? "bg-[#323334] text-white" : "bg-[#323335] text-white"
                    }`}
            >
                {loading ? <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin"
                /> : name}

            </motion.div></div>
    )
}

export default GradientButton