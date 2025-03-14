import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import AddInvoice from "./AddInvoice";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { getAdminCompanyDetail } from "../../API/adminServices";
import { BeatLoader } from "react-spinners";
import NoDataFound from "../../GlobalComponents/NoDataFound/NoDataFound";

const AdminInvoices = () => {
  const { theme } = useTheme();
  const { companyId } = useGlobalContext();
  const { addInvoice, setAddInvoice } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [companyDetailData, setCompanyDetailData] = useState({});

  const fetchAdminCompanyDetailData = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await getAdminCompanyDetail(id);
      if (response) {
        console.log("dat:", response.data);
      }
      setCompanyDetailData(response?.data?.data || {});
    } catch (error) {
      console.log("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAdminCompanyDetailData(companyId);
  }, [fetchAdminCompanyDetailData, companyId]);
  console.log("company id to get invoice:", companyId);

  const invoices = companyDetailData?.invoices || [];

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      <AddInvoice
        open={addInvoice}
        setOpen={setAddInvoice}
        refreshInvoices={() => fetchAdminCompanyDetailData(companyId)}
      />
      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <BeatLoader color="#009eff" loading={loading} mt-4 size={15} />
        </div>
      ) :  (invoices?.length > 0 ?
        (
        <div className="overflow-x-auto ">
          <div className="min-w-[800px]">
            <motion.table
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
              className={`min-w-full rounded-lg transition-all text-center
                    ${
                      theme === "dark"
                        ? "bg-[#1B1C1E] text-white"
                        : "bg-white text-[#1B1C1E]"
                    }`}
            >
              <thead>
                <tr>
                  {["Start Date", "End Date", "Status", "Document"].map(
                    (heading, index) => (
                      <th key={index} className="py-3 border-0 mb-3">
                        <p
                          className={`${
                            theme === "dark"
                              ? "bg-[#323335] border-[#323335]"
                              : "bg-transparent border border-[#b5b5b7]"
                          } text-center py-2 ${
                            index === 0 ? "rounded-tl-xl" : ""
                          } ${index === 3 ? "rounded-tr-xl" : ""}`}
                        >
                          {heading}
                        </p>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {invoices.length > 0 ? (
                  invoices.map((invoice, index) => (
                    <motion.tr
                      key={invoice.id}
                      variants={rowVariants}
                      className={`${
                        theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td
                        className={`py-6 border ${
                          theme === "dark"
                            ? "border-[#323335]"
                            : "border-[#b5b5b7]"
                        }`}
                      >
                        {new Date(invoice.startDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td
                        className={`py-6 border ${
                          theme === "dark"
                            ? "border-[#323335]"
                            : "border-[#b5b5b7]"
                        }`}
                      >
                        {new Date(invoice.endDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td
                        className={`py-6 border ${
                          theme === "dark"
                            ? "border-[#323335]"
                            : "border-[#b5b5b7]"
                        }`}
                      >
                        {invoice.status === "1" ? "Paid" : "Pending"}
                      </td>
                      <td
                        className={`py-6 border ${
                          theme === "dark"
                            ? "border-[#323335]"
                            : "border-[#b5b5b7]"
                        }`}
                      >
                        {invoice.image ? (
                          <a
                            href={invoice.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View Document
                          </a>
                        ) : (
                          "No Document"
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-6 text-center">
                      No Invoices Found
                    </td>
                  </tr>
                )}
              </tbody>
            </motion.table>
          </div>
        </div>) : <div className="h-[74vh] flex items-center justify-center"><NoDataFound /></div>
      )}
    </>
  );
};

export default AdminInvoices;
