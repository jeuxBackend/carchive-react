import React, { useState } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { motion } from "framer-motion";
import Logo from "../../assets/logo.png";
import Bg from "./assets/login-bg.png";
import Lock from "./assets/password.png";
import Mail from "./assets/email.png";
import { Link, useNavigate } from "react-router-dom";
import Forgot from "./ForgotPassword/Forgot";
import OTP from "./ForgotPassword/OTP";
import ConfirmPassword from "./ForgotPassword/ConfirmPassword";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false)
    const [otp, setOTP] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();


    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleLogin = (e) => {
        e.preventDefault()
        if (!email || !password) {
            setError(true);
            setTimeout(() => setError(false), 500);
        } else {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                navigate("/Dashboard");
            }, 1500);
        }
    };

    return (
        <div>
            <Forgot open={open} setOpen={setOpen} setOTP={setOTP}/>
            <OTP open={otp} setOpen={setOTP} setPass={setConfirm}/>
            <ConfirmPassword open={confirm} setOpen={setConfirm}/>
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center relative w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${Bg})` }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
        >
           
            <div className="bg-black/50 w-full h-full fixed top-0" />

          
            <motion.div
                className="w-[90%] sm:w-[70%] lg:w-[45%] 2xl:w-[35%] flex flex-col items-center justify-center gap-8"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
             
                <motion.img
                    src={Logo}
                    alt="Logo"
                    className="w-[12rem] z-10"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />

              
                <motion.form onSubmit={handleLogin}
                    className="w-full flex flex-col items-center p-5 bg-white/20 backdrop-blur-[3px] shadow-xl rounded-2xl text-white z-10 border border-white/30"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <h1 className="text-3xl font-semibold text-white">Welcome</h1>
                    <p className="text-lg text-white/80">Sign in with your email</p>

                  
                    <motion.div
                        className={`w-full pt-5 flex flex-col gap-5 ${error ? "shake" : ""}`}
                        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                    
                        <motion.div
                            className="w-full flex items-center gap-3 bg-[#323335] p-3 rounded-xl border border-gray-600 hover:border-blue-400 transition-all"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img src={Mail} alt="Email" className="w-[2rem]" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="border-none outline-none bg-transparent text-white w-full placeholder-white/60"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </motion.div>

                  
                        <motion.div
                            className="w-full flex items-center gap-3 bg-[#323335] p-3 rounded-xl border border-gray-600 hover:border-blue-400 transition-all"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img src={Lock} alt="Password" className="w-[2rem]" />
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="Password"
                                className="border-none outline-none bg-transparent text-white w-full placeholder-white/60"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div onClick={togglePasswordVisibility} className="text-white cursor-pointer">
                                {isPasswordVisible ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                            </div>
                        </motion.div>
                    </motion.div>

                  
                    <div className="w-full flex items-center justify-end pt-2">
                        <span onClick={()=>setOpen(true)} className="cursor-pointer hover:underline">Forgot Password?</span>
                    </div>

                   
                    <motion.button
                        className="py-4 font-medium mt-3 w-full bg-blue-500 rounded-xl hover:bg-blue-600 transition-all relative"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ boxShadow: "0px 0px 10px rgba(45, 155, 255, 0.7)" }}
                        
                    >
                        {loading ? (
                            <motion.div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin"
                            />
                        ) : (
                            "Login"
                        )}
                    </motion.button>

            
                    <div className="w-full flex items-center justify-center gap-2 mt-3 font-medium">
                        Don't have an account?{" "}
                        <Link to="/Signup" className="text-blue-400 hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </motion.form>
            </motion.div>
        </motion.div>
        </div>
    );
};

export default Login;
