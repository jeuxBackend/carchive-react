import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../Contexts/ThemeContext';
import { motion } from 'framer-motion';
import InputField from '../../Components/InputField/InputField';
import CountryCode from '../../Components/DropDown/CountryCode';
import ImageUploader from '../../Components/ImageUploaders/ImageUploader';


function UpdateProfile() {
    const navigate = useNavigate();
    const { theme } = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`${theme === "dark" ? "bg-[#1b1c1e]" : "bg-white"}`}
        >
     

            <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className=''
            >

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='pt-5'
                >
                    <div className='grid md:grid-cols-2 gap-5 py-2'>
                        <InputField label="First Name" />
                        <InputField label="Last Name" />
                    </div>
                    <div className='flex lg:flex-row flex-col-reverse'>
                        <div className='w-full lg:w-[70%]'>
                            <div className='flex items-center gap-3 py-2 sm:flex-row flex-col'>
                                <div className='w-full sm:w-[20%]'>
                                    <CountryCode />
                                </div>
                                <InputField />
                            </div>
                            <div className='py-2'><InputField label="Email" /></div>
                            <div className='py-2'><InputField label="Password" type="password" /></div>
                            <div className='py-2'><InputField label="Confirm Password" type="password" /></div>
                        </div>
                        <div className='flex items-center justify-center lg:justify-end w-full lg:w-[30%]'>
                            <ImageUploader />
                        </div>
                    </div>
                    <div>
                        <p className={`${theme === "dark" ? "text-white" : "text-black"} font-medium text-[2rem]`}>Address</p>
                        <div className='grid md:grid-cols-2 gap-5 py-2'>
                            <InputField label="Street" />
                            <InputField label="House No" />
                        </div>
                        <div className='grid md:grid-cols-2 gap-5 py-2'>
                            <InputField label="Zip Code" />
                            <InputField label="City" />
                        </div>
                        <div className='grid md:grid-cols-2 gap-5 py-2'>
                            <InputField label="Country" />
                        </div>
                    </div>
                    <div className='pt-2'>
                        <p className={`${theme === "dark" ? "text-white" : "text-black"} font-medium text-[2rem]`}>VAT Number</p>
                        <div className='py-2'>
                            <InputField label="VAT Number" />
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className='flex items-center justify-center flex-col py-3'
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='bg-[#479cff] w-full md:w-[40%] py-3 md:py-4 rounded-xl text-[1.2rem] font-medium text-white'
                        >
                            Update Profile
                        </motion.button>
                       
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

export default UpdateProfile;
