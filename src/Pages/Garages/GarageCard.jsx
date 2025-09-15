import React, { useState } from 'react'
import { useTheme } from '../../Contexts/ThemeContext'
import { motion } from 'framer-motion'
import { useGlobalContext } from '../../Contexts/GlobalContext'


function GarageCard({ data, setOpen, setGarageId }) {
    const { theme } = useTheme()
    console.log("data:", data)


    return (
        <motion.div
            
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-xl shadow-lg transition-all
            ${theme === "dark" ? "bg-[#323335] border-2 border-[#323335]" : "bg-white border-2 border-[#ECECEC]"}`}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="h-[200px] relative w-full bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${data?.garages?.image})` }}
                onClick={function () {
                setOpen(true);
                setGarageId(data?.grage_id);
            }}
            >
                <div className="bg-gradient-to-b from-transparent to-black/80 w-full h-full absolute rounded-xl top-0" />
                <p className='text-[1.4rem] font-medium bottom-3 absolute left-3 text-white'>{data?.garages?.name}</p>
                
            </motion.div>

        </motion.div>
    )
}

export default GarageCard
