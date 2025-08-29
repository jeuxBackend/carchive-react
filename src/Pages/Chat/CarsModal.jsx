import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import back from "../../assets/back.png";
import backLight from "../../assets/backLight.png";
import { getCarsbyDriver } from "../../API/portalServices";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { initializeChat } from "../../utils/ChatUtils";
import { MessageCircle, Car } from 'lucide-react';
import { useTranslation } from "react-i18next";

function CarsModal({ open, setOpen, id, onSelectCar }) {
    if (!open) return null;
    const { theme } = useTheme();
    const { currentUserCompanyId } = useGlobalContext();
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    const fetchDriverCars = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getCarsbyDriver(id);
            setCars(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching driver's cars:", error);
            setError("Failed to load cars: " + error.message);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (open && id) {
            fetchDriverCars();
        }
    }, [id, open, fetchDriverCars]);

    const handleChatWithCar = async (car) => {
        try {
            const chatId = await initializeChat(
                currentUserCompanyId?.toString(), 
                id?.toString(), 
                car?.id?.toString(), 
                "Hello, I'd like to chat about this car."
            );
      
            onSelectCar({
                carId: car?.id?.toString(),
                name: car.name || "Unnamed Car",
                image: car.image && car.image[0] ? car.image[0] : null,
                model: car.model || "N/A",
                make: car.make || "N/A"
            });
      
            setOpen(false);
        } catch (error) {
            console.error("Error starting chat with car:", error);
            setError("Failed to initialize chat. Please try again.");
        }
    };

    return (
        <motion.div
            className={`bg-black/50 backdrop-blur-lg overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full poppins`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-center p-2 xs:p-4 sm:p-6 lg:p-10 w-full min-h-screen">
                <motion.div
                    className={`rounded-xl w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl 
                        p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg flex flex-col items-center justify-center gap-3 sm:gap-4
                        ${theme === "dark"
                            ? "bg-[#1b1c1e] border-2 border-[#323335]"
                            : "bg-white border-2 border-[#ECECEC]"
                        }`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Header */}
                    <div className="flex items-center w-full gap-2 justify-center relative">
                        <img
                            src={theme === "dark" ? back : backLight}
                            alt=""
                            className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 cursor-pointer absolute left-0 xs:left-2"
                            onClick={() => setOpen(false)}
                        />
                        <p
                            className={`${theme === "dark" ? "text-white" : "text-black"} 
                                text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-center px-8`}
                        >
                            {t("Select a Car")}
                        </p>
                    </div>

                    {/* Error display */}
                    {error && (
                        <div className="w-full px-3 py-2 sm:px-4 sm:py-3 text-center text-sm sm:text-base text-red-500 bg-red-100 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Cars listing */}
                    <div className="w-full">
                        {isLoading ? (
                            <div className={`text-center py-6 text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                Loading cars...
                            </div>
                        ) : cars.length === 0 ? (
                            <div className={`text-center py-6 text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                No cars found for this driver.
                            </div>
                        ) : (
                            <div className="space-y-2 sm:space-y-3 max-h-[50vh] xs:max-h-[55vh] sm:max-h-[60vh] lg:max-h-[65vh] overflow-y-auto p-1 sm:p-2">
                                {cars.map((car) => (
                                    <div
                                        key={car.id}
                                        className={`rounded-lg p-2 xs:p-3 sm:p-4 ${theme === "dark" ? "bg-[#282a2d] hover:bg-[#323335]" : "bg-gray-50 hover:bg-gray-100"
                                            } transition-all duration-200 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-0`}
                                    >
                                        {/* Left side with car image and details */}
                                        <div className="flex items-start xs:items-center w-full xs:w-auto">
                                            {/* Circular image */}
                                            <div className="mr-3 sm:mr-4 flex-shrink-0">
                                                {car.image && car.image[0] ? (
                                                    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-blue-500">
                                                        <img
                                                            src={car.image[0]}
                                                            alt={car.make || "Car"}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://via.placeholder.com/56x56?text=Car";
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500">
                                                        <span className="text-blue-500 text-sm sm:text-lg font-bold">
                                                            {car.make ? car.make.charAt(0).toUpperCase() : "C"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Car details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center flex-wrap">
                                                    <h3 className={`font-medium text-sm xs:text-base sm:text-lg ${theme === "dark" ? "text-white" : "text-gray-900"} truncate`}>
                                                        {car.make || "Unnamed Car"}
                                                    </h3>
                                                    <Car size={14} className="ml-2 text-blue-500 flex-shrink-0 xs:inline hidden" />
                                                </div>
                                                <div className="space-y-0.5 xs:space-y-1">
                                                    <p className={`text-xs xs:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} truncate`}>
                                                        {t("model")}: {car.model || "N/A"}
                                                    </p>
                                                    {car.vinNumber && (
                                                        <p className={`text-xs xs:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} truncate`}>
                                                            {t("Vin Number")}: {car.vinNumber}
                                                        </p>
                                                    )}
                                                    {car.numberPlate && (
                                                        <p className={`text-xs xs:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} truncate`}>
                                                            {t("number_plate")}: {car.numberPlate}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chat button */}
                                        <button
                                            onClick={() => handleChatWithCar(car)}
                                            className={`flex items-center justify-center gap-2 px-3 py-2 xs:px-4 xs:py-2 cursor-pointer rounded-lg 
                                                w-full xs:w-auto min-w-[80px] text-sm xs:text-base ${theme === "dark"
                                                ? "bg-[#479cff] hover:bg-[#3a8ae6] text-white"
                                                : "bg-[#479cff] hover:bg-[#3a8ae6] text-white"
                                                } transition-colors flex-shrink-0`}
                                        >
                                            <MessageCircle size={16} className="xs:size-[18px]" />
                                            <span>Chat</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default CarsModal;