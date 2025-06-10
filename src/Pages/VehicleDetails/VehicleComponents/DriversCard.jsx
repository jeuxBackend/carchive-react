import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../../Contexts/ThemeContext'
import pic from "./assets/p1.png"
import GradientButton from '../../../Components/Buttons/GradientButton'
import chat from "./assets/message.png"
import NoDataFound from '../../../GlobalComponents/NoDataFound/NoDataFound'
import { FaUserSlash } from 'react-icons/fa'
import { CiCirclePlus } from 'react-icons/ci'
import { unassignDriver } from '../../../API/portalServices'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { initializeChat } from '../../../utils/ChatUtils'
import { useGlobalContext } from '../../../Contexts/GlobalContext'
import { useTranslation } from 'react-i18next';

function DriversCard({ data, setOpen, fetchVehicleData }) {
    const { t } = useTranslation();
    const { theme } = useTheme()
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUserId } = useGlobalContext()

    const handleUnassign = async (driverId) => {
        setLoading(true);
        try {
            const response = await unassignDriver(data?.id, driverId);
            if (response.data) {
                toast.success("Driver Unassigned Successfully");
                fetchVehicleData()
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`w-full rounded-xl p-3 sm:p-4 ${theme === "dark" ? 'bg-[#323335]' : "bg-white border border-[#ececec]"} relative shadow-md min-h-[350px] sm:min-h-[390px]`}
        >
            {/* Header */}
            <div className='flex items-center justify-between mb-3 sm:mb-4'>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className={`${theme === "dark" ? 'text-white' : "text-black"} text-lg sm:text-xl lg:text-[1.3rem] font-medium`}
                >
                    {t('drivers_possessive')}
                </motion.p>
                
                {/* Add Driver Button */}
                <motion.div 
                    onClick={() => setOpen(true)} 
                    className='flex items-center cursor-pointer gap-1 sm:gap-2 py-2 px-2 sm:px-3 rounded bg-[#2d9bff] text-white hover:bg-[#1a7fd6] transition-colors'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <CiCirclePlus className='text-lg sm:text-xl' />
                    <span className='text-xs sm:text-sm hidden xs:block'>
                        {t('assign_driver')}
                    </span>
                </motion.div>
            </div>

            {/* Drivers List or No Data */}
            {data?.drivers?.length > 0 ? (
                <div className='space-y-3 overflow-auto max-h-[280px] sm:max-h-[320px]'>
                    {data?.drivers?.map((driver, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                            className={`${theme === "dark" ? 'bg-[#1b1c1e]' : "bg-[#f7f7f7]"} p-3 sm:p-4 rounded-lg`}
                        >
                            {/* Mobile Layout */}
                            <div className="sm:hidden">
                                {/* Driver Info */}
                                <div className='flex items-center gap-3 mb-3'>
                                    <motion.img
                                        src={driver?.user?.image}
                                        alt=""
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 * index, duration: 0.5 }}
                                        className='h-10 w-10 rounded-full object-cover flex-shrink-0'
                                    />
                                    <div className="flex-1 min-w-0">
                                        <motion.p
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 * index, duration: 0.5 }}
                                            className={`${theme === "dark" ? 'text-white' : "text-black"} font-medium text-sm capitalize truncate`}
                                        >
                                            {driver?.user?.name}
                                        </motion.p>
                                        <motion.p
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 * index, duration: 0.5 }}
                                            className={`${theme === "dark" ? 'text-gray-400' : "text-gray-600"} text-xs truncate`}
                                        >
                                            {driver?.user?.email}
                                        </motion.p>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className='flex items-center gap-2 justify-between'>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 * index, duration: 0.5 }}
                                        className="flex-1"
                                    >
                                        <GradientButton 
                                            name={t('unassign_vehicle')} 
                                            handleClick={() => handleUnassign(driver?.driver?.id)} 
                                            loading={loading}
                                        />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ delay: 0.6 * index, duration: 0.5 }}
                                        className='bg-[#2D9BFF] p-2 rounded-lg w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#1a7fd6] transition-colors flex-shrink-0'
                                        onClick={() => { navigate(`/Chat`) }}
                                    >
                                        <img src={chat} alt="" className="w-5 h-5" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden sm:flex items-center justify-between">
                                <div className='flex items-center gap-3 flex-1 min-w-0'>
                                    <motion.img
                                        src={driver?.user?.image}
                                        alt=""
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 * index, duration: 0.5 }}
                                        className='h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 2xl:h-16 2xl:w-16 rounded-full object-cover flex-shrink-0'
                                    />
                                    <div className="flex-1 min-w-0">
                                        <motion.p
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 * index, duration: 0.5 }}
                                            className={`${theme === "dark" ? 'text-white' : "text-black"} font-medium text-sm lg:text-base 2xl:text-lg capitalize truncate`}
                                        >
                                            {driver?.user?.name}
                                        </motion.p>
                                        <motion.p
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 * index, duration: 0.5 }}
                                            className={`${theme === "dark" ? 'text-gray-400' : "text-gray-600"} text-xs lg:text-sm 2xl:text-base truncate`}
                                        >
                                            {driver?.user?.email}
                                        </motion.p>
                                    </div>
                                </div>
                                
                                <div className='flex items-center gap-2 flex-shrink-0'>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 * index, duration: 0.5 }}
                                    >
                                        <GradientButton 
                                            name={t('unassign_vehicle')} 
                                            handleClick={() => handleUnassign(driver?.driver?.id)} 
                                            loading={loading}
                                        />
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ delay: 0.6 * index, duration: 0.5 }}
                                        className='bg-[#2D9BFF] p-2 lg:p-3 rounded-lg w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer hover:bg-[#1a7fd6] transition-colors'
                                        onClick={() => { navigate(`/Chat`) }}
                                    >
                                        <img src={chat} alt="" className="w-4 h-4 lg:w-5 lg:h-5" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                /* No Data State */
                <div className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <FaUserSlash className="text-[#2d9bff] text-4xl sm:text-6xl mb-4 mx-auto" />
                        <p className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            {t('no_driver_found')}
                        </p>
                        <p className="text-sm text-gray-500 px-4">
                            {t('try_adding_driver')}
                        </p>
                    </motion.div>
                </div>
            )}
        </motion.div>
    )
}

export default DriversCard