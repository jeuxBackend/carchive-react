import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus } from "react-icons/fi";
import { useTheme } from '../../Contexts/ThemeContext';
import hamLight from "./assets/ham-light.png";
import hamDark from "./assets/ham-dark.png";
import back from "../../assets/back.png"
import ham from "../../assets/hamburger.png"
import hamLightCar from "../../assets/hamLight.png"
import { BiSolidEditAlt } from 'react-icons/bi';
import { RiDeleteBin4Fill } from 'react-icons/ri';
import { IoArchiveSharp, IoShareSocial } from 'react-icons/io5';
import backLight from "../../assets/backLight.png"
import { useGlobalContext } from '../../Contexts/GlobalContext';
import { archiveVehicle, delVehicle } from '../../API/portalServices';
import { toast } from 'react-toastify';

const Topbar = ({ setSide }) => {
    const [active, setActive] = useState('');
    const { theme } = useTheme();
    const location = useLocation();
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const {vehicle, setVehicle, addRecord, setAddRecord, addTransfer, setAddTransfer} = useGlobalContext()
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setActive(location.pathname);
    }, [location]);

    const titles = {
        "/Settings": "Settings",
        "/Vehicles": "Vehicles Management",
        "/Dashboard": "Dashboard",
        "/Chat": "Chat",
        "/Invoices": "Invoices",
        "/Drivers": "Drivers",
        "/Requests": "Requests",
        
    };

     const [loadingArchive, setLoadingArchive] = useState(false);
     const [loadingDelete, setLoadingDelete] = useState(false);
      
     const handleArchive = async (id) => {
        setLoadingArchive(true);
        try {
          const response = await archiveVehicle(id);
          if (response.data) {
            toast.success("Vehicle Archived Status Changed Successfully");
            const updatedVehicle = { ...vehicle, isArchive: vehicle.isArchive === "1" ? "0" : "1" };
            setVehicle(updatedVehicle);
            localStorage.setItem("vehicle", JSON.stringify(updatedVehicle));  
            setOpen(false)
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoadingArchive(false);
        }
      };
      const handleDelete = async (id) => {
        setLoadingDelete(true);
        try {
          const response = await delVehicle(id);
          if (response.data) {
            toast.success("Vehicle Deleted Successfully");
            navigate("/Vehicles")
            setOpen(false)
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
            setLoadingDelete(false);
        }
      };

    return (
        <motion.div
            className="h-[5rem] flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-2 w-full">

                <motion.div
                    onClick={() => setSide(true)}
                    className="block lg:hidden"
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <img src={theme === "dark" ? hamDark : hamLight} className="w-[2.5rem]" alt="menu" />
                </motion.div>


                <motion.div
                    className={`w-full flex items-center justify-between ${theme === "dark" ? "text-white" : "text-black"}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div>
                        {titles[active] && (
                            <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">{titles[active]}</p>
                        )}
                        {active.startsWith("/Vehicles/") && (
                            <div className='flex items-center gap-2'>
                                <img src={theme==="dark"?back:backLight} alt="" className='w-[1.6rem] cursor-pointer' onClick={() => navigate(-1)} />
                                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">Vehicle Details</p>
                            </div>
                        )}
                        {active.startsWith("/VehicleMaintenence/") && (
                            <div className='flex items-center gap-2'>
                                <img src={theme==="dark"?back:backLight} alt="" className='w-[1.6rem] cursor-pointer' onClick={() => navigate(-1)} />
                                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">Maintenance Record</p>
                            </div>
                        )}
                        {active==="/Update-Profile" && (
                            <div className='flex items-center gap-2'>
                                <img src={theme==="dark"?back:backLight} alt="" className='w-[1.6rem] cursor-pointer' onClick={() => navigate(-1)} />
                                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">Profile Update</p>
                            </div>
                        )}
                        {active==="/Privacy-Policy" && (
                            <div className='flex items-center gap-2'>
                                <img src={theme==="dark"?back:backLight} alt="" className='w-[1.6rem] cursor-pointer' onClick={() => navigate(-1)} />
                                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">Privacy Policy</p>
                            </div>
                        )}
                        {active==="/About" && (
                            <div className='flex items-center gap-2'>
                                <img src={theme==="dark"?back:backLight} alt="" className='w-[1.6rem] cursor-pointer' onClick={() => navigate(-1)} />
                                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">About Us</p>
                            </div>
                        )}
                        {active==="/SearchedVehicle" && (
                            <div className='flex items-center gap-2'>
                                <img src={theme==="dark"?back:backLight} alt="" className='w-[1.6rem] cursor-pointer' onClick={() => navigate(-1)} />
                                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">Vehicle Details</p>
                            </div>
                        )}
                        {active.startsWith("/ViewLogs/") && (
                            <div className='flex items-center gap-2'>
                                <img src={theme==="dark"?back:backLight} alt="" className='w-[1.6rem] cursor-pointer' onClick={() => navigate(-1)} />
                                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">View Logs</p>
                            </div>
                        )}
                        {active.startsWith("/VehicleGarages/") && (
                            <div className='flex items-center gap-2'>
                                <img src={theme==="dark"?back:backLight} alt="" className='w-[1.6rem] cursor-pointer' onClick={() => navigate(-1)} />
                                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">Vehicle Garages</p>
                            </div>
                        )}
                        {active==="/Language" && (
                            <div className='flex items-center gap-2'>
                                <img src={theme==="dark"?back:backLight} alt="" className='w-[1.6rem] cursor-pointer' onClick={() => navigate(-1)} />
                                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">Language</p>
                            </div>
                        )}
                        {active==="/Add-Vehicle" && (
                            <div className='flex items-center gap-2'>
                                <img src={theme==="dark"?back:backLight} alt="" className='w-[1.6rem] cursor-pointer' onClick={() => navigate(-1)} />
                                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">Add Vehicle</p>
                            </div>
                        )}

                        {active === "/Dashboard" && (
                            <p>Welcome Back, Julia 👋</p>
                        )}
                    </div>
                    {}
                    <div className='flex items-center gap-2'>
                    {active === "/Vehicles" && (
                        <div onClick={()=>setAddTransfer(true)} className="flex items-center gap-2 py-2.5 shadow-md px-3 cursor-pointer rounded-lg text-white bg-[#323334]">
                            {/* <FiPlus className="text-[1.5rem]" /> */}
                            <span className="sm:block hidden">Transfer Vehicle</span>
                        </div>
                    )}
                    {active === "/Vehicles" && (
                        <Link to='/Add-Vehicle' className="flex items-center gap-2 py-2 px-3 rounded-lg text-white bg-[#2d9bff]">
                            <FiPlus className="text-[1.5rem]" />
                            <span className="sm:block hidden">Add Vehicles</span>
                        </Link>
                    )}
                    </div>
                    {active.startsWith("/VehicleMaintenence/") && (
                        <div onClick={() => setAddRecord(true)} className="flex items-center cursor-pointer gap-2 py-2 px-3 rounded-lg text-white bg-[#2d9bff]">
                            <FiPlus className="text-[1.5rem]" />
                            <span className="sm:block hidden">Add Record</span>
                        </div>
                    )}
                    {active.startsWith("/Vehicles/") && (
                        <div  className='relative'>
                            <img src={theme==="dark"?ham:hamLightCar} alt="" className='w-[2rem] cursor-pointer' onClick={()=>setOpen(!open)}/>
                            {open&&
                            <div  className='absolute shadow-2xl bg-white z-50 text-[#7587a9] w-[200px] right-4 top-3 rounded-b-3xl flex flex-col rounded-tr-lg  rounded-tl-3xl'>
                                <p  className='flex items-center gap-2 p-3'><BiSolidEditAlt /> Edit Vehicle</p>
                                <p onClick={()=>handleDelete(vehicle?.id)} className='flex items-center cursor-pointer gap-2 p-3 border-t-2 rounded-t-4xl border-[#e4e4e4]'><RiDeleteBin4Fill /> {loadingDelete? "Please Wait..." : "Delete Vehicle"}</p>
                                <p onClick={()=>handleArchive(vehicle?.id)} className='flex items-center cursor-pointer gap-2 p-3 border-t-2 rounded-t-4xl border-[#e4e4e4]'><IoArchiveSharp />{loadingArchive? "Please Wait..." : (vehicle?.isArchive==="0"?"Archive Vehicle":"Unarchive Vehicle")} </p>
                                <p className='flex items-center gap-2 p-3 border-t-2 rounded-t-4xl border-[#e4e4e4]'><IoShareSocial /> Share</p>
                            </div>}
                        </div>

                    )}

                </motion.div>
            </div>
        </motion.div>
    );
};

export default Topbar;
