import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import GradientButton from "../../Components/Buttons/GradientButton";
import RequestButton from "../../Components/Buttons/RequestButton";
import { searchVehicle } from "../../API/portalServices";
import { toast } from "react-toastify";
import { useGlobalContext } from "../../Contexts/GlobalContext";




function TransferVehicle({ open, setOpen }) {
    if (!open) return null;
    const { theme } = useTheme()
    const navigate = useNavigate()
    const [value, setValue] = useState('');
    const { vehicleData, setVehicleData } = useGlobalContext()

    const [loading, setLoading] = useState(false);

    const vinSearch = async () => {
        if (!value) {
            toast.error("Please enter vin number")
        } else {
            setLoading(true);
            try {
                const response = await searchVehicle({ vinNumber: value });
                setVehicleData(response?.data?.data || {});
                toast.success("Vehicle Found")
                navigate("/SearchedVehicle")
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Vehicle not found")
            } finally {
                setLoading(false);
            }
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
                    className={`rounded-xl w-[100%] sm:w-[30rem] shadow flex flex-col items-center justify-center gap-2
            ${theme === "dark" ? "bg-[#323335] border-2 border-[#323335]" : "bg-white border-2 border-[#ECECEC]"}`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-full p-6 flex flex-col gap-3">
                        <div className="flex flex-col gap-3 justify-center items-center">
                            <div className="text-center w-full">
                                <p className={`${theme === "dark" ? "text-white" : "text-black"} text-2xl font-medium py-1 pb-4`}>Search Vehicle By VIN</p>
                                <div className="w-full">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className={`flex items-center gap-2 w-full p-4 rounded-xl font-medium ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-[#f7f7f7] border border-[#e8e8e8]"}`}
                                    >
                                        <input
                                            type='text'
                                            placeholder={"Vin Number"}
                                            value={value}
                                            onChange={(e) => {
                                                const newValue = e.target.value.toUpperCase();
                                                if (newValue.length <= 17) {
                                                    setValue(newValue);
                                                }
                                            }}
                                            required
                                            className={`flex-1 outline-none border-none font-medium ${theme === "dark" ? "text-white" : "text-black"}`}
                                        />

                                    </motion.div>

                                </div>
                            </div>
                        </div>


                        <div className="flex items-center justify-center gap-3">
                            <div className="w-full cursor-pointer" onClick={() => setOpen(false)}>
                                <GradientButton name="Cancel" />

                            </div>
                            <div className="w-full cursor-pointer" >
                                <RequestButton name="Search" handleClick={() => vinSearch()} loading={loading} />

                            </div>
                        </div>


                    </div>
                </motion.div>
            </div>


        </motion.div>
    );
}

TransferVehicle.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default TransferVehicle;
