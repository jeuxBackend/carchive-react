import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useTheme } from "../../../Contexts/ThemeContext";
import { IoClose, IoEye, IoEyeOff } from "react-icons/io5";

function ConfirmPassword({ open, setOpen }) {
    if (!open) return null;
    const { theme } = useTheme();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        
      
      
        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
            newErrors.password = "Password must include an uppercase letter, a lowercase letter, and a special character.";
        }

     
        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log("Password updated successfully!");
            setOpen(false);
        }
    };

    return (
        <motion.div className={`bg-black/50 backdrop-blur-lg overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full poppins`}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.3 }}>
                   <div className="flex items-center justify-center py-10 w-full min-h-screen ">
                <motion.div
                    className={`rounded-xl relative w-[90%] sm:w-[35rem] shadow flex flex-col items-center p-6 gap-4
                    ${theme === "dark" ? "bg-[#1b1c1e] border-[#323335]" : "bg-white border-[#ECECEC]"}`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <IoClose 
                        onClick={() => setOpen(false)} 
                        className={`absolute text-2xl top-4 right-3 cursor-pointer ${theme === "dark" ? "text-white" : "text-black"}`} 
                    />
                    <div className="flex items-center justify-center flex-col">
                        <h1 className={`${theme === "dark" ? "text-white" : "text-black"} text-[2rem] font-bold`}>Create Password</h1>
                        <p className={`${theme === "dark" ? "text-[#a4a4a5]" : "text-[#1B1C1E]"} text-center`}>Type your new strong password. Your password must include One capital letter & one small letter at least. One special character</p>
                    </div>

                   
                    <div className="flex flex-col w-full gap-3 h-[15rem]">
                   
                    <div className="w-full">
                        <div className={`flex items-center gap-2 w-full p-4 rounded-xl font-medium 
                            ${theme === "dark" ? "bg-[#323335]" : "bg-gray-100 border border-gray-300"}`}
                        >
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Enter New Password"
                                className={`w-full outline-none border-none bg-transparent ${theme === "dark" ? "text-white" : "text-black"}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {showPass 
                                ? <IoEyeOff onClick={() => setShowPass(!showPass)} className="text-gray-500 text-xl cursor-pointer" />
                                : <IoEye onClick={() => setShowPass(!showPass)} className="text-gray-500 text-xl cursor-pointer" />
                            }
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                   
                    <div className="w-full">
                        <div className={`flex items-center gap-2 w-full p-4 rounded-xl font-medium 
                            ${theme === "dark" ? "bg-[#323335]" : "bg-gray-100 border border-gray-300"}`}
                        >
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                placeholder="Confirm New Password"
                                className={`w-full outline-none border-none bg-transparent ${theme === "dark" ? "text-white" : "text-black"}`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {showConfirmPass 
                                ? <IoEyeOff onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-gray-500 text-xl cursor-pointer" />
                                : <IoEye onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-gray-500 text-xl cursor-pointer" />
                            }
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                    </div>

                  
                    <button 
                        onClick={handleSubmit} 
                       className="bg-[#479cff] font-medium py-4 rounded-2xl w-full text-center text-white mt-5"
                    >
                        Save Password
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}

ConfirmPassword.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default ConfirmPassword;
