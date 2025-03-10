import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logoutPic from "./logout.png";
import logoutDark from './logoutDark.png'
import { useTheme } from "../../Contexts/ThemeContext";
import GradientButton from "../Buttons/GradientButton";
import RequestButton from "../Buttons/RequestButton";



function Logout({ logout, setLogout }) {
  if (!logout) return null;
  const { theme } = useTheme()
  const navigate = useNavigate()

  const logoutHandle=()=>{
    navigate('/')
    setLogout(false)

  }




  return (
    <motion.div className={`bg-black/50 backdrop-blur-lg overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full poppins`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-center py-10 w-full min-h-screen ">
        <motion.div
          className={`rounded-xl w-[100%] sm:w-[30rem] shadow flex flex-col items-center justify-center gap-2
            ${theme === "dark" ? "bg-[#323335] border-2 border-[#323335]" : "bg-white border-2 border-[#ECECEC]"}`}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full p-6 flex flex-col gap-3">
            <div className="flex flex-col gap-3 justify-center items-center">
              <img src={theme==="dark"?logoutDark:logoutPic} alt="" className="w-[10rem]"/>
              <div className="text-center">
                <p className={`${theme==="dark"?"text-white":"text-black"} text-2xl font-medium py-2`}>Log Out</p>
                <p className={`${theme==="dark"?"text-[#8d8d8e]":"text-[#0000004d]"}  font-medium`}>
                Are you sure to sign out your account?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
            <div className="w-full cursor-pointer" onClick={()=>setLogout(false)}>
              <GradientButton name="Cancel"/>

              </div>
              <div className="w-full cursor-pointer" onClick={logoutHandle}>
              <RequestButton name="Logout"/>

              </div>
            </div>
            
            
          </div>
        </motion.div>
      </div>


    </motion.div>
  );
}

Logout.propTypes = {
  logout: PropTypes.bool.isRequired,
  setLogout: PropTypes.func.isRequired,
};

export default Logout;
