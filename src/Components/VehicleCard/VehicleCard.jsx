import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../../Contexts/GlobalContext';

function VehicleCard({ data }) {
    const { theme } = useTheme();
    const { vehicle, setVehicle } = useGlobalContext();

   

    const renderExpiryBadge = () => {
        if (data?.expired === '1') {
            return (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md z-10">
                    EXPIRED
                </div>
            );
        } else if (data?.month_expiry === '1') {
            return (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold shadow-md z-10">
                    EXPIRES SOON
                </div>
            );
        }
        return null;
    };

    return (
        <Link to={`/Vehicles/${data?.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => setVehicle(data)}
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
                className={`${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} rounded-xl shadow-md p-3 h-[18rem] md:h-[14.5rem] flex flex-col gap-1 relative transition-all duration-300`}
            >
                {renderExpiryBadge()}
                <p className='text-[#2d9bff] font-medium'>{data?.make}</p>
                <p className={`font-medium ${theme === 'dark' ? "text-white" : "text-black"}`}>{data?.vinNumber}</p>
                <p className={`font-medium ${theme === 'dark' ? "text-white" : "text-black"} `}>{data?.numberPlate}</p>
                <img src={data?.image ? data?.image[0] : ""} alt="" className='w-[17rem] lg:w-[18rem] xl:w-[17rem] h-[10.5rem] absolute bottom-0 sm:bottom-2 right-0 border-none' />
            </motion.div>
        </Link>
    );
}

export default VehicleCard;