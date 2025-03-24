import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../Contexts/ThemeContext';
import { motion } from 'framer-motion';
import InputField from '../../Components/InputField/InputField';
import CountryCode from '../../Components/DropDown/CountryCode';
import ImageUploader from '../../Components/ImageUploaders/ImageUploader';
import { getProfile, updateProfile } from '../../API/portalServices';
import { toast } from 'react-toastify';



function UpdateProfile() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false)
    const [countryCode, setCountryCode] = useState('')
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "male",
        country: "",
        phNumber: "",
        address: "",
        houseNumber: "",
        city: "",
        street: "",
        zip: "",
        vatNum: "",

    });
    const [profileData, setProfileData] = useState({})

    const fetchProfileData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getProfile();
            if (response) {
                setProfileData(response?.data || {});
                setFormData({
                    name: response?.data?.name || "",
                    lastName: response?.data?.lastName || "",
                    userName: response?.data?.userName || "",
                    email: response?.data?.email || "",
                    password: "",
                    confirmPassword: "",
                    gender: response?.data?.gender || "male",
                    country: response?.data?.Company?.country || "",
                    phNumber: response?.data?.phNumber || "",
                    address: "",
                    houseNumber: response?.data?.Company?.houseNumber || "",
                    city: response?.data?.Company?.city || "",
                    street: response?.data?.Company?.street || "",
                    zip: response?.data?.Company?.zip || "",
                    vatNum: response?.data?.vatNum || "",
            
                })
                setImage(response?.data?.image || "")
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfileData();
    }, []);

      const validateForm = () => {
            
           
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match!");
                return false;
            }
            if (!formData.email.includes("@")) {
                toast.error("Invalid email format!");
                return false;
            }
            return true;
        };
    
        const handleUpdate = async (e) => {
            e.preventDefault();
            if (!validateForm()) return;
    
    
          
    
    
            const { contactNumber, email, ...dataToUpload } = formData;
    
            setLoading(true);
            try {
                const response = await updateProfile({
                    ...dataToUpload,
                    image: imageFile
                });
    
                if (response.data) {
                    toast.success("Update successful!");
            
                    setImage(null)
                    setImageFile(null)
                    fetchProfileData()
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Registration failed!");
            } finally {
                setLoading(false);
            }
        };

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-white"}`}
    >
     
    

        <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
           
        >
         
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className='pt-5'
                onSubmit={handleUpdate}
            >
                <div className=' py-2'>
                    <InputField value={formData} setValue={setFormData} fieldKey="userName" label="User Name" />

                </div>
                <div className='grid md:grid-cols-2 gap-5 py-2'>
                    <InputField value={formData} setValue={setFormData} fieldKey="name" label="First Name" />
                    <InputField value={formData} setValue={setFormData} fieldKey="lastName" label="Last Name" />
                </div>
                <div className='flex lg:flex-row flex-col-reverse'>
                    <div className='w-full lg:w-[70%]'>
                        <div className='flex items-center gap-3 py-2 sm:flex-row flex-col'>
                            {/* <div className='w-full sm:w-[20%]'>
                                <CountryCode setCountryCode={setCountryCode} />
                            </div> */}
                            <InputField value={formData} setValue={setFormData} fieldKey="phNumber" label="Contact Number" isNumber={true} isReadOnly={true}/>
                        </div>
                        <div className='py-2'><InputField label="Email" value={formData} setValue={setFormData} fieldKey="email" isReadOnly={true}/></div>
                        <div className='py-2'><InputField label="Password" type="password" value={formData} setValue={setFormData} fieldKey="password" isRequired={false}/></div>
                        <div className='py-2'><InputField label="Confirm Password" type="password" value={formData} setValue={setFormData} fieldKey="confirmPassword" isRequired={false}/></div>
                    </div>
                    <div className='flex items-center justify-center lg:justify-end w-full lg:w-[30%]'>
                        <ImageUploader setImageFile={setImageFile} setImage={setImage} image={image}/>
                    </div>
                </div>
                <div>
                    <p className={`${theme === "dark" ? "text-white" : "text-black"} font-medium text-[2rem]`}>Address</p>
                    <div className='grid md:grid-cols-2 gap-5 py-2'>
                        <InputField label="Street" value={formData} setValue={setFormData} fieldKey="street" />
                        <InputField label="House No" value={formData} setValue={setFormData} fieldKey="houseNumber" />
                    </div>
                    <div className='grid md:grid-cols-2 gap-5 py-2'>
                        <InputField label="Zip Code" value={formData} setValue={setFormData} fieldKey="zip" isNumber={true} />
                        <InputField label="City" value={formData} setValue={setFormData} fieldKey="city" />
                    </div>
                    <div className='grid md:grid-cols-2 gap-5 py-2'>
                        <InputField label="Country" value={formData} setValue={setFormData} fieldKey="country" />
                    </div>
                </div>
                <div className='pt-2'>
                    <p className={`${theme === "dark" ? "text-white" : "text-black"} font-medium text-[2rem]`}>VAT Number</p>
                    <div className='py-2'>
                        <InputField label="VAT Number" value={formData} setValue={setFormData} fieldKey="vatNum" />
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
                         {loading ? (
                                       <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin" />
                                     ) : (
                                       "Update"
                                     )}
                    </motion.button>
                  
                </motion.div>
            </motion.form>
        </motion.div>
    </motion.div>
    );
}

export default UpdateProfile;
