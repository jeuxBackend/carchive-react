import React, { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import backgroundpic from "./assets/bg.png";
import verifiedicon from "./assets/verify.png";
import unverifiedicon from "./assets/unverify.png";
import { useTheme } from '../../Contexts/ThemeContext';
import { getVehicleById, maintenanceRecord } from '../../API/portalServices';
import { useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import NoDataFound from '../../GlobalComponents/NoDataFound/NoDataFound';
import AddRecord from './AddRecord';
import { useGlobalContext } from '../../Contexts/GlobalContext';


function MaintenanceRecord() {
    const { theme } = useTheme();
    const {addRecord, setAddRecord} = useGlobalContext();
    const [Data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    const { id } = useParams()

    const fetchMaintenanceData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getVehicleById(id);
            setData(response?.data?.data?.maintenance || {});
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMaintenanceData();
    }, [id]);
    return (
        <>
        <AddRecord open={addRecord} setOpen={setAddRecord} fetchMaintenanceData={fetchMaintenanceData}/>
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
                {loading ? <div className="h-[80vh] flex items-center justify-center">
            <BeatLoader color="#2d9bff" />
        </div> : (Data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Data.map((request, index) => (
                    <div
                        key={index}
                        className={`relative p-6 rounded-lg shadow-lg overflow-hidden transition-all 
                                        ${theme === "dark" ? "bg-[#323335] border-2 border-[#323335]" : "bg-white border-2 border-[#ECECEC]"}`}
                        style={{
                            backgroundImage: `url(${backgroundpic})`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right bottom",
                            backgroundSize: "100px auto",
                        }}
                    >

                        <div className="relative z-10">

                            <div className="text-sm ">
                                <div className="mt-2 flex justify-between text-[#98999A]">
                                    <p className="text-gray-400">Date</p>
                                    <p className="text-gray-400">Mileage</p>
                                </div>
                                <div className="mt-1 flex justify-between text-sm">
                                    <p className={`${theme === "dark" ? "text-white" : "text-black"} font-semibold`}>{request.date}</p>
                                    <p className={`${theme === "dark" ? "text-white" : "text-black"} font-semibold`}>{request.millage}</p>
                                </div>
                            </div>
                            <div className="text-sm">
                                <div className="mt-2 flex justify-between text-[#98999A]">
                                    <p className="text-gray-400">Type</p>
                                    <p className="text-gray-400">Dealer</p>
                                </div>
                                <div className="mt-1 flex justify-between text-sm">
                                    <p className={`${theme === "dark" ? "text-white" : "text-black"} font-semibold`}>{request.serviceType}</p>
                                    <p className={`${theme === "dark" ? "text-white" : "text-black"} font-semibold`}>{request.dealerName}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-gray-400">Status</p>
                                <div className="flex items-center gap-2 font-semibold">
                                    <p className={`${theme === "dark" ? "text-white" : "text-black"} ${request.status === "0" && "text-red-500"}`}>
                                        {request.status === "0" ? "Unverified" : "Verified"}
                                    </p>
                                    <img
                                        src={request.status === "0" ? unverifiedicon : verifiedicon}
                                        alt={request.status}
                                        className="w-5 h-5"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between gap-3">
                                <button className="mt-4 bg-[#1B1C1E] text-white w-full py-2 rounded-md font-medium cursor-pointer">
                                    Over View
                                </button>
                                <button className="mt-4 bg-[#319BFB] text-white w-full py-2 rounded-md font-medium cursor-pointer">
                                    {request.status === "0" ? "Unverified" : "Verified"}
                                </button>

                            </div>

                        </div>
                    </div>
                ))}
            </div>): <div className="h-[80vh] flex items-center justify-center"><NoDataFound /></div>)}
        </motion.div>
        </>
    )
}

export default MaintenanceRecord