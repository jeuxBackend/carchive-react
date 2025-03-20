import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../../Contexts/ThemeContext";
import back from "../../../assets/back.png"
import backLight from "../../../assets/backLight.png"
import { useGlobalContext } from "../../../Contexts/GlobalContext";
import { assignDriver } from "../../../API/portalServices";
import { toast } from "react-toastify";




function AddDriver({ open, setOpen, fetchVehicleData }) {
    if (!open) return null;
    const { theme } = useTheme()
    const [email, setEmail] = useState("")
    const { vehicle } = useGlobalContext()
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await assignDriver({ email, carId: vehicle?.id });
            if (response.data) {
                toast.success("Driver Assigned Successfully");
                setOpen(false)
                fetchVehicleData()
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
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
                    className={`rounded-xl w-[90%] p-6 sm:w-[40rem] shadow flex flex-col items-center justify-center gap-2
            ${theme === "dark"
                            ? "bg-[#1b1c1e] border-2 border-[#323335]"
                            : "bg-white border-2 border-[#ECECEC]"
                        }`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center w-full gap-2 justify-center relative">
                        <img
                            src={theme === "dark" ? back : backLight}
                            alt=""
                            className="w-[1.8rem] cursor-pointer absolute left-2"
                            onClick={() => setOpen(false)}
                        />
                        <p
                            className={`${theme === "dark" ? "text-white" : "text-black"
                                } text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium`}
                        >
                            Assign Driver
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="w-full pt-2 flex flex-col items-center justify-center">
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            rows={8}
                            placeholder="Email Address"
                            className={`flex items-center gap-2 w-full p-4 rounded-xl ${theme === "dark"
                                ? "bg-[#323335] text-white"
                                : "bg-[#f7f7f7] border border-[#e8e8e8] text-black"
                                }`}
                        />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}

                            className={`w-[50%] mt-3 py-3 px-3 xl:text-[1rem] lg:text-[0.6rem] text-center 2xl:px-4 flex justify-center items-center rounded-xl focus:outline-none ${theme === "dark" ? "bg-[#479cff] text-white" : "bg-[#1b1c1e] text-white "
                                }`}
                        >
                            {loading ? (
                                <motion.div
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin"
                                />
                            ) : (
                                "Assign"
                            )}

                        </motion.button>

                    </form>

                </motion.div>
            </div>


        </motion.div>
    );
}

AddDriver.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default AddDriver;
