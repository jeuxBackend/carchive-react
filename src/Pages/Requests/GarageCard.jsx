import React from 'react'
import { useTheme } from '../../Contexts/ThemeContext'
import GradientButton from '../../Components/Buttons/GradientButton'
import RequestButton from '../../Components/Buttons/RequestButton'
import { motion } from 'framer-motion'

function GarageCard({ data }) {
    const { theme } = useTheme()

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
                className="h-[200px] relative w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${data?.bg})` }}
            >
                <div className="bg-gradient-to-b from-transparent to-black/80 w-full h-full absolute rounded-xl top-0" />
                <p className='text-[1.4rem] font-medium bottom-3 absolute left-3 text-white'>Leslie Alexander</p>
            </motion.div>
            <div className="mt-4 flex gap-4 sm:flex-row flex-col">
               
                    <GradientButton name='Reject' />
               
                    <RequestButton name="Accept" />
               
            </div>
        </motion.div>
    )
}

export default GarageCard
