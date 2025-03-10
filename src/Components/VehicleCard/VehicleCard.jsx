import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

function VehicleCard({ data }) {
    const { theme } = useTheme();
   
    return (
        <Link to={`/Vehicles/${data?.id}`}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
            className={`${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} rounded-xl shadow-md p-3 h-[14rem] flex flex-col gap-1 relative transition-all duration-300`}
        >
            <p className='text-[#2d9bff] font-medium'>{data?.title}</p>
            <p className={`font-medium ${theme === 'dark' ? "text-white" : "text-black"}`}>{data?.regNo}</p>
            <p className={`font-medium ${theme === 'dark' ? "text-white" : "text-black"}`}>{data?.plateNo}</p>
            <img src={data?.img} alt="" className='w-[17rem] lg:w-[18rem] xl:w-[17rem] absolute bottom-0 sm:bottom-2 right-0' />
        </motion.div>
        </Link>
    );
}

export default VehicleCard;
