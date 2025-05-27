import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import GradientButton from "../../Components/Buttons/GradientButton";
import RequestButton from "../../Components/Buttons/RequestButton";
import { buyCarApi, searchVehicle } from "../../API/portalServices";
import { toast } from "react-toastify";
import { useGlobalContext } from "../../Contexts/GlobalContext";

function TransferModal({ open, setOpen }) {
    if (!open) return null;
    
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const { vehicleData } = useGlobalContext();
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    
    const buyCar = async () => {
        if (!description || !file) {
            toast.error("Please enter description and upload file");
        } else {
            setLoading(true);
            try {
                const response = await buyCarApi({ id: vehicleData?.id, description, file });
                toast.success("Vehicle bought requests successfully");
                navigate("/Vehicles");
                setOpen(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Vehicle not found");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <motion.div 
            className="bg-black/50 backdrop-blur-lg overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full poppins"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-center py-10 w-full min-h-screen">
                <motion.div
                    className={`rounded-xl w-full sm:w-[40rem] shadow flex flex-col items-center justify-center gap-4 p-6
                        ${theme === "dark" ? "bg-[#323335] border-2 border-[#323335] text-white" : "bg-white border-2 border-[#ECECEC] text-black"}`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <p className="text-2xl font-medium text-center">Buy Car</p>
                 
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="w-full p-2 border rounded-lg cursor-pointer" 
                    />
                    
            
                    <textarea 
                        placeholder="Enter description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        rows={10}
                        className={`w-full p-3 rounded-lg resize-none h-24 ${theme === "dark" ? "bg-[#1b1c1e] text-white" : "bg-[#f7f7f7] text-black"}`} 
                    />
                    
                    
                    
                    <div className="flex items-center justify-between w-full gap-3">
                        <div className="w-full cursor-pointer" onClick={() => setOpen(false)}>
                            <GradientButton name="Cancel" />
                        </div>
                        <div className="w-full cursor-pointer">
                            <RequestButton name="Transfer" handleClick={buyCar} loading={loading} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

TransferModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};

export default TransferModal;
