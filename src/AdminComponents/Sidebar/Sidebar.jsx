import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion';
import dashboard from "./assets/dashboard.png"
import drivers from "./assets/drivers.png"
import company from "./assets/company.png"
import garage from "./assets/garage.png"
import about from "./assets/about.png"
import privacy from "./assets/privacy.png"
import setting from "./assets/settings.png"
import logout from "./assets/logout.png"
import logoDark from "./assets/logo-dark.png"
import logoLight from "./assets/logo-light.png"
import { IoMdClose } from "react-icons/io";
import { useTheme } from '../../Contexts/ThemeContext';


function Sidebar({ side, setSide,setLogout }) {
    const location = useLocation()
    const [active, setActive] = useState('')
    const { theme } = useTheme();
    useEffect(() => {
        setActive(location.pathname)
        console.log(location.pathname)

    }, [location])

    const sidebar = [
        {
            icon: dashboard,
            name: "Dashboard",
            path: "/Admin/Dashboard",
            subPath: null
        },
        {
            icon: company,
            name: "Company",
            path: "/Admin/Companies",
            path1: "/Admin/Company/",
            subPath: "/Admin/Invoices"
            // subPath: "/Add-Vehicle"
        },
        {
            icon: drivers,
            name: "Drivers",
            path: "/Admin/Drivers",
            subPath: null
        },
        {
            icon: garage,
            name: "Garage Owners",
            path: "/Admin/Garages",
           
        },
        {
            icon: setting,
            name: "Settings",
            path: "/Admin/Settings",
             path1: "/Admin/About",
            subPath: "/Admin/Privacy-Policy"
        },
       
        
       
      
    ]
    const sidebarItemVariants = {
        hidden: { opacity: 0, x: -20 }, 
        visible: { opacity: 1, x: 0 },  
    };

    const sidebarListVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, 
            },
        },
    };
    return (
        <div className={`lg:rounded-lg w-[250px] h-full lg:h-[97vh]  lg:w-[20%] ${theme === "dark" ? "bg-[#323335] text-white" : "bg-[#2d9bff] text-white"} z-40  overflow-y-auto absolute transition-all duration-300 lg:translate-x-0 lg:static ${side ? "translate-x-0" : "-translate-x-full"}`}>
            <div className='p-4 '>
                <div onClick={() => setSide(false)} className='py-2 cursor-pointer flex items-end lg:hidden  w-full justify-end '>

                    <IoMdClose className='text-[1.4rem]' />
                </div>
                <div className='flex justify-center pt-2'>
                    {theme === "dark" ? (
                        <img src={logoDark} alt="" className='w-[11rem] ' />
                    ) : (
                        <img src={logoLight} alt="" className='w-[11rem] ' />
                    )}
             
                </div>
            </div>
            <div className='flex flex-col justify-between h-[77vh] gap-6'>
                <motion.div
                    className='flex flex-col gap-5 py-4 mr-5'
                    variants={sidebarListVariants}   
                    initial="hidden"                 
                    animate="visible"                
                >
                    {sidebar.map((data, index) => (
                        <Link
                            key={index}
                            
                            to={data.path}
                            className='flex items-center gap-3 cursor-pointer'
                        >
                           
                            <motion.div
                            onClick={function(){setSide(false)}}
                                className={`flex ml-2 lg:ml-4 pl-3 lg:pl-5 w-full items-center gap-3 transition-all ${data?.name==="Vehicles"?"p-3":"p-2"}  rounded-md ${active === data.path || active.startsWith(data.path1) || active === data.subPath || active===data.subPath1 || active===data.subPath2 || active===data.subPath3
                                    ? 'bg-[#1b1c1e]'
                                    : 'hover:bg-white/20'
                                    }`}
                                variants={sidebarItemVariants}  
                                whileHover={{ scale: 1.05 }}   
                            >
                                <img src={data.icon} alt="" className='w-[1.5rem] xl:w-[2rem]' />
                                <motion.p className='font-medium xl:text-[1rem] text-[0.8rem]'>
                                    {data.name}
                                </motion.p>
                            </motion.div>
                        </Link>
                    ))}

                </motion.div>
                
                <motion.div
                    className={`flex pl-6 lg:pl-10 w-full cursor-pointer items-center gap-3 transition-all p-3 rounded-md pb-6`}
                    variants={sidebarItemVariants}  
                    onClick={function(){setLogout(true),setStatus(0)}}
                >
                    <img src={logout} alt="" className='w-[1.5rem] xl:w-[1.7rem]' />
                    <motion.p className='font-medium xl:text-[1rem] text-[0.8rem] '>
                        Logout
                    </motion.p>
                </motion.div>
            </div>


        </div>
    )
}

export default Sidebar