import React, { useEffect, useRef, useState } from "react";
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
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { archiveVehicle, delVehicle } from "../../API/portalServices";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Topbar = ({ setSide }) => {
  const [active, setActive] = useState("");
  const { theme } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {
    vehicle,
    setVehicle,
    addRecord,
    setAddRecord,
    addTransfer,
    setAddTransfer,
  } = useGlobalContext();
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  const titles = {
    "/Settings": "Settings",
    "/Vehicles": t("vehicles_management"),
    "/Dashboard": t("dashboard"),
    "/Chat": "Chat",
    "/Invoices": "Invoices",
    "/Drivers": "Drivers",
    "/Requests": "Requests",
  };

  const [loadingArchive, setLoadingArchive] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleArchive = async (id) => {
    setLoadingArchive(true);
    try {
      const response = await archiveVehicle(id);
      if (response.data) {
        toast.success("Vehicle Archived Status Changed Successfully");
        const updatedVehicle = {
          ...vehicle,
          isArchive: vehicle.isArchive === "1" ? "0" : "1",
        };
        setVehicle(updatedVehicle);
        localStorage.setItem("vehicle", JSON.stringify(updatedVehicle));
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingArchive(false);
    }
  };
  const handleDelete = async (id) => {
    setLoadingDelete(true);
    try {
      const response = await delVehicle(id);
      if (response.data) {
        toast.success("Vehicle Deleted Successfully");
        navigate("/Vehicles");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleShare = () => {
    let currentUrl = window.location.href;

    const publicUrl = currentUrl.replace("/Vehicles/", "/PublicPage/");

    navigator.clipboard
      .writeText(publicUrl)
      .then(() => {
        toast.success("Public link copied to clipboard!");
        setOpen(false);
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
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
          className={`w-full flex items-center justify-between ${theme === "dark" ? "text-white" : "text-black"
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
            {active.startsWith("/Vehicles/") && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  {t('vehicle_details')}
                </p>
              </div>
            )}
            {active.startsWith("/Update-Vehicle") && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  {t('update_vehicle')}
                </p>
              </div>
            )}
            {active.startsWith("/VehicleMaintenence/") && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  {t('maintenance_record')}
                </p>
              </div>
            )}
            {active.startsWith("/VehicleRequests/") && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  {t('vehicle_requests')}
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
                  {t('update_vehicle')}
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
                  {t('privacy_policy')}
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
                  {t('about_us')}
                </p>
              </div>
            )}
            {active === "/TermsConditions" && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  {t('terms_conditions')}
                </p>
              </div>
            )}
            {active === "/SearchedVehicle" && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  {t('vehicle_details')}
                </p>
              </div>
            )}
            {active.startsWith("/ViewLogs/") && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  {t('view_logs')}
                </p>
              </div>
            )}
            {active.startsWith("/VehicleGarages/") && (
              <div className="flex items-center gap-2">
                <img
                  src={theme === "dark" ? back : backLight}
                  alt=""
                  className="w-[1.6rem] cursor-pointer"
                  onClick={() => navigate(-1)}
                />
                <p className="text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium">
                  {t('vehicle_garages')}
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
                  {t('language')}
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
                  {t('add_vehicle')}
                </p>
              </div>
            )}

            {active === "/Dashboard" && <p>{t("welcome_back")}</p>}
          </div>
          { }
          <div className="flex items-center gap-2">
            {/* {active === "/Vehicles" && (
              <div
                onClick={() => setAddTransfer(true)}
                className="flex items-center gap-2 py-2.5 shadow-md px-3 cursor-pointer rounded-lg text-white bg-[#323334]"
              >
                <FiPlus className="text-[1.5rem]" />
                <span className="sm:block hidden">Transfer Vehicle</span>
              </div>
            )} */}
            {active === "/Vehicles" && (
              <Link
                to="/Add-Vehicle"
                className="flex items-center gap-2 py-2 px-3 rounded-lg text-white bg-[#2d9bff]"
              >
                <FiPlus className="text-[1.5rem]" />
                <span className="sm:block hidden">{t("add_vehicles")}</span>
              </Link>
            )}
          </div>
          {active.startsWith("/VehicleMaintenence/") && (
            <div
              onClick={() => setAddRecord(true)}
              className="flex items-center cursor-pointer gap-2 py-2 px-3 rounded-lg text-white bg-[#2d9bff]"
            >
              <FiPlus className="text-[1.5rem]" />
              <span className="sm:block hidden">Add Record</span>
            </div>
          )}
          {active.startsWith("/Vehicles/") && (
            <div className="relative">
              <img
                src={theme === "dark" ? ham : hamLightCar}
                alt=""
                className="w-[2rem] cursor-pointer"
                onClick={() => setOpen(!open)}
              />
              {open && (
                <div onClick={() => setOpen(false)} className="absolute shadow-2xl bg-white z-50 text-[#7587a9] w-[200px] right-4 top-3 rounded-b-3xl flex flex-col rounded-tr-lg  rounded-tl-3xl">
                  <p>
                    <Link
                      to="/Update-Vehicle"
                      className="flex items-center gap-2 p-3"
                    >
                      <BiSolidEditAlt /> {t("edit_vehicle")}
                    </Link>
                  </p>

                  <p
                    onClick={() => handleDelete(vehicle?.id)}
                    className="flex items-center cursor-pointer gap-2 p-3 border-t-2 rounded-t-4xl border-[#e4e4e4]"
                  >
                    <RiDeleteBin4Fill />{" "}
                    {loadingDelete ? t("please_wait") : t("delete_vehicle")}
                  </p>
                  <p
                    onClick={() => handleArchive(vehicle?.id)}
                    className="flex items-center cursor-pointer gap-2 p-3 border-t-2 rounded-t-4xl border-[#e4e4e4]"
                  >
                    <IoArchiveSharp />
                    {loadingArchive
                      ? t("please_wait")
                      : vehicle?.isArchive === "0"
                        ? t("archive_vehicle")
                        : t("unarchive_vehicle")}
                  </p>
                  <p
                    onClick={handleShare}
                    className="flex items-center cursor-pointer gap-2 p-3 border-t-2 rounded-t-4xl border-[#e4e4e4]"
                  >
                    <IoShareSocial /> {t("share")}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Topbar;
