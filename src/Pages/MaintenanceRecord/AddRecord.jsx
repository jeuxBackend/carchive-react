import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import back from "../../assets/back.png";
import backLight from "../../assets/backLight.png";
import BasicDatePicker from "../../Components/Buttons/BasicDatePicker";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import InputField from "./Input";
import { CiCirclePlus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

function AddRecord({ open, setOpen }) {
    if (!open) return null;
    const { theme } = useTheme();
    const { id } = useGlobalContext();

    const [formData, setFormData] = useState({
        mileage: "",
        dealerName: "",
        date: "",
        serviceType: "",
        carId: id
    });

 
    const [itemName, setItemName] = useState("");
    const [remarks, setRemarks] = useState("");
    const [serviceLines, setServiceLines] = useState([]);

   
    const addServiceLine = () => {
        if (!itemName.trim() || !remarks.trim()) return; 

        const newLine = { itemName, remarks, status: 1 };
        const updatedLines = [...serviceLines, newLine];

        setServiceLines(updatedLines);
        setItemName("");
        setRemarks("");
    };

    const removeServiceLine = (index) => {
        const updatedLines = serviceLines.filter((_, i) => i !== index);
        setServiceLines(updatedLines);
    };
    console.log(JSON.stringify(serviceLines));

    return (
        <motion.div
            className="bg-black/50 backdrop-blur-lg fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full poppins"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className={`rounded-xl w-[90%] p-6 sm:w-[50rem] shadow flex flex-col gap-3
                    ${theme === "dark" ? "bg-[#323335] border-[#323335]" : "bg-white border-[#ECECEC]"}`}
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
                    <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>
                        Add Maintenance Record
                    </p>
                </div>

          
                <div className="w-full flex flex-col gap-3">
                    <div className="w-full flex gap-2">
                        <InputField label="Mileage" fieldKey="mileage" value={formData} setValue={setFormData} />
                        <InputField label="Dealer Name" fieldKey="dealerName" value={formData} setValue={setFormData} />
                    </div>
                    <BasicDatePicker label="Date" fieldKey="date" value={formData} setValue={setFormData} />
                    <InputField label="Service Type" fieldKey="serviceType" value={formData} setValue={setFormData} />
                </div>

         
                <div className="w-full pt-2">
                    <div className="flex items-center justify-between">
                        <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.6rem] font-medium`}>
                            Add Service Line
                        </p>
                        <button
                            className="bg-[#499cfe] text-[1.7rem] text-white p-1 rounded-md cursor-pointer"
                            onClick={addServiceLine}
                        >
                            <CiCirclePlus />
                        </button>
                    </div>

                  
                    <div className="flex items-center gap-2 pt-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`flex items-center gap-2 w-full p-4 rounded-xl font-medium 
                                ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-[#f7f7f7] border border-[#e8e8e8]"}`}
                        >
                            <input
                                placeholder="Item Name"
                                className={`flex-1 outline-none border-none font-medium 
                                    ${theme === "dark" ? "text-white" : "text-black"}`}
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`flex items-center gap-2 w-full p-4 rounded-xl font-medium 
                                ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-[#f7f7f7] border border-[#e8e8e8]"}`}
                        >
                            <input
                                placeholder="Remarks"
                                className={`flex-1 outline-none border-none font-medium 
                                    ${theme === "dark" ? "text-white" : "text-black"}`}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </motion.div>
                    </div>

           
                    {serviceLines.length > 0 && (
                        <div className="w-full mt-4">
                            <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.4rem] font-medium`}>
                                Added Services
                            </p>
                            <div className="flex flex-col gap-2 pt-2">
                                {serviceLines.map((line, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-3 rounded-lg
                                            ${theme === "dark" ? "bg-[#1b1c1e] text-white" : "bg-[#f7f7f7] text-black"}`}
                                    >
                                        <p className="flex-1">{line.itemName}</p>
                                        <p className="flex-1">{line.remarks}</p>
                                        <button
                                            className="text-red-500 text-xl cursor-pointer"
                                            onClick={() => removeServiceLine(index)}
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hidden Input to Store Encoded JSON */}
                    <input type="hidden" value={JSON.stringify(serviceLines)} />
                </div>
            </motion.div>
        </motion.div>
    );
}

export default AddRecord;
