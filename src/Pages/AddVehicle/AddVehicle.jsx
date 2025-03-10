import React from 'react'
import { useTheme } from '../../Contexts/ThemeContext'
import InputField from './Input'
import ImageUploader from './ImageUploader'
import Switch from './Switch'
import DocumentUploader from './DocumentUploader'
import BasicDatePicker from '../../Components/Buttons/BasicDatePicker'

function AddVehicle() {
    const { theme } = useTheme()
    return (
        <div>
        <div className='flex gap-5 lg:flex-row flex-col'>
            <div className={`w-full lg:w-[50%] ${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>Details</p>
                <div className='pt-3 flex flex-col gap-8'>
                    <InputField label='Vehicle Make' />
                    <InputField label='Model' />
                    <InputField label='Vin Number' />
                    <InputField label='Miles' />
                    <InputField label='Number Plate' />
                    <div className='flex gap-6 sm:gap-3 sm:flex-row flex-col'>
                        <BasicDatePicker label="Manufacturing Year" />
                        <BasicDatePicker label="Registration Expiry"  />
                    </div>
                    <div className='flex gap-6 sm:gap-3 sm:flex-row flex-col'>
                        <BasicDatePicker label="Insurance Expiry"/>
                        <BasicDatePicker label="Vehicle Inspection"/>
                    </div>
                    <BasicDatePicker label='Additional Documents Expiry' />
                </div>

            </div>
            <div className='w-full lg:w-[50%] flex flex-col gap-3'>
                <div className={` ${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                    <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>Vehicle Images</p>
                    <div className='grid md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'>
                        <ImageUploader />
                        <ImageUploader />
                        <ImageUploader />
                    </div>

                </div>
                <div className={`${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
                    <div>
                        <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Registration Documents <Switch /></p>
                        <div className='grid md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'>
                            <DocumentUploader />
                            <DocumentUploader />
                            <DocumentUploader />
                        </div>
                    </div>
                    <div>
                        <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Insurance Documents <Switch /></p>
                        <div className='grid md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'>
                            <DocumentUploader />
                            <DocumentUploader />
                            <DocumentUploader />
                        </div>
                    </div>
                    <div>
                        <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>Inspection Documents <Switch /></p>
                        <div className='grid md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'>
                            <DocumentUploader />
                            <DocumentUploader />
                            <DocumentUploader />
                        </div>
                    </div>
                </div>
            </div>
            
            </div>
            <div className='flex items-center justify-center my-5'>
                <div className='bg-[#479cff] w-full md:w-[40%] py-4 rounded-2xl text-center font-medium text-white'>
                    Add
                </div>
            </div>
        </div>
    )
}

export default AddVehicle