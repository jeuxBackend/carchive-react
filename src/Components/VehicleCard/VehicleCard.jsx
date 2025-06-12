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
    const vehicleModel = safeString(data?.model) || 'Unknown Model';
    const vehicleVin = safeString(data?.vinNumber) || 'No VIN Available';
    const vehiclePlate = safeString(data?.numberPlate) || 'No Plate Number';
    const vehicleMileage = safeString(data?.mileage) || 'No Mileage Available';
    const vehicleYear = safeString(data?.year) || '';

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
            whileHover={{ scale: 1.02, boxShadow: "0px 8px 25px rgba(0,0,0,0.15)" }}
            className={`${
                theme === "dark" 
                    ? "bg-gradient-to-br from-[#323335] to-[#2a2b2d] border border-gray-700/30" 
                    : "bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/60"
            } rounded-xl shadow-lg hover:shadow-xl p-4 h-[20rem] md:h-[16rem] flex flex-col gap-2 relative transition-all duration-300 cursor-pointer backdrop-blur-sm`}
        >
            {renderExpiryBadge()}
            
            {/* Vehicle Title */}
            <div className="flex flex-col gap-1 mb-2">
                <h3 className='text-[#2d9bff] font-semibold text-lg tracking-tight'>
                    {vehicleMake} {vehicleModel}
                    {vehicleYear && <span className="text-sm ml-1 opacity-80">({vehicleYear})</span>}
                </h3>
            </div>

            {/* Vehicle Details */}
            <div className="flex flex-col gap-2 text-sm">
                <div className="flex flex-col gap-1">
                    <span className={`text-xs font-medium uppercase tracking-wide ${
                        theme === 'dark' ? "text-gray-400" : "text-gray-500"
                    }`}>
                        {t('vin_number') || 'VIN Number'}
                    </span>
                    <p className={`font-medium ${
                        theme === 'dark' ? "text-gray-200" : "text-gray-800"
                    }`}>
                        {vehicleVin}
                    </p>
                </div>

                <div className="flex flex-col gap-1">
                    <span className={`text-xs font-medium uppercase tracking-wide ${
                        theme === 'dark' ? "text-gray-400" : "text-gray-500"
                    }`}>
                        {t('number_plate') || 'License Plate'}
                    </span>
                    <p className={`font-medium ${
                        theme === 'dark' ? "text-gray-200" : "text-gray-800"
                    }`}>
                        {vehiclePlate}
                    </p>
                </div>

                <div className="flex flex-col gap-1">
                    <span className={`text-xs font-medium uppercase tracking-wide ${
                        theme === 'dark' ? "text-gray-400" : "text-gray-500"
                    }`}>
                        {t('mileage') || 'Mileage'}
                    </span>
                    <p className={`font-medium ${
                        theme === 'dark' ? "text-gray-200" : "text-gray-800"
                    }`}>
                        {vehicleMileage}
                    </p>
                </div>
            </div>

            {/* Vehicle Image */}
            {getVehicleImage() && (
                <div className="absolute bottom-0 right-0 overflow-hidden rounded-br-xl">
                    <img
                        src={getVehicleImage()}
                        alt={`${vehicleMake} ${vehicleModel} vehicle`}
                        className='w-[15rem] lg:w-[16rem] xl:w-[15rem] h-[9rem] object-cover opacity-100 transition-opacity duration-300'
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    
                </div>
            )}

           
        </motion.div>
    );

    return navigable ? (
        <Link to={`/Vehicles/${vehicleId}`} className="block">
            {cardContent}
        </Link>
    ) : cardContent;
}

export default VehicleCard;