import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import { getInvoices } from "../../API/portalServices";
import { BeatLoader } from "react-spinners";
import NoDataFound from "../../GlobalComponents/NoDataFound/NoDataFound";

const Invoices = () => {
    const { theme } = useTheme();

    const [loading, setLoading] = useState(false);
    const [invoiceData, setInvoiceData] = useState({})

    const fetchInvoiceData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getInvoices();
            setInvoiceData(response?.data?.data || {});
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvoiceData();
    }, []);

    const data = [
        { startDate: "12-2-2024", endDate: "12-2-2025", status: "Paid", document: "#" },
        { startDate: "12-2-2024", endDate: "12-2-2025", status: "Unpaid", document: "#" },
        { startDate: "12-2-2024", endDate: "12-2-2025", status: "Paid", document: "#" },
        { startDate: "12-2-2024", endDate: "12-2-2025", status: "Unpaid", document: "#" },
    ];

    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (<>
        {loading ? <div className="h-[80vh] flex items-center justify-center">
            <BeatLoader color="#2d9bff" />
        </div> : (invoiceData.length > 0 ? (
            <div className="overflow-x-auto ">
                <div className="min-w-[800px]">
                    <motion.table
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                        className={`min-w-full rounded-lg transition-all text-center
                    ${theme === "dark" ? "bg-[#1B1C1E] text-white" : "bg-white text-[#1B1C1E]"}`}
                    >
                        <thead>
                            <tr>
                                {['Start Date', 'End Date', 'Status', 'Document'].map((heading, index) => (
                                    <th key={index} className="py-3 border-0 mb-3">
                                        <p className={`${theme === "dark" ? "bg-[#323335] border-[#323335]" : "bg-transparent border border-[#b5b5b7]"} text-center py-2 ${index === 0 ? 'rounded-tl-xl' : ''} ${index === 3 ? 'rounded-tr-xl' : ''}`}>{heading}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceData.map((item, index) => (
                                <motion.tr
                                    key={index}
                                    variants={rowVariants}
                                    className={`${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
                                >
                                    <td className={`py-6 border ${theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"}`}> {new Date(item.startDate).toLocaleDateString(
                                        "en-GB",
                                        {
                                            day: "numeric",
                                            month: "numeric",
                                            year: "numeric",
                                        }
                                    )}</td>
                                    <td className={`py-6 border ${theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"}`}> {new Date(item.endDate).toLocaleDateString(
                                        "en-GB",
                                        {
                                            day: "numeric",
                                            month: "numeric",
                                            year: "numeric",
                                        }
                                    )}</td>
                                    <td className={`py-6 border ${theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"}`}>{item.status==="0"?"Unpaid":"Paid"}</td>
                                    <td className={`py-6 border ${theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"}`}>
                                        <a href={item.image} target="_blank" className="text-blue-500 hover:underline">
                                            View Document
                                        </a>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </motion.table>
                </div>
            </div>) : <div className="h-[80vh] flex items-center justify-center"><NoDataFound /></div>)}
    </>
    );
};

export default Invoices;
