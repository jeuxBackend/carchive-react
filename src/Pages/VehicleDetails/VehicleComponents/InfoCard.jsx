import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../../Contexts/ThemeContext'
import pic from "./assets/car2.png"

function InfoCard() {
    const { theme } = useTheme()

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`w-full rounded-xl p-5 ${theme === "dark" ? 'bg-[#323335]' : "bg-white border border-[#ececec]"} relative shadow-md`}
        >
            <div className='font-medium lg:h-[350px] '>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className={`${theme === "dark" ? 'text-white' : "text-black"} text-[1.3rem]`}
                >
                    Vehicle Make / Model
                </motion.p>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className='text-[#2D9BFF] text-[1.8rem]'
                >
                    M2 Competition
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className={`text-[9.5vw] sm:text-[10vw] md:text-[12vw] lg:text-[4.5vw] 2xl:text-[4.7vw] absolute bottom-0 z-10 text-outline ${theme === "dark" ? 'text-black' : "text-[#e4e4e4]"}`}
                >
                    M2 Competition
                </motion.p>
                <motion.img
                    src={pic}
                    alt=""
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className='z-20 relative w-[95%] lg:h-[260px] object-contain'
                />
            </div>
        </motion.div>
    )
}

export default InfoCard
