import React, { useState } from 'react';
import { useTheme } from '../../Contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import hamLight from "../../assets/hamLight.png";
import ham from "../../assets/hamburger.png";
import { RiDeleteBin4Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';

function AdminDriverCards({ img, name }) {
    const { theme } = useTheme();
    const [open, setOpen] = useState(false);

    return (
        <motion.div 
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`w-full ${theme === "dark" ? "border border-[#323335] bg-[#323335] rounded-xl shadow-sm" : "border-2 border-[#ECECEC] rounded-xl shadow-sm"}`}
        >
            <div className="h-64 bg-cover bg-center relative rounded-xl" style={{ backgroundImage: `url(${img})` }}>
               

               
                <motion.div 
                    initial={{ opacity: 0.7 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                    className='bg-gradient-to-t from-black/80 via-transparent to-transparent absolute h-full w-full top-0 rounded-xl' 
                />

               
                <motion.div 
                    className='text-white absolute bottom-0 m-3'
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <Link to='/Admin/Company/1'>
                    <p className='text-[#898C8E]'>Driver Name: <span className='text-[#FFFFFF]'>{name}</span></p>
                    {/* <p className='text-[#898C8E]'>Contact Info: <span className='text-[#FFFFFF]'> (208)555-0112</span></p> */}
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default AdminDriverCards;
