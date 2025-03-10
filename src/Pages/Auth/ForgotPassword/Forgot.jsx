import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../../Contexts/ThemeContext";
import { IoClose } from "react-icons/io5";




function Forgot({ open, setOpen, setOTP }) {
    if (!open) return null;
    const { theme } = useTheme()
    const navigate = useNavigate()

    const logoutHandle = () => {
        navigate('/')
        setLogout(false)

    }




    return (
        <motion.div className={`bg-black/50 backdrop-blur-lg overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full poppins`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-center py-10 w-full min-h-screen ">
                <motion.div
                    className={`rounded-xl relative w-[90%] sm:w-[35rem] shadow flex flex-col items-center justify-center gap-2 p-4
            ${theme === "dark" ? "bg-[#1b1c1e] border-2 border-[#323335]" : "bg-white border-2 border-[#ECECEC]"}`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.3 }}

                >
                    <IoClose onClick={()=>setOpen(false)} className={`absolute text-[2rem] top-4 right-3 cursor-pointer ${theme==="dark"?"text-white":"text-black"}`} />
                    <div className="flex items-center justify-center flex-col">
                        <h1 className={`${theme === "dark" ? "text-white" : "text-black"} text-[2rem] font-bold`}>Forgot Password</h1>
                        <p className={`${theme === "dark" ? "text-[#a4a4a5]" : "text-[#1B1C1E]"}`}>Enter your email or contact number to get a passcode</p>
                    </div>
                    <div className="w-full h-[16rem] mt-5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`flex items-center gap-2 w-full p-3 rounded-xl font-medium ${theme === "dark" ? "bg-[#323335]" : "bg-[#f7f7f7] border border-[#e8e8e8]"}`}
                        >
                            <input
                                type='text'
                                placeholder="Enter Your Email"
                                className={`w-full outline-none border-none font-medium ${theme === "dark" ? "text-white" : "text-black"}`}
                            />
                        </motion.div>
                    </div>
                    <div onClick={()=>{setOpen(false), setOTP(true)}} className="bg-[#479cff] font-medium py-4 cursor-pointer rounded-2xl w-full text-center text-white mb-2">
                        Get Verification Code
                    </div>




                </motion.div>
            </div>


        </motion.div>
    );
}

Forgot.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    setOTP:PropTypes.func.isRequired
};

export default Forgot;
