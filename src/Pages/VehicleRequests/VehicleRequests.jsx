import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import backgroundpic from "../Requests/assets/bg.png";
import GradientButton from "../../Components/Buttons/GradientButton";
import RequestButton from "../../Components/Buttons/RequestButton";
// import g1 from "./assets/g1.png";
import { changeRequestStatus, getRequests, getVehicleById } from "../../API/portalServices";
import { BeatLoader } from "react-spinners";
import NoDataFound from "../../GlobalComponents/NoDataFound/NoDataFound";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import GarageCard from "../Requests/GarageCard";
// import ViewDetailsModal from "./Modals/ViewDetailsModal";

const VehicleRequests = () => {
    const { theme } = useTheme();
    const { id } = useParams()
    const [loading, setLoading] = useState(false);
    const [requestsData, setRequestsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchRequestsData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getVehicleById(id);
            setRequestsData(response?.data?.data?.garageRequests || []);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequestsData();
    }, []);

    const requestStatus = async (id, status) => {
        setLoading(true);
        try {
            const response = await changeRequestStatus({ id, status });
            if (response.data) {
                toast.success("Status Changed Successfully");
                fetchRequestsData();
            }
        } catch (error) {
            console.error(error.response);
            toast.error(error.response?.data?.message || "Error changing status");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (buyer) => {
        setSelectedUser(buyer);
        setIsModalOpen(true);
    };

    return (
        <>
            {loading ? (
                <div className="h-[80vh] flex items-center justify-center">
                    <BeatLoader color="#2d9bff" />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    

                    {/* Garage Requests */}
                    <motion.div
                        className="mt-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        
                        {requestsData?.length > 0 ? (
                            <motion.div
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.15 },
                                    },
                                }}
                            >
                                {requestsData?.map((data, index) => (
                                    <motion.div
                                        key={index}
                                        variants={{
                                            hidden: { opacity: 0, y: 10 },
                                            visible: { opacity: 1, y: 0 },
                                        }}
                                    >
                                        <GarageCard
                                            data={data}
                                            fetchRequestsData={fetchRequestsData}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="h-[40vh] flex items-center justify-center">
                                <NoDataFound />
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}

            {/* Modal */}
            {isModalOpen && selectedUser && (
                <ViewDetailsModal
                    theme={theme}
                    setOpen={setIsModalOpen}
                    userData={selectedUser}
                />
            )}
        </>
    );
};

export default VehicleRequests;
