import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from '../../Contexts/ThemeContext'
import InputField from './Input'
import ImageUploader from './ImageUploader'
import Switch from './Switch'
import DocumentUploader from './DocumentUploader'
import BasicDatePicker from '../../Components/Buttons/BasicDatePicker'
import { toast } from 'react-toastify'
import { addVehicle, getMakes, searchVehicle } from '../../API/portalServices'
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom'
import MakesDropdown from '../../Components/DropDown/MakesDropDown'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";
import { useGlobalContext } from '../../Contexts/GlobalContext'
import { CiSearch } from 'react-icons/ci'


function AddVehicle() {
    const { theme } = useTheme()
    const [loading, setLoading] = useState(false)
    const { setSearchVehicleData } = useGlobalContext()
    const [vehicleImages, setVehicleImages] = useState([])
    const [regDocs, setRegDocs] = useState([])
    const [insuranceDocs, setInsuranceDocs] = useState([])
    const [inspectionDocs, setInspectionDocs] = useState([])
    const [additionalDocs, setAdditionalDocs] = useState([])
    const [additionalDates, setAdditionalDates] = useState([""]) 
    const [additionalTitles, setAdditionalTitles] = useState([""])
    const [loadingVin, setLoadingVin] = useState(false)
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
        additionalExpiry: "",  
        registrationExpiry: "",
        manufacturingYear: "",
        insuranceStatus: "0",
        registrationStatus: "0",
        inspectionStatus: "0",
        additionalStatus: "0",
        status: "",
    });

    const addDateField = () => {
        setAdditionalDates([...additionalDates, null]);
    };

    const removeDateField = (index) => {
        if (additionalDates.length > 1) {
            const newDates = [...additionalDates];
            newDates.splice(index, 1);
            setAdditionalDates(newDates);
        } else {
            toast.error("At least one additional date is required");
        }
    };

    const updateDate = (index, newDate) => {
        const updatedDates = [...additionalDates];
        updatedDates[index] = newDate;
        setAdditionalDates(updatedDates);
    };

  

    const handleAddVehicle = async () => {
        if (!vehicleData?.make || !vehicleData?.model || !vehicleData?.vinNumber) {
            toast.error("Vehicle Make, Model, VIN Number fields are required")
        } else if (vehicleImages.length === 0 ) {
            toast.error("Vehicle images are required")
        } else if (vehicleData.vinNumber.length !== 17) {
            toast.error("Vin Number must be 17 characters")
        } else {
            setLoading(true)
            try {

                const formattedDates = additionalDates.map(date => 
                    date ? dayjs(date).format('YYYY-MM-DD') : ''
                );

                const response = await addVehicle({
                    ...vehicleData,
                    image: vehicleImages,
                    registrationDocument: regDocs,
                    insuranceDocument: insuranceDocs,
                    inspectionDocument: inspectionDocs,
                    additionalDocuments: additionalDocs,
                    additionalExpiry: formattedDates,
                    additionalTitles: additionalTitles
                })

                if (response.data) {
                    toast.success("Vehicle Added Successfully")
                    console.log(response.data);
                    navigate("/Vehicles") 
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

  const vinSearch = async () => {
    const vin = vehicleData.vinNumber;

    if (!vin) {
        toast.error("Please enter VIN number");
    } else if (vin.length !== 17) {
        toast.error("VIN number must be exactly 17 characters long");
    } else {
        setLoadingVin(true);
        try {
            const response = await searchVehicle({ vinNumber: vin });
            setSearchVehicleData(response?.data?.data || {});
            toast.success("Vehicle Found");
            navigate("/SearchedVehicle");
        } catch (error) {
            console.error("Error fetching data:", error);

            if (error.response?.data?.message?.vinNumber && Array.isArray(error.response.data.message.vinNumber)) {
                toast.error(error.response.data.message.vinNumber[0]);
            } else if (error.response?.data?.message) {
                if (typeof error.response.data.message === 'string') {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Invalid VIN number or vehicle not found");
                }
            } else if (error.response?.status === 403) {
                toast.error("Access denied or invalid VIN number");
            } else if (error.response?.status === 404) {
                toast.error("Vehicle not found");
            } else {
                toast.error("Something went wrong while searching for the vehicle");
            }
        } finally {
            setLoadingVin(false);
        }
    }
};


    return (
        <div>
            <div className='flex gap-5 lg:flex-row flex-col'>
                <div className={`w-full lg:w-[50%] ${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                    <div className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>Details</div>
                    <div className='pt-3 flex flex-col gap-3'>
                        <p className='text-[#fff]'>Make*</p>
                        <MakesDropdown
                            label="Vehicle Make"
                            value={vehicleData}
                            setValue={setVehicleData}
                            fieldKey="make"
                            options={makesData}
                        />
                        <p className={`${theme === "dark" ? "text-white" : "text-black"}`}>Model*</p>
                        <InputField label='Model' value={vehicleData} setValue={setVehicleData} fieldKey="model" />
                        <p className={`${theme === "dark" ? "text-white" : "text-black"}`}>VIN Number*</p>
                        <div className='flex items-center gap-2'>
                        <InputField label='Vin Number' value={vehicleData} setValue={setVehicleData} fieldKey="vinNumber" />
                        <div onClick={()=>vinSearch()} className=' bg-[#479cff] text-[1.8rem] text-white py-4 px-2.5 cursor-pointer rounded-xl'> {loadingVin ? (
                        <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin"
                        />
                    ) : (<CiSearch />)}</div>
                        </div>
                        <p className={`${theme === "dark" ? "text-white" : "text-black"}`}>Miles</p>
                        <InputField label='Miles' value={vehicleData} setValue={setVehicleData} fieldKey="mileage" />
                        <p className={`${theme === "dark" ? "text-white" : "text-black"}`}>Number Plate</p>
                        <InputField label='Number Plate' value={vehicleData} setValue={setVehicleData} fieldKey="numberPlate" />
                        <div className='flex gap-6 sm:gap-3 sm:flex-row flex-col pt-3'>
                            <BasicDatePicker label="Manufacturing Year" value={vehicleData} setValue={setVehicleData} fieldKey="manufacturingYear" />
                            <BasicDatePicker label="Registration Expiry" value={vehicleData} setValue={setVehicleData} fieldKey="registrationExpiry" />
                        </div>
                        <div className='flex gap-6 sm:gap-3 sm:flex-row flex-col pt-3'>
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
            
            <div className='w-full pt-3 flex flex-col gap-3'>
                <div className={`${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                    <div>
                        <div className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Additional Documents <Switch value={vehicleData} setValue={setVehicleData} fieldKey="additionalStatus" /></div>
                        <div className=''>
                            <DocumentUploader value={additionalDocs} setValue={setAdditionalDocs} type='additional' setAdditionalTitles={setAdditionalTitles} setAdditionalDates={setAdditionalDates}/>
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