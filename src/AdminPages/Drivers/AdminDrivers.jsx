import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import Dummy from "./img.png";
import DriverDetail from "../../AdminComponents/DriverDetail/DriverDetail";
import Dropdown from "../../AdminComponents/DropDown/Dropdown";
import Search from "../../AdminComponents/Search/Search";
import GradientButton from "../../AdminComponents/Logout/GradientButton";
import { bypassVerification, getAllAdminDrivers } from "../../API/adminServices";
import { getApproveAdminDrivers } from "../../API/adminServices";
import { getUnapproveAdminDrivers } from "../../API/adminServices";
import Pagination from "../../AdminComponents/Pagination/Pagination";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { BeatLoader } from "react-spinners";
import NoDataFound from "../../GlobalComponents/NoDataFound/NoDataFound";
import { toast } from "react-toastify";

function AdminDrivers() {
  const { theme } = useTheme();
  const { selectedDriverId, setSelectedDriverId } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [bypassLoading, setBypassLoading] = useState({}); // Track loading state for each driver
  const [open, setOpen] = useState(false);
  const [allDriverData, setAllDriverData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [dropdownSelected, setDropdownSelected] = useState("All Drivers");

  const apiMap = {
    "All Drivers": getAllAdminDrivers,
    "Active Drivers": getApproveAdminDrivers,
    "Inactive Drivers": getUnapproveAdminDrivers,
  };

  const fetchAdminDriverData = useCallback(async () => {
    console.log("Selected Filter:", dropdownSelected);
    setLoading(true);
    try {
      const response = await apiMap[dropdownSelected]({ skip, take, search });
      console.log("API Response:", response.data.data);
      setAllDriverData(response?.data?.data || []);
      setTotalCount(response?.data?.count);
    } catch (error) {
      console.log("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [skip, take, search, dropdownSelected]);

  useEffect(() => {
    fetchAdminDriverData();
  }, [skip, take, search, dropdownSelected]);

  const handlePageChange = (page) => {
    setSkip((page - 1) * take);
  };

  const totalPages = Math.ceil(totalCount / take);
  const currentPage = Math.floor(skip / take) + 1;

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const handleBypassVerification = async (id) => {
    setBypassLoading(prev => ({ ...prev, [id]: true }));
    try {
      const response = await bypassVerification({id: id});
      console.log("Bypass verification response:", response);
      // Refresh the data after successful bypass
      await fetchAdminDriverData();
      toast.success("Verification bypassed successfully!");
    } catch (error) {
      console.error("Error bypassing verification:", error);
    } finally {
      setBypassLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div>
      <DriverDetail open={open} setOpen={setOpen} />
      <div className="flex items-center justify-center gap-3 md:flex-row flex-col">
        <div className="w-full md:w-[25%]">
          <Dropdown
            label={dropdownSelected}
            options={["All Drivers", "Active Drivers", "Inactive Drivers"]}
            selected={dropdownSelected}
            onSelect={setDropdownSelected}
            setSkip={setSkip}
          />
        </div>
        <div className="w-full md:w-[75%]">
          <Search
            value={search}
            onChange={(e) => {
              setSearch(e.target.value), setSkip(0);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <BeatLoader color="#009eff" loading={loading} mt-4 size={15} />
        </div>
      ) : (allDriverData?.length > 0 ?
        (<div className="overflow-x-auto ">
          <div className="min-w-[1000px] mt-5">
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
                  {["Sr.No", "Driver", "Phone Number", "Actions"].map(
                    (heading, index) => (
                      <th key={index} className="py-3 border-0 mb-3">
                        <p
                          className={`${theme === "dark"
                            ? "bg-[#323335] border-[#4f4f4f]"
                            : "bg-transparent border border-[#b5b5b7]"
                            } text-center py-3 border-r border-[#4f4f4f] ${index === 0 ? "rounded-tl-xl" : ""
                            } ${index === 3 ? "rounded-tr-xl border-r-none" : ""}`}
                        >
                          {heading}
                        </p>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {allDriverData.map((item, index) => (
                  <motion.tr
                    key={index}
                    variants={rowVariants}
                    className={`${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                      }`}
                  >
                    <td
                      className={`py-3 border w-[10%] ${theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"
                        }`}
                    >
                      {index + 1}
                    </td>
                    <td
                      className={`py-3 border w-[35%] ${theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"
                        }`}
                    >
                      <div
                        onClick={function () {
                          setOpen(true);
                          setSelectedDriverId(item.id);
                        }}
                        className="flex items-center gap-x-2 justify-start pl-3 cursor-pointer"
                      >
                        <img
                          src={item?.image || Dummy}
                          className="w-[50px] h-[50px] rounded-full"
                          alt=""
                        />
                        {item?.name}
                      </div>
                    </td>
                    <td
                      className={`py-3 border w-[30%] ${theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"
                        }`}
                    >
                      {item?.phNumber}
                    </td>
                    <td
                      className={`py-3 border w-[25%] ${theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"
                        }`}
                    >
                      <div className="flex flex-col gap-2 px-4">
                        <GradientButton
                          driverData={fetchAdminDriverData}
                          name={item?.status === "0" ? "Deactivate" : "Activate"}
                          driverId={item?.id}
                        />
                        <button
                          onClick={() => handleBypassVerification(item.id)}
                          disabled={bypassLoading[item.id]}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            bypassLoading[item.id]
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#479cff] text-white"
                          }`}
                        >
                          {bypassLoading[item.id] ? (
                            <div className="flex items-center justify-center">
                              <BeatLoader color="#ffffff" size={8} />
                            </div>
                          ) : (
                            "Bypass Verification"
                          )}
                        </button>
                         <button
                          className={`px-4 mt-2 w-full py-2 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200 bg-[#e13f33] text-white`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </div>) : <div className="h-[74vh] flex items-center justify-center"><NoDataFound /></div>
      )}
      {allDriverData?.length > 0 &&
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          setTake={setTake}
          setSkip={setSkip}
          take={take}
          totalCount={totalCount}
        />}
    </div>
  );
}

export default AdminDrivers;