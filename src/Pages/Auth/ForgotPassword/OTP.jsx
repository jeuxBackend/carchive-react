import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useTheme } from "../../../Contexts/ThemeContext";
import { IoClose } from "react-icons/io5";

function OTP({ open, setOpen, setPass }) {
    if (!open) return null;
    const { theme } = useTheme();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return; 

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <motion.div
            className="bg-black/50 backdrop-blur-lg overflow-y-auto fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-full poppins"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-center py-10 w-full min-h-screen">
                <motion.div
                    className={`rounded-xl relative w-[90%] sm:w-[35rem] shadow flex flex-col items-center justify-center gap-4 p-6
                        ${theme === "dark" ? "bg-[#1b1c1e] border-2 border-[#323335]" : "bg-white border-2 border-[#ECECEC]"}`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <IoClose onClick={() => setOpen(false)} className={`absolute text-[2rem] top-4 right-3 cursor-pointer ${theme === "dark" ? "text-white" : "text-black"}`} />
                    <div className="flex flex-col items-center">
                        <h1 className={`${theme === "dark" ? "text-white" : "text-black"} text-[2rem] font-bold`}>Verify Your Code</h1>
                        <p className={`${theme === "dark" ? "text-[#a4a4a5]" : "text-[#1B1C1E]"} text-center`}>
                        Enter the passcode you just received on your email address ending with ********in@gmail.com
                        </p>
                    </div>
                    <div className="mt-5 h-[14rem]">
                        <div className="flex gap-1 sm:gap-3">
                            {otp.map((digit, index) => (
                                <motion.input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className={`w-12 h-14 sm:w-16 sm:h-18 text-center text-xl font-medium rounded-full outline-none border 
                                        ${theme === "dark" ? "bg-[#323335] text-white border-[#444]" : "bg-[#f7f7f7] text-black border-[#e8e8e8]"}`}
                                />
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setOpen(false);
                            setPass(true);
                        }}
                        className="bg-[#479cff] font-medium py-4 rounded-2xl w-full text-center text-white mt-5"
                    >
                        Verify
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}

OTP.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    setPass: PropTypes.func.isRequired,
};

export default OTP;
