import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import AddInvoice from "./AddInvoice";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { adminInvoice, getAdminCompanyDetail } from "../../API/adminServices";
import { BeatLoader } from "react-spinners";
import NoDataFound from "../../GlobalComponents/NoDataFound/NoDataFound";
import Pagination from "../../AdminComponents/Pagination/Pagination";
import Search from "../../AdminComponents/Search/Search";

const AdminInvoices = () => {
  const { theme } = useTheme();
  const { companyId } = useGlobalContext();
  const { addInvoice, setAddInvoice } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [invoicesData, setInvoicesData] = useState([]); 
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchAdminCompanyDetailData = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await adminInvoice({
        userId: id,
        skip,
        take,
        search,
      });
      if (response) {
        console.log("API Response:", response.data);
        setInvoicesData(response?.data?.data || []);
        setTotalCount(response?.data?.count || 0); 
      }
    } catch (error) {
      console.log("Error while fetching data:", error);
      setInvoicesData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [skip, take, search]); 

  useEffect(() => {
    if (companyId) {
      fetchAdminCompanyDetailData(companyId);
    }
  }, [fetchAdminCompanyDetailData, companyId]);

  console.log("company id to get invoice:", companyId);

  
  const formatDate = (dateString) => {
    if (!dateString || dateString === "0000-00-00") {
      return "N/A";
    }
    
    try {
      let date;
      if (dateString.includes("GMT")) {
        date = new Date(dateString);
      } else if (dateString.includes("-")) {
        const parts = dateString.split("-");
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            date = new Date(parts[0], parts[1] - 1, parts[2]);
          } else {
            date = new Date(parts[2], parts[1] - 1, parts[0]);
          }
        }
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        return dateString; 
      }
      
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.log("Date parsing error:", error);
      return dateString; 
    }
  };

  const handlePageChange = (newPage) => {
    const newSkip = (newPage - 1) * take;
    setSkip(newSkip);
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const safeSkip = Number(skip) || 0;
  const safeTake = Number(take) || 10;
  const safeTotalCount = Number(totalCount) || 0;

  const totalPages = Math.ceil(safeTotalCount / safeTake) || 1;
  const currentPage = Math.floor(safeSkip / safeTake) + 1;

  const filteredInvoices = Array.isArray(invoicesData) ? invoicesData : [];

  return (
    <>
      <AddInvoice
        open={addInvoice}
        setOpen={setAddInvoice}
        refreshInvoices={() => fetchAdminCompanyDetailData(companyId)}
      />
      <div className='flex items-center justify-center gap-3 md:flex-row flex-col'>
        <div className='w-full'>
          <Search
            value={search}
            setValue={(value) => {
              setSearch(String(value || ''));
              setSkip(0);
            }}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <BeatLoader color="#009eff" loading={loading} mt-4 size={15} />
        </div>
      ) : (filteredInvoices?.length > 0 ?
        (
          <div className="overflow-x-auto ">
            <div className="min-w-[800px]">
              <motion.table
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                className={`min-w-full rounded-lg transition-all text-center
                    ${theme === "dark"
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
                            className={`${theme === "dark"
                              ? "bg-[#323335] border-[#323335]"
                              : "bg-transparent border border-[#b5b5b7]"
                              } text-center py-2 ${index === 0 ? "rounded-tl-xl" : ""
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
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice, index) => (
                      <motion.tr
                        key={invoice.id}
                        variants={rowVariants}
                        className={`${theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-50"
                          }`}
                      >
                        <td
                          className={`py-6 border ${theme === "dark"
                            ? "border-[#323335]"
                            : "border-[#b5b5b7]"
                            }`}
                        >
                          {formatDate(invoice.startDate)}
                        </td>
                        <td
                          className={`py-6 border ${theme === "dark"
                            ? "border-[#323335]"
                            : "border-[#b5b5b7]"
                            }`}
                        >
                          {formatDate(invoice.endDate)}
                        </td>
                        <td
                          className={`py-6 border ${theme === "dark"
                            ? "border-[#323335]"
                            : "border-[#b5b5b7]"
                            }`}
                        >
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            invoice.status === "1" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}>
                            {invoice.status === "1" ? "Paid" : "Pending"}
                          </span>
                        </td>
                        <td
                          className={`py-6 border ${theme === "dark"
                            ? "border-[#323335]"
                            : "border-[#b5b5b7]"
                            }`}
                        >
                          {invoice.image && invoice.image.trim() && !invoice.image.endsWith('/') ? (
                            <a
                              href={invoice.image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline inline-flex items-center gap-1"
                            >
                              📄 View Document
                            </a>
                          ) : (
                            <span className="text-gray-500">No Document</span>
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
      {filteredInvoices.length > 0 && safeTotalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          setTake={(newTake) => {
            const takeNumber = Number(newTake);
            if (!isNaN(takeNumber) && takeNumber > 0) {
              setTake(takeNumber);
              setSkip(0); 
            }
          }}
          setSkip={(newSkip) => {
            const skipNumber = Number(newSkip);
            if (!isNaN(skipNumber) && skipNumber >= 0) {
              setSkip(skipNumber);
            }
          }}
          take={safeTake}
          totalCount={safeTotalCount}
        />
      )}
    </>
  );
};

export default AdminInvoices;