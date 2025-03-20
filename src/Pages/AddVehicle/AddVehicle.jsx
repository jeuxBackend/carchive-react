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


function AddVehicle() {
    const { theme } = useTheme()
    const [loading, setLoading] = useState(false)
    const [vehicleImages, setVehicleImages] = useState([])
    const [regDocs, setRegDocs] = useState([])
    const [insuranceDocs, setInsuranceDocs] = useState([])
    const [inspectionDocs, setInspectionDocs] = useState([])
    const [additionalDocs, setAdditionalDocs] = useState([])
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
        additionalTitles: ""

    });

    const handleAddVehicle = async () => {
        if (!vehicleData?.make || !vehicleData?.model || !vehicleData?.vinNumber || !vehicleData?.numberPlate || !vehicleData?.manufacturingYear || !vehicleData?.registrationExpiry || !vehicleData?.additionalExpiry) {
            toast.error("All fields are required")
        } else if (regDocs.length === 0 || insuranceDocs.length === 0 || inspectionDocs.length === 0 || vehicleImages.length === 0 || additionalDocs.length === 0) {
            toast.error("All documents are required")

        } else {
            setLoading(true)
            try {
                const response = await addVehicle({ ...vehicleData, image: vehicleImages, registrationDocument: regDocs, insuranceDocument: insuranceDocs, inspectionDocument: inspectionDocs, additionalDocuments: additionalDocs })
                if (response.data) {
                    toast.success("Vehicle Added Successfully")
                    console.log(response.data);
                    navigate("/Vehicles")
                }
            } catch (err) {
                console.log(err);
                toast.error("Something went wrong")
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
      }, []);
    return (
        <div>
            <div className='flex gap-5 lg:flex-row flex-col'>
                <div className={`w-full lg:w-[50%] ${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                    <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>Details</p>
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
                        <BasicDatePicker label='Additional Documents Expiry' value={vehicleData} setValue={setVehicleData} fieldKey="additionalExpiry" />
                    </div>

                </div>
                <div className='w-full lg:w-[50%] flex flex-col gap-3'>
                    <div className={` ${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                        <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>Vehicle Images</p>
                        <div className=''>
                            <ImageUploader value={vehicleImages} setValue={setVehicleImages} />

                        </div>

                    </div>
                    <div className={`${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                        <div>
                            <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Registration Documents <Switch value={vehicleData} setValue={setVehicleData} fieldKey="registrationStatus" /></p>
                            <div className=''>
                                <DocumentUploader value={regDocs} setValue={setRegDocs} />

                            </div>
                        </div>
                        <div>
                            <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Insurance Documents <Switch value={vehicleData} setValue={setVehicleData} fieldKey="insuranceStatus" /></p>
                            <div className=''>
                                <DocumentUploader value={insuranceDocs} setValue={setInsuranceDocs} />

                            </div>
                        </div>
                        <div>
                            <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Inspection Documents <Switch value={vehicleData} setValue={setVehicleData} fieldKey="inspectionStatus" /></p>
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
                        <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Additional Documents <Switch value={vehicleData} setValue={setVehicleData} fieldKey="additionalStatus" /></p>
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