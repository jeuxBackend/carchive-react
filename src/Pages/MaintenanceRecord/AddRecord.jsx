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
import { createMaintenanceRecord } from "../../API/portalServices";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import CustomDropdown from "./CustomDropdown";

function AddRecord({ open, setOpen, fetchMaintenanceData }) {
    if (!open) return null;
    const { theme } = useTheme();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        millage: "",
        dealerName: "",
        date: "",
        serviceType: "",
        id: id
    });

    console.log(formData)


    const [itemName, setItemName] = useState("");
    const [remarks, setRemarks] = useState("");
    const [serviceLines, setServiceLines] = useState([]);
    const [loading, setLoading] = useState(false);


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


    const addRecord = async (e) => {
        e.preventDefault();
        if (!formData.millage || !formData.dealerName || !formData.date || !formData.serviceType || serviceLines.length === 0) {
            toast.error("All fields are required");
            return;
        }
         else {
            setLoading(true);
            try {
                const response = await createMaintenanceRecord({ ...formData, serviceLine: serviceLines });
                if (response.data) {
                    toast.success("Record Added Successfully");
                    setOpen(false);
                    fetchMaintenanceData();
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error(error?.response?.data?.message);
            } finally {
                setLoading(false);
            }
        }
    };
    console.log(serviceLines)

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
                <form onSubmit={addRecord} className="max-h-[90vh] overflow-y-auto p-">
                    <div className="flex items-center w-full gap-2 justify-center relative pb-4">
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
                            <InputField label="Mileage" fieldKey="millage" value={formData} setValue={setFormData} isNumber={true}/>
                            <InputField label="Dealer Name" fieldKey="dealerName" value={formData} setValue={setFormData} />
                        </div>
                        <BasicDatePicker label="Date" fieldKey="date" value={formData} setValue={setFormData} />
                        <CustomDropdown label="Service Type" fieldKey="serviceType" value={formData} setValue={setFormData} />
                        
                    </div>


                    <div className="w-full pt-2">
                        <div className="flex items-center justify-between">
                            <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.6rem] font-medium`}>
                                Add Service Line
                            </p>
                            <div
                                className="bg-[#499cfe] text-[1.7rem] text-white p-1 rounded-md cursor-pointer"
                                onClick={addServiceLine}
                            >
                                <CiCirclePlus />
                            </div>
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
                                            <div
                                                className="text-red-500 text-xl cursor-pointer"
                                                onClick={() => removeServiceLine(index)}
                                            >
                                                <MdDelete />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center justify-center">
                            <button
                                className=" p-3 rounded-lg bg-[#499cfe] text-white text-[1.2rem] font-medium w-[60%]  mt-4"
                                type="submit"
                            >
                                {loading ? (
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin"
                                    />
                                ) : (
                                    "Add Record"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

export default AddRecord;
