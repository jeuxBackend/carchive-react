import React from 'react'

import { useTheme } from '../../Contexts/ThemeContext'
import { motion } from "framer-motion";

function GradientButton({name}) {
    const { theme } = useTheme()
    return (
        <div
            className={`relative w-full rounded-xl p-[1px] text-center flex items-center justify-center shadow-md ${theme === "dark"
                ? "bg-gradient-to-r from-[#434649] to-[#3172ad]"
                : "bg-gradient-to-r from-transparent to-[#3172ad]"
                }`}
        >
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}

                className={`w-full py-3 px-3 xl:text-[1rem] lg:text-[0.6rem] text- 2xl:px-4 flex justify-center items-center rounded-xl focus:outline-none ${theme === "dark" ? "bg-[#323334] text-white" : "bg-[#f7f7f7] text-black"
                    }`}
            >
                {name}
               
            </motion.div></div>
    )
}

export default GradientButton