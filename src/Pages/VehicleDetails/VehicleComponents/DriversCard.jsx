import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../../Contexts/ThemeContext'
import pic from "./assets/p1.png"
import GradientButton from '../../../Components/Buttons/GradientButton'
import chat from "./assets/message.png"

function DriversCard() {
    const { theme } = useTheme()

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`w-full rounded-xl p-2 sm:p-4 ${theme === "dark" ? 'bg-[#323335]' : "bg-white border border-[#ececec]"} relative shadow-md min-h-[390px]`}
        >
            <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`${theme === "dark" ? 'text-white' : "text-black"} text-[1.3rem] font-medium`}
            >
                Driver's
            </motion.p>

            <div className='flex flex-col gap-3 justify-between mt-2 lg:min-h-[250px]'>
                {Array.from({ length: 3 }).map((_, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ delay: 0.2 * index, duration: 0.5 }}
                        className={`${theme === "dark" ? 'bg-[#1b1c1e]' : "bg-[#f7f7f7]"} p-4 rounded-lg flex items-center justify-between 2xl:flex-row flex-col sm:flex-row lg:flex-row gap-3 h-full`}
                    >
                        <div className='flex items-center gap-3'>
                            <motion.img
                                src={pic}
                                alt=""
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 * index, duration: 0.5 }}
                                className='h-[2rem] w-[2rem] xl:w-[3rem] xl:h-[3rem] 2xl:w-[4rem] 2xl:h-[4rem] rounded-full'
                            />
                            <div>
                                <motion.p 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: 0.3 * index, duration: 0.5 }}
                                    className={`${theme === "dark" ? 'text-white' : "text-black"} font-medium lg:text-[0.9rem] 2xl:text-[1.1rem]`}
                                >
                                    Cameron Williamson
                                </motion.p>
                                <motion.p 
                                    initial={{ opacity: 0, x: -20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: 0.4 * index, duration: 0.5 }}
                                    className={`${theme === "dark" ? 'text-white' : "text-black"} font-medium text-[0.6rem] lg:text-[0.5rem] 2xl:text-[0.9rem]`}
                                >
                                    kenzi.lawson@example.com
                                </motion.p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 * index, duration: 0.5 }}
                            >
                                <GradientButton name="Un-Assign Vehicle" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                transition={{ delay: 0.6 * index, duration: 0.5 }}
                                className='bg-[#2D9BFF] p-2 rounded-xl w-[3rem] h-[3rem] flex items-center justify-center'
                            >
                                <img src={chat} alt="" />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export default DriversCard
