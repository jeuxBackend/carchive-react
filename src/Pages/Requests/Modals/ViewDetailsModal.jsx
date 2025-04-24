import React from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const ViewDetailsModal = ({ setOpen, userData, theme }) => {
    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50"
            onClick={() => setOpen(false)}
        >
            <motion.div
                className={`relative w-[90%] max-w-1/2 p-6 rounded-xl shadow-xl ${theme === "dark" ? "bg-[#1f1f1f] text-white" : "bg-white text-black"
                    }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="absolute top-4 right-4 text-xl cursor-pointer"
                    onClick={() => setOpen(false)}
                >
                    <IoClose />
                </button>

                <h2 className="text-2xl text-[#489BF9] font-semibold mb-4 flex justify-center">Buyer Details</h2>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <p className="text-lg text-[#323335] font-semibold">Name:</p>
                        <p className="text-gray-500 text-lg">{userData?.buyer?.name}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-lg text-[#323335] font-semibold">Email:</p>
                        <p className="text-gray-500 text-lg">{userData?.buyer?.email}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-lg text-[#323335] font-semibold">Phone:</p>
                        <p className="text-gray-500 text-lg">{userData?.buyer?.phNumber}</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-lg text-[#323335] font-semibold">VIN Number:</p>
                        <p className="text-gray-500 text-lg">{userData?.car?.vinNumber}</p>
                    </div>

                    <div className="">
                        <p className="text-lg text-[#323335] font-semibold">Message:</p>
                        <p className="text-gray-500 text-lg">{userData?.request?.message}</p>
                    </div>

                    <div className="">
                        <p className="text-lg text-[#323335] font-semibold">Document:</p>
                        <img
                            src={`${userData?.request?.document}`}
                            alt="Document"
                            className="w-full  h-auto rounded-lg border border-gray-200 mt-2"
                        />
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default ViewDetailsModal;
