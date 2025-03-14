import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import Dummy from "./img.png";
import DriverDetail from "../../AdminComponents/DriverDetail/DriverDetail";
import Dropdown from "../../AdminComponents/DropDown/Dropdown";
import Search from "../../AdminComponents/Search/Search";
import GradientButton from "../../AdminComponents/Logout/GradientButton";
import Pagination from "../../AdminComponents/Pagination/pagination";
import { getAllAdminGarage } from "../../API/adminServices";
import { getApproveAdminGarage } from "../../API/adminServices";
import { getUnapproveAdminGarage } from "../../API/adminServices";
import GarageDetail from "../../AdminComponents/DriverDetail/GarageDetail";
import { BeatLoader } from "react-spinners";
import NoDataFound from "../../GlobalComponents/NoDataFound/NoDataFound";

function AdminGarageOwners() {
  const { theme } = useTheme();
  const {selectedGarageId, setSelectedGarageId} = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allGarageData, setAllGarageData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [dropdownSelected, setDropdownSelected] = useState("All Garages");

  const apiMap = {
    "All Garages": getAllAdminGarage,
    "Active Garages": getApproveAdminGarage,
    "Inactive Garages": getUnapproveAdminGarage,
  };

  const fetchAdminGarageData = useCallback(async () => {
    console.log("Selected Filter:", dropdownSelected);
    setLoading(true);
    try {
      const response = await apiMap[dropdownSelected]({ skip, take, search });
      console.log("API Response:", response.data.data);
      setAllGarageData(response?.data?.data || []);
      setTotalCount(response?.data?.count);
    } catch (error) {
      console.log("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [skip, take, search, dropdownSelected]);

  useEffect(() => {
    fetchAdminGarageData();
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

  return (
    <div>
      <GarageDetail open={open} setOpen={setOpen} full />
      <div className="flex items-center justify-center gap-3 md:flex-row flex-col">
        <div className="w-full md:w-[25%]">
          <Dropdown
             label={dropdownSelected}
            options={["All Garages", "Active Garages", "Inactive Garages"]}
            selected={dropdownSelected}
            onSelect={setDropdownSelected}
            setSkip={setSkip}
          />
        </div>
        <div className="w-full md:w-[75%]">
          <Search 
           value={search}
           onChange={(e) => {
             setSearch(e.target.value), setSkip(0);}}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <BeatLoader color="#009eff" loading={loading} mt-4 size={15} />
        </div>
      ) :  (allGarageData?.length > 0 ?
        (<div className="overflow-x-auto ">
        <div className="min-w-[1000px] mt-5">
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
                {["Sr.No", "Company", "Address", "Action"].map(
                  (heading, index) => (
                    <th key={index} className="py-3 border-0 mb-3">
                      <p
                        className={`${
                          theme === "dark"
                            ? "bg-[#323335] border-[#4f4f4f]"
                            : "bg-transparent border border-[#b5b5b7]"
                        } text-center py-3 border-r border-[#4f4f4f] ${
                          index === 0 ? "rounded-tl-xl" : ""
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
              {allGarageData.map((item, index) => (
                <motion.tr
                  key={index}
                  variants={rowVariants}
                  className={`${
                    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  }`}
                >
                  <td
                    className={`py-3 border w-[10%] ${
                      theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"
                    }`}
                  >
                    {index + 1}
                  </td>
                  <td
                    className={`py-3 border w-[35%] ${
                      theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"
                    }`}
                  >
                    <div
                      onClick={function(){ setOpen(true); setSelectedGarageId(item?.id)}}
                      className="flex items-center gap-x-2 justify-start pl-3 cursor-pointer"
                    >
                      <img
                        src={item?.image || Dummy}
                        className="w-[50px] h-[50px] rounded-full"
                        alt="image"
                      />
                      {item?.name || "Name Not Found"}
                    </div>
                  </td>
                  <td
                    className={`py-3 border w-[30%] ${
                      theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"
                    }`}
                  >
                    {item?.address || "Address Not Found"}
                  </td>
                  <td
                    className={`py-3 border w-[25%] ${
                      theme === "dark" ? "border-[#323335]" : "border-[#b5b5b7]"
                    }`}
                  >
                    <div className="px-12">
                      <GradientButton  driverData={fetchAdminGarageData}  driverId={item?.id}  name={item?.status === "0" ? "Deactivate" : "Activate"} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </div>) : <div className="h-[74vh] flex items-center justify-center"><NoDataFound /></div>
      )}
       {allGarageData?.length > 0 &&
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        setTake={setTake}
        setSkip={setSkip}
        take={take}
      />}
    </div>
  );
}

export default AdminGarageOwners;
