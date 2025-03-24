import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../Contexts/ThemeContext';

function LogCard(logsData) {
  const { theme } = useTheme()
  return (
    <motion.div
      className={`rounded-xl w-[100%] p-5  shadow 
                    ${theme === "dark" ? "bg-[#323335] border-[#323335]" : "bg-white border-[#ECECEC]"}`}
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className='w-full flex items-center justify-center'>
        <p className={`text-[1.3rem] font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>View Logs</p>
      </div>
      <div>
        <div>
          <p className={`text-[#777e90] font-medium text-[1.2rem]`}>Start Time:</p>
          <p className={`${theme==="dark"?"text-white":"text-black"}`}></p>
        </div>
      </div>
    </motion.div>
  )
}

export default LogCard