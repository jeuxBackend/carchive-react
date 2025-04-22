import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import ham from "../../assets/hamburger.png";
import hamLight from "../../assets/hamLight.png";
import msg from "./assets/msg.png";
import Search from "../../Components/Search/Search";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { delDriver, getDrivers } from "../../API/portalServices";
import { BeatLoader } from "react-spinners";
import NoDataFound from "../../GlobalComponents/NoDataFound/NoDataFound";
import { toast } from "react-toastify";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { useNavigate } from "react-router-dom";
import { initializeChat } from "../../utils/ChatUtils";


const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" }
    }),
};

const menuVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }
};

const Drivers = () => {
    const { theme } = useTheme();
    const [openMenu, setOpenMenu] = useState(null);
    const dropdownRef = useRef(null);
    const [search, setSearch] = useState('');
    const {currentUserId, setCurrentUserId} = useGlobalContext()
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const [driverData, setDriversData] = useState([])
    const [loading, setLoading] = useState(false);

    const fetchDriverData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getDrivers();
            setDriversData(response?.data?.data || {});
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDriverData();
    }, []);

    const removeDriver = async (companyId) => {
        setLoading(true);
        try {
            const response = await delDriver(companyId);
            if (response.data) {
                toast.success("Driver Deleted Successfully");
                fetchDriverData();
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredDrivers = driverData.filter(driver => {
        const searchTerm = search.toLowerCase();
        return (
            driver?.name?.toLowerCase().includes(searchTerm) ||
            driver?.email?.toLowerCase().includes(searchTerm)
        );
    });




    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
            <Search value={search} setValue={setSearch} />
            {loading ? <div className="h-[80vh] flex items-center justify-center">
                <BeatLoader color="#2d9bff" />
            </div> : (filteredDrivers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {filteredDrivers.map((user, i) => (
                        <motion.div
                            key={user.id}
                            ref={dropdownRef}
                            className={`relative flex items-center space-x-4 p-4 rounded-lg shadow-lg transition-all  
                            ${theme === "dark" ? "bg-[#323335] text-white" : "bg-[#FFFFFF] text-black border-2 border-[#ECECEC]"}`}
                            variants={cardVariants}
                            custom={i}
                            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.1)" }}
                        >

                            <motion.img
                                src={user.image}
                                alt={user.name}
                                className="w-16 h-16 lg:w-32 lg:h-32 rounded-lg object-cover"
                                animate={{ y: [0, -3, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                whileHover={{ scale: 1.1 }}
                            />

                            <div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold capitalize">{user.name}</h3>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>

                                <motion.button
                                    className={`flex items-center lg:px-4 lg:py-2 px-3 py-1 rounded-lg font-semibold transition-all mt-5 gap-3 cursor-pointer 
        ${theme === "dark" ? "bg-[#319BF9]  text-white" : "bg-black hover:bg-gray-800 text-white"}`}
                                    whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {navigate(`/Chat`)}}
                                >
                                    <img className="w-5 h-5" src={msg} alt="message icon" />
                                    Message
                                </motion.button>

                            </div>
                            <motion.img
                                src={theme === "dark" ? ham : hamLight}
                                onClick={() => setOpenMenu(openMenu === i ? null : i)}
                                className="absolute top-3 right-3 text-black cursor-pointer transition w-[1.6rem]"
                                whileHover={{ rotate: 180, scale: 1.2 }}
                                layout="position"
                            />
                            <AnimatePresence>
                                {openMenu === i && (
                                    <motion.div
                                        className="absolute shadow-2xl bg-white z-50 text-[#7587a9] w-[150px] right-10 top-7 rounded-b-3xl flex flex-col rounded-tr-sm rounded-tl-3xl p-3"
                                        variants={menuVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <p onClick={() => { setOpenMenu(null), removeDriver(user?.driverCompanyId) }} className="flex items-center gap-2 cursor-pointer justify-center">
                                            <RiDeleteBin4Fill /> Delete
                                        </p>
                                    </motion.div>


                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>) : <div className="h-[80vh] flex items-center justify-center"><NoDataFound /></div>)}
        </motion.div>
    );
};

export default Drivers;
