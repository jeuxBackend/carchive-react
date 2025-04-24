import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import back from "../../assets/back.png";
import backLight from "../../assets/backLight.png";
import { getCarsbyDriver } from "../../API/portalServices";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { initializeChat } from "../../utils/ChatUtils";
import { MessageCircle, Car } from 'lucide-react';

function CarsModal({ open, setOpen, id, onSelectCar }) {
    if (!open) return null;
    const { theme } = useTheme();
    const { currentUserId } = useGlobalContext();
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
            // Attempt to initialize chat with proper IDs
            const chatId = await initializeChat(
                currentUserId?.toString(), 
                id?.toString(), 
                car?.id?.toString(), 
                "Hello, I'd like to chat about this car."
            );
      
            // Pass the car data to the parent component
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
            <div className="flex items-center justify-center py-10 w-full min-h-screen">
                <motion.div
                    className={`rounded-xl w-[90%] p-6 sm:w-[40rem] shadow flex flex-col items-center justify-center gap-4
                        ${theme === "dark"
                            ? "bg-[#1b1c1e] border-2 border-[#323335]"
                            : "bg-white border-2 border-[#ECECEC]"
                        }`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center w-full gap-2 justify-center relative">
                        <img
                            src={theme === "dark" ? back : backLight}
                            alt=""
                            className="w-[1.8rem] cursor-pointer absolute left-2"
                            onClick={() => setOpen(false)}
                        />
                        <p
                            className={`${theme === "dark" ? "text-white" : "text-black"} 
                                text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium`}
                        >
                            Select a Car
                        </p>
                    </div>

                    {/* Error display */}
                    {error && (
                        <div className="w-full px-4 py-3 text-center text-red-500 bg-red-100 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Cars listing */}
                    <div className="w-full">
                        {isLoading ? (
                            <div className={`text-center py-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                Loading cars...
                            </div>
                        ) : cars.length === 0 ? (
                            <div className={`text-center py-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                                No cars found for this driver.
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto p-2">
                                {cars.map((car) => (
                                    <div
                                        key={car.id}
                                        className={`rounded-lg p-3 ${theme === "dark" ? "bg-[#282a2d] hover:bg-[#323335]" : "bg-gray-50 hover:bg-gray-100"
                                            } transition-all duration-200 flex items-center justify-between`}
                                    >
                                        {/* Left side with car image and details */}
                                        <div className="flex items-center">
                                            {/* Circular image */}
                                            <div className="mr-4">
                                                {car.image && car.image[0] ? (
                                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500">
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
                                                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500">
                                                        <span className="text-blue-500 text-lg font-bold">
                                                            {car.make ? car.make.charAt(0).toUpperCase() : "C"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Car details */}
                                            <div>
                                                <div className="flex items-center">
                                                    <h3 className={`font-medium text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                                                        {car.make || "Unnamed Car"}
                                                    </h3>
                                                    <Car size={16} className="ml-2 text-blue-500" />
                                                </div>
                                                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                                    Model: {car.model || "N/A"}
                                                </p>
                                                {car.year && (
                                                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                                        Year: {car.year}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Chat button */}
                                        <button
                                            onClick={() => handleChatWithCar(car)}
                                            className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg ${theme === "dark"
                                                ? "bg-[#479cff] text-white"
                                                : "bg-[#479cff] text-white"
                                                } transition-colors`}
                                        >
                                            <MessageCircle size={18} />
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