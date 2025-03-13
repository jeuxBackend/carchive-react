import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { useTheme } from "../../Contexts/ThemeContext";
import hamLight from "./assets/ham-light.png";
import hamDark from "./assets/ham-dark.png";
import back from "../../assets/back.png";
import ham from "../../assets/hamburger.png";
import hamLightCar from "../../assets/hamLight.png";
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { IoArchiveSharp, IoShareSocial } from "react-icons/io5";
import backLight from "../../assets/backLight.png";
import { FaFileInvoice } from "react-icons/fa";
import { useGlobalContext } from "../../Contexts/GlobalContext";

const Topbar = ({ setSide }) => {
  const [active, setActive] = useState("");
  const { theme } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { setAddInvoice, setAddAbout, setAddPrivacy } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  const titles = {
    "/Admin/Settings": "Settings",
    "/Admin/Companies": "Company",
    "/Admin/Dashboard": "Dashboard",
    "/Admin/Chat": "Chat",

    "/Admin/Drivers": "Drivers",
    "/Admin/Garages": "Garage Owners",
  };

  return (
    <motion.div
      className="h-[5rem] flex items-center justify-between"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 w-full">
        <motion.div
          onClick={() => setSide(true)}
          className="block lg:hidden"
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <img
            src={theme === "dark" ? hamDark : hamLight}
            className="w-[2.5rem]"
            alt="menu"
          />
        </motion.div>

        <motion.div
          className={`w-full flex items-center justify-between ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div>
            {titles[active] && (
              <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                {titles[active]}
              </p>
            )}
            {active.startsWith("/Admin/Company/") && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  Luxury Vehicles
                </p>
              </div>
            )}

            {active === "/Update-Profile" && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  Profile Update
                </p>
              </div>
            )}
            {active === "/Privacy-Policy" && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  Privacy Policy
                </p>
              </div>
            )}
            {active === "/About" && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  About Us
                </p>
              </div>
            )}
            {active === "/Language" && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  Language
                </p>
              </div>
            )}
            {active === "/Invoices" && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  Invoices
                </p>
              </div>
            )}
            {active === "/Add-Vehicle" && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  Add Vehicle
                </p>
              </div>
            )}

            {active === "/Admin/Dashboard" && <p>Welcome Back, Julia 👋</p>}
          </div>

          {active === "/Admin/Vehicles" && (
            <Link
              to="/Add-Vehicle"
              className="flex items-center gap-2 py-2 px-3 rounded-lg text-white bg-[#2d9bff]"
            >
              <FiPlus className="text-[1.5rem]" />
              <span className="sm:block hidden">Add Vehicles</span>
            </Link>
          )}
          {active.startsWith("/Admin/Company/") && (
            <Link
              to="/Admin/Invoices"
              className="flex text-white items-center gap-2 bg-[#2d9bff] py-2 px-3 rounded-xl"
            >
              <FaFileInvoice className="sm:hidden" />
              <span className="sm:block hidden">Show Invoices</span>
            </Link>
          )}
          {active.startsWith("/Admin/Invoices") && (
            <div
              onClick={() => setAddInvoice(true)}
              className="flex text-white items-center gap-2 bg-[#2d9bff] py-2 px-2 sm:px-5 rounded sm:rounded-xl cursor-pointer"
            >
              <FiPlus className="sm:hidden" />
              <span className="sm:block hidden">Add Invoice</span>
            </div>
          )}
          {active.startsWith("/Admin/About") && (
            <div
              onClick={() => setAddAbout(true)}
              className="flex text-white items-center gap-2 bg-[#2d9bff] py-2 px-2 sm:px-5 rounded sm:rounded-xl cursor-pointer"
            >
              <FiPlus />
              <span className="sm:block hidden">About Us</span>
            </div>
          )}
          {active.startsWith("/Admin/Privacy-Policy") && (
            <div
              onClick={() => setAddPrivacy(true)}
              className={`text-white flex items-center gap-2 bg-[#2d9bff] py-2 px-2 sm:px-5 rounded sm:rounded-xl cursor-pointer`}
            >
              <FiPlus />
              <span className="sm:block hidden">Privacy Policy</span>
            </div>
          )}
          {/* {active.startsWith("/Company/") && (
                        <div className='relative'>
                            <img src={theme==="dark"?ham:hamLightCar} alt="" className='w-[2rem] cursor-pointer' onClick={()=>setOpen(!open)}/>
                            {open&&
                            <div className='absolute shadow-2xl bg-white z-50 text-[#7587a9] w-[200px] right-4 top-3 rounded-b-3xl flex flex-col rounded-tr-lg  rounded-tl-3xl'>
                                <p className='flex items-center gap-2 p-3'><BiSolidEditAlt /> Edit Vehicle</p>
                                <p className='flex items-center gap-2 p-3 border-t-2 rounded-t-4xl border-[#e4e4e4]'><RiDeleteBin4Fill /> Delete Vehicle</p>
                                <p className='flex items-center gap-2 p-3 border-t-2 rounded-t-4xl border-[#e4e4e4]'><IoArchiveSharp /> Archive</p>
                                <p className='flex items-center gap-2 p-3 border-t-2 rounded-t-4xl border-[#e4e4e4]'><IoShareSocial /> Share</p>
                            </div>}
                        </div>

                    )} */}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Topbar;
