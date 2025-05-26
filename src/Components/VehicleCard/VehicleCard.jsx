import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../../Contexts/GlobalContext';

function VehicleCard({ data }) {
    const { theme } = useTheme();
    const { vehicle, setVehicle } = useGlobalContext();

    const getCardBackgroundColor = () => {
        if (data?.expired === '1') {
            return 'bg-red-100 border-red-600 border-2'; 
        } else if (data?.month_expiry === '1') {
            return 'bg-yellow-100 border-yellow-600 border-2'; 
        } else {
            return theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]";
        }
    };

    const getTextColor = () => {
        if (data?.expired === '1' || data?.month_expiry === '1') {
            return 'text-black'; 
        } else {
            return theme === 'dark' ? "text-white" : "text-black";
        }
    };

    return (
        <Link to={`/Vehicles/${data?.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => setVehicle(data)}
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
                className={`${getCardBackgroundColor()} rounded-xl shadow-md p-3 h-[14rem] flex flex-col gap-1 relative transition-all duration-300`}
            >
                <p className='text-[#2d9bff] font-medium'>{data?.make}</p>
                <p className={`font-medium ${getTextColor()}`}>{data?.vinNumber}</p>
                <p className={`font-medium ${getTextColor()}`}>{data?.numberPlate}</p>
                <img src={data?.image ? data?.image[0] : ""} alt="" className='w-[17rem] lg:w-[18rem] xl:w-[17rem] absolute bottom-0 sm:bottom-2 right-0' />
            </motion.div>
        </Link>
    );
}

export default VehicleCard;