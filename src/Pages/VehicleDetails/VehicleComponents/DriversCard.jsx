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

function DriversCard({ data, setOpen, fetchVehicleData }) {
    const { theme } = useTheme()
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {currentUserId} = useGlobalContext()

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
        }finally{
            setLoading(false);
        }
        
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`w-full rounded-xl p-2 sm:p-4 ${theme === "dark" ? 'bg-[#323335]' : "bg-white border border-[#ececec]"} relative shadow-md h-[390px] overflow-auto`}
        >
            <div className='flex items-center justify-between'>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`${theme === "dark" ? 'text-white' : "text-black"} text-[1.3rem] font-medium`}
            >
                Driver's
            </motion.p>
            <div onClick={()=>setOpen(true)} className='flex items-center cursor-pointer gap-2 py-2 px-3 rounded bg-[#2d9bff] text-white'><CiCirclePlus className='text-[1.5rem]'/><span className='sm:block hidden'>Assign Driver</span> </div>
            </div>
            {data?.drivers?.length > 0 ? (


                <div className='flex flex-col gap-3 justify-between mt-2 lg:min-h-[250px]'>
                    {data?.drivers?.map((data, index) => (
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
                                    src={data?.user?.image}
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
                                        className={`${theme === "dark" ? 'text-white' : "text-black"} font-medium lg:text-[0.9rem] 2xl:text-[1.1rem] capitalize`}
                                    >
                                        {data?.user?.name}
                                    </motion.p>
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 * index, duration: 0.5 }}
                                        className={`${theme === "dark" ? 'text-white' : "text-black"} font-medium text-[0.6rem] lg:text-[0.5rem] 2xl:text-[0.9rem]`}
                                    >
                                        {data?.user?.email}
                                    </motion.p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 * index, duration: 0.5 }}
                                >
                                    <GradientButton name="Un-Assign Vehicle" handleClick={()=>handleUnassign(data?.driver?.id)} loading={loading}/>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ delay: 0.6 * index, duration: 0.5 }}
                                    className='bg-[#2D9BFF] p-2 rounded-xl w-[3rem] h-[3rem] flex items-center justify-center'
                                    onClick={() => {navigate(`/Chat`)}}
                                >
                                    <img src={chat} alt="" />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>) : <div className="min-h-[310px] flex flex-col items-center justify-center">
                <FaUserSlash className="text-[#2d9bff]  text-6xl mb-4" />
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    No Driver Found
                </p>
                <p className="text-sm text-gray-500  mt-2">
                    Try adding driver to the list.
                </p>
            </div>}
        </motion.div>
    )
}

export default DriversCard
