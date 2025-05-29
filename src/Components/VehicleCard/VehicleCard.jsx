import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../Contexts/GlobalContext';
import { useTranslation } from "react-i18next";


function VehicleCard({ data, navigable = true, onCardClick }) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const { setVehicle } = useGlobalContext();

    const safeString = (value) => value && value !== null && value !== undefined ? String(value).trim() : '';
    const hasValue = (value) => value !== null && value !== undefined && String(value).trim() !== '';

    const vehicleId = safeString(data?.id) || '0';
    const vehicleMake = safeString(data?.make) || 'Unknown Make';
    const vehicleVin = safeString(data?.vinNumber) || 'No VIN Available';
    const vehiclePlate = safeString(data?.numberPlate) || 'No Plate Number';

    const getVehicleImage = () => {
        if (data?.image && Array.isArray(data.image) && data.image.length > 0 && hasValue(data.image[0])) {
            return data.image[0];
        }
        return '';
    };

    const renderExpiryBadge = () => {
        if (hasValue(data?.expired) && data.expired === '1') {
            return (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md z-10">
                    {t('expired')}
                </div>
            );
        } else if (hasValue(data?.month_expiry) && data.month_expiry === '1') {
            return (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold shadow-md z-10">
                    {t('expires_soon')}
                </div>
            );
        }
        return null;
    };

    const handleCardClick = () => {
        setVehicle(data);
        if (!navigable && typeof onCardClick === 'function') {
            onCardClick(data);
        }
    };

    const cardContent = (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleCardClick}
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
            className={`${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} rounded-xl shadow-md p-3 h-[18rem] md:h-[14.5rem] flex flex-col gap-1 relative transition-all duration-300 cursor-pointer`}
        >
            {renderExpiryBadge()}
            <p className='text-[#2d9bff] font-medium'>{vehicleMake}</p>
            <p className={`font-medium ${theme === 'dark' ? "text-white" : "text-black"}`}>{vehicleVin}</p>
            <p className={`font-medium ${theme === 'dark' ? "text-white" : "text-black"}`}>{vehiclePlate}</p>
            {getVehicleImage() && (
                <img
                    src={getVehicleImage()}
                    alt={`${vehicleMake} vehicle`}
                    className='w-[17rem] lg:w-[18rem] xl:w-[17rem] h-[10.5rem] absolute bottom-0 sm:bottom-2 right-0 border-none'
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            )}
        </motion.div>
    );

    return navigable ? (
        <Link to={`/Vehicles/${vehicleId}`}>
            {cardContent}
        </Link>
    ) : cardContent;
}

export default VehicleCard;
