import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../Contexts/ThemeContext';
import { motion } from 'framer-motion';
import logoLight from './assets/logo-light.png';
import logoDark from './assets/logo-dark.png';
import back from '../../assets/back.png';
import backLight from '../../assets/backLight.png';
import InputField from '../../Components/InputField/InputField';
import CountryCode from '../../Components/DropDown/CountryCode';
import ImageUploader from '../../Components/ImageUploaders/ImageUploader';
import { toast, ToastContainer } from 'react-toastify';
import { portalRegistration } from '../../API/portalServices';
import { addUser } from '../../utils/ChatUtils';

function Signup() {
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
        contactNumber: "",
        address: "",
        houseNumber: "",
        city: "",
        street: "",
        zip: "",
        vatNum: "",

    });

    console.log(formData.contactNumber)

    const validateForm = () => {
       
        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long!");
            return false;
        }
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

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
    
        const fullContactNumber = `${countryCode}${formData.contactNumber}`;
        const { contactNumber, ...dataToUpload } = formData;
    
        setLoading(true);
        try {
            const response = await portalRegistration({
                ...dataToUpload,
                contactNumber: fullContactNumber,
                image: imageFile
            });
    
            if (response.data && response.data.user) {
                const user = response.data.user;
    
              
                await addUser({
                    fireId: Date.now().toString(), 
                    userAppId: `company_${user.company_id.toString()}`,
                    userEmail: user.email,
                    userName: user.name,
                    userPhone: user.phNumber,
                    profileImage: `https://carchive.jeuxtesting.com/Profile_Images/${user.image}`,
                    status: user.status.toString(),
              
                });
    
                toast.success("Registration successful!");
                setFormData({
                    name: "",
                    lastName: "",
                    userName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    gender: "male",
                    country: "",
                    contactNumber: "",
                    address: "",
                    houseNumber: "",
                    city: "",
                    street: "",
                    zip: "",
                    vatNum: "",
                });
                setImage(null);
                setImageFile(null);
    
                setTimeout(() => {
                    navigate('/');
                }, 2000);
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
            className={`min-h-screen p-8 ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-white"}`}
        >
            <ToastContainer />
            <motion.div
                className='w-full flex justify-center items-end py-4'
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
                <img src={theme === "dark" ? logoDark : logoLight} alt="Logo" className='w-[13rem]' />
            </motion.div>

            <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className='lg:px-24 py-3'
            >
                <div className='flex items-center gap-3'>
                    <motion.img
                        src={theme === "dark" ? back : backLight}
                        alt="Back"
                        className='w-[2rem] cursor-pointer'
                        onClick={() => navigate(-1)}
                        whileHover={{ scale: 1.1 }}
                    />
                    <p className={`${theme === "dark" ? "text-white" : "text-black"} font-medium text-[2rem]`}>Sign Up</p>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className='pt-5'
                    onSubmit={handleSignUp}
                >
                    <div className=' py-2'>
                        <InputField value={formData} setValue={setFormData} fieldKey="userName" label="User Name" isRequired={true}/>

                    </div>
                    <div className='grid md:grid-cols-2 gap-5 py-2'>
                        <InputField value={formData} setValue={setFormData} fieldKey="name" label="First Name" isRequired={true}/>
                        <InputField value={formData} setValue={setFormData} fieldKey="lastName" label="Last Name" isRequired={true}/>
                    </div>
                    <div className='flex lg:flex-row flex-col-reverse'>
                        <div className='w-full lg:w-[70%]'>
                            <div className='flex items-center gap-3 py-2 sm:flex-row flex-col'>
                                <div className='w-full sm:w-[25%]'>
                                    <CountryCode setCountryCode={setCountryCode} />
                                </div>
                                <InputField value={formData} setValue={setFormData} fieldKey="contactNumber" label="Contact Number" isNumber={true} isRequired={true}/>
                            </div>
                            <div className='py-2'><InputField label="Email" value={formData} setValue={setFormData} fieldKey="email" isRequired={true}/></div>
                            <div className='py-2'><InputField label="Password" type="password" value={formData} setValue={setFormData} fieldKey="password" isRequired={true}/></div>
                            <div className='py-2'><InputField label="Confirm Password" type="password" value={formData} setValue={setFormData} fieldKey="confirmPassword" isRequired={true}/></div>
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
                                           "Sign Up"
                                         )}
                        </motion.button>
                        <p className={`${theme === "dark" ? "text-white" : "text-black"} font-medium py-2`}>Already have an account? <Link to='/' className='text-[#479cff]'>Sign In</Link></p>
                    </motion.div>
                </motion.form>
            </motion.div>
        </motion.div>
    );
}

export default Signup;
