import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from '../../Contexts/ThemeContext'
import InputField from './Input'
import ImageUploader from './ImageUploader'
import Switch from './Switch'
import DocumentUploader from './DocumentUploader'
import BasicDatePicker from '../../Components/Buttons/BasicDatePicker'
import { toast } from 'react-toastify'
import { addVehicle, getMakes } from '../../API/portalServices'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom'
import MakesDropdown from '../../Components/DropDown/MakesDropDown'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";


function AddVehicle() {
    const { theme } = useTheme()
    const [loading, setLoading] = useState(false)
    const [vehicleImages, setVehicleImages] = useState([])
    const [regDocs, setRegDocs] = useState([])
    const [insuranceDocs, setInsuranceDocs] = useState([])
    const [inspectionDocs, setInspectionDocs] = useState([])
    const [additionalDocs, setAdditionalDocs] = useState([])
    const [additionalDates, setAdditionalDates] = useState([null]) // Initialize with one null date
    const navigate = useNavigate();
    const [vehicleData, setVehicleData] = useState({
        vinNumber: "",
        make: "",
        model: "",
        insuranceExpiry: "",
        inspectionExpiry: "",
        registrationNumber: "",
        mileage: "",
        chassis: "",
        numberPlate: "",
        additionalExpiry: "",  // Keep for backward compatibility
        registrationExpiry: "",
        manufacturingYear: "",
        insuranceStatus: "0",
        registrationStatus: "0",
        inspectionStatus: "0",
        additionalStatus: "0",
        status: "",
        additionalTitles: ""
    });

    // Function to add a new date field
    const addDateField = () => {
        setAdditionalDates([...additionalDates, null]);
    };

    // Function to remove a date field
    const removeDateField = (index) => {
        if (additionalDates.length > 1) {
            const newDates = [...additionalDates];
            newDates.splice(index, 1);
            setAdditionalDates(newDates);
        } else {
            toast.error("At least one additional date is required");
        }
    };

    // Function to update a specific date
    const updateDate = (index, newDate) => {
        const updatedDates = [...additionalDates];
        updatedDates[index] = newDate;
        setAdditionalDates(updatedDates);
    };

    console.log("additionalDates", additionalDates)

    const handleAddVehicle = async () => {
        if (!vehicleData?.make || !vehicleData?.model || !vehicleData?.vinNumber || !vehicleData?.numberPlate || !vehicleData?.manufacturingYear || !vehicleData?.registrationExpiry) {
            toast.error("All fields are required")
        } else if (regDocs.length === 0 || insuranceDocs.length === 0 || inspectionDocs.length === 0 || vehicleImages.length === 0 || additionalDocs.length === 0) {
            toast.error("All documents are required")
        } else if (vehicleData.vinNumber.length !== 17) {
            toast.error("Vin Number must be 17 characters")
        } else if (additionalDates.length === 0 || additionalDates.some(date => date === null)) {
            toast.error("All additional dates must be valid")
        } else {
            setLoading(true)
            try {
                // Format dates properly before sending to API
                const formattedDates = additionalDates.map(date => 
                    date ? dayjs(date).format('YYYY-MM-DD') : ''
                );
                
                // Include the additional dates array in the submission
                const response = await addVehicle({
                    ...vehicleData,
                    image: vehicleImages,
                    registrationDocument: regDocs,
                    insuranceDocument: insuranceDocs,
                    inspectionDocument: inspectionDocs,
                    additionalDocuments: additionalDocs,
                    additionalExpiry: formattedDates // Send array of formatted dates
                })

                if (response.data) {
                    toast.success("Vehicle Added Successfully")
                    console.log(response.data);
                    navigate("/vehicles") // Changed to lowercase to match route definition
                }
            } catch (error) {
                console.log(error);
                if (error.response?.data?.error) {
                    const errorData = error?.response?.data?.error;

                    if (errorData.vinNumber && Array.isArray(errorData.vinNumber)) {
                        toast.error(errorData.vinNumber[0]);
                    }
                    else if (Array.isArray(errorData) && errorData.length > 0) {
                        toast.error(errorData[0]);
                    }
                    else {
                        toast.error("Something went wrong");
                    }
                } else {
                    toast.error("Something went wrong");
                }
            } finally {
                setLoading(false)
            }
        }
    }

    const [makesData, setMakesData] = useState([])

    const fetchMakesData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getMakes();
            setMakesData(response?.data?.data || {});
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMakesData();
    }, [fetchMakesData]);

    return (
        <div>
            <div className='flex gap-5 lg:flex-row flex-col'>
                <div className={`w-full lg:w-[50%] ${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                    <div className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>Details</div>
                    <div className='pt-3 flex flex-col gap-8'>
                        <MakesDropdown
                            label="Vehicle Make"
                            value={vehicleData}
                            setValue={setVehicleData}
                            fieldKey="make"
                            options={makesData}
                        />
                        <InputField label='Model' value={vehicleData} setValue={setVehicleData} fieldKey="model" />
                        <InputField label='Vin Number' value={vehicleData} setValue={setVehicleData} fieldKey="vinNumber" />
                        <InputField label='Miles' value={vehicleData} setValue={setVehicleData} fieldKey="mileage" />
                        <InputField label='Number Plate' value={vehicleData} setValue={setVehicleData} fieldKey="numberPlate" />
                        <div className='flex gap-6 sm:gap-3 sm:flex-row flex-col'>
                            <BasicDatePicker label="Manufacturing Year" value={vehicleData} setValue={setVehicleData} fieldKey="manufacturingYear" />
                            <BasicDatePicker label="Registration Expiry" value={vehicleData} setValue={setVehicleData} fieldKey="registrationExpiry" />
                        </div>
                        <div className='flex gap-6 sm:gap-3 sm:flex-row flex-col'>
                            <BasicDatePicker label="Insurance Expiry" value={vehicleData} setValue={setVehicleData} fieldKey="insuranceExpiry" />
                            <BasicDatePicker label="Vehicle Inspection" value={vehicleData} setValue={setVehicleData} fieldKey="inspectionExpiry" />
                        </div>
                    </div>
                </div>
                <div className='w-full lg:w-[50%] flex flex-col gap-3'>
                    <div className={` ${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                        <div className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>Vehicle Images</div>
                        <div className=''>
                            <ImageUploader value={vehicleImages} setValue={setVehicleImages} />
                        </div>
                    </div>
                    <div className={`${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                        <div>
                            <div className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Registration Documents <Switch value={vehicleData} setValue={setVehicleData} fieldKey="registrationStatus" /></div>
                            <div className=''>
                                <DocumentUploader value={regDocs} setValue={setRegDocs} />
                            </div>
                        </div>
                        <div>
                            <div className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Insurance Documents <Switch value={vehicleData} setValue={setVehicleData} fieldKey="insuranceStatus" /></div>
                            <div className=''>
                                <DocumentUploader value={insuranceDocs} setValue={setInsuranceDocs} />
                            </div>
                        </div>
                        <div>
                            <div className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Inspection Documents <Switch value={vehicleData} setValue={setVehicleData} fieldKey="inspectionStatus" /></div>
                            <div >
                                <DocumentUploader value={inspectionDocs} setValue={setInspectionDocs} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Multiple Additional Dates Section */}
            <div className={`${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl mt-3`}>
                <div className="flex justify-between items-center mb-4">
                    <div className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>Additional Document Dates</div>
                    <button
                        onClick={addDateField}
                        className="bg-[#479cff] py-2 px-4 rounded-lg text-white text-sm font-medium"
                    >
                        Add Date
                    </button>
                </div>

                {additionalDates.map((date, index) => (
                    <div key={index} className="flex items-center gap-2 mb-4">
                        <div className="flex-1">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label={`Date ${index + 1}`}
                                    value={date ? dayjs(date) : null}
                                    onChange={(newValue) => updateDate(index, newValue)}
                                    sx={{
                                        width: "100%",
                                        fontWeight: 500,
                                        borderRadius: "0.75rem",
                                        backgroundColor: theme === "dark" ? "#1b1c1e" : "#f7f7f7",
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: "transparent",
                                            color: theme === "dark" ? "white" : "black",
                                            borderRadius: "0.75rem",
                                            border: theme === "dark" ? "none" : "1px solid #e8e8e8",
                                            "& fieldset": {
                                                borderRadius: "0.75rem",
                                                border: theme === "dark" ? "none" : "1px solid #e8e8e8",
                                            },
                                        },
                                        "& .MuiInputBase-input": {
                                            color: theme === "dark" ? "white" : "black",
                                        },
                                        "& .MuiFormLabel-root": {
                                            color: theme === "dark" ? "white" : "black",
                                        },
                                        "& .MuiIconButton-root": {
                                            color: theme === "dark" ? "white" : "black",
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                        <div
                            onClick={() => removeDateField(index)}
                            className="bg-red-500 py-3.5 px-3 rounded-lg text-white text-xl font-medium cursor-pointer"
                            disabled={additionalDates.length === 1}
                        >
                            <IoClose />
                        </div>
                    </div>
                ))}
                {additionalDates.length === 0 && (
                    <p className={`${theme === "dark" ? "text-red-400" : "text-red-500"} text-sm`}>
                        At least one additional date is required
                    </p>
                )}
            </div>
            <div className='w-full pt-3 flex flex-col gap-3'>
                <div className={`${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                    <div>
                        <div className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Additional Documents <Switch value={vehicleData} setValue={setVehicleData} fieldKey="additionalStatus" /></div>
                        <div className=''>
                            <DocumentUploader value={additionalDocs} setValue={setAdditionalDocs} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex items-center justify-center my-5'>
                <div onClick={handleAddVehicle} className='bg-[#479cff] w-full md:w-[40%] py-4 rounded-2xl text-center font-medium text-white cursor-pointer'>
                    {loading ? (
                        <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin"
                        />
                    ) : (
                        "Add"
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddVehicle