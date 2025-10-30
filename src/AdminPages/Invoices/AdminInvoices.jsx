import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import AddInvoice from "./AddInvoice";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { adminInvoice, getAdminCompanyDetail, adminInvoiceStatus } from "../../API/adminServices";
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

  const [updatingId, setUpdatingId] = useState(null);

  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    // newStatus expected to be 'Paid' or 'Unpaid'
    try {
      // close dropdown immediately
      setDropdownOpenId(null);
      setUpdatingId(id);
      await adminInvoiceStatus({ id, status: newStatus });
      // refresh list
      fetchAdminCompanyDetailData(companyId);
    } catch (error) {
      console.error('Error updating invoice status:', error);
    } finally {
      setUpdatingId(null);
    }
  }; 

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
                            } relative`}
                        >
                          <div className="flex items-center justify-center">
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setDropdownOpenId(dropdownOpenId === invoice.id ? null : invoice.id)}
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none ${invoice.status === "1" ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                aria-haspopup="true"
                                aria-expanded={dropdownOpenId === invoice.id}
                              >
                                {updatingId === invoice.id ? (
                                  <BeatLoader size={6} color={invoice.status === "1" ? '#16a34a' : '#d97706'} />
                                ) : (
                                  <span>{invoice.status === "1" ? 'Paid' : 'Unpaid'}</span>
                                )}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.096l3.71-3.865a.75.75 0 111.08 1.04l-4.25 4.424a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                              </button>

                              {dropdownOpenId === invoice.id && (
                                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg ring-1 ring-black/5 z-10">
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(invoice.id, 'Paid')}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                                  >
                                    <span className="text-sm">Paid</span>
                                    {invoice.status === '1' && <span className="text-green-500">✓</span>}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(invoice.id, 'Unpaid')}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                                  >
                                    <span className="text-sm">Unpaid</span>
                                    {invoice.status !== '1' && <span className="text-yellow-600">✓</span>}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
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