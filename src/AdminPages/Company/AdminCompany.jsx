import React, { useCallback, useEffect, useState } from "react";
import img1 from "./assets/img1.png";
import img2 from "./assets/img2.png";
import img3 from "./assets/img3.png";
import Search from "../../AdminComponents/Search/Search";
import Dropdown from "../../AdminComponents/DropDown/Dropdown";
import GradientCards from "../../AdminComponents/Cards/GradientCards";
import { getAdminCompanies } from "../../API/apiService";
import { getApproveAdminCompanies } from "../../API/apiService";
import { getUnapproveAdminCompanies } from "../../API/apiService";
import { BeatLoader } from "react-spinners";
import { div } from "framer-motion/client";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { Link } from "react-router-dom";
import Pagination from "../../AdminComponents/Pagination/pagination";

function AdminCompany() {
  const [loading, setLoading] = useState(false);
  const [allCompanyData, setAllCompanyData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [dropdownSelected, setDropdownSelected] = useState("All Company");

  const apiMap = {
    "All Company": getAdminCompanies,
    "Active Company": getApproveAdminCompanies,
    "Inactive Company": getUnapproveAdminCompanies,
  };

  const fetchCompanyData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiMap[dropdownSelected]({ skip, take, search });
      console.log("API Response:", response.data.data);
      setAllCompanyData(response?.data?.data || []);
      setTotalCount(response?.data?.count);
    } catch (error) {
      console.log("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [skip, take, search, dropdownSelected]);

  useEffect(() => {
    fetchCompanyData();
  }, [skip, take, search, dropdownSelected]);

  const handlePageChange = (page) => {
    setSkip((page - 1) * take);
  };

  const totalPages = Math.ceil(totalCount / take);
  const currentPage = Math.floor(skip / take) + 1;

  return (
    <div>
      <div className="flex items-center justify-center gap-3 md:flex-row flex-col">
        <div className="w-full md:w-[25%]">
          <Dropdown
            label={dropdownSelected}
            options={["All Company", "Active Company", "Inactive Company"]}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {/* for all company */}
          {allCompanyData.length > 0 ? (
            allCompanyData.map((data, index) => (
              <div key={index}>
                <GradientCards
                  status={data?.status}
                  fetchAdminCompanyData={fetchCompanyData}
                  id={data?.id}
                  img={data?.image || ""}
                  title={data?.name || "Not Found"}
                  contact={data?.phNumber || "Not Found"}
                />
              </div>
            ))
          ) : (
            <p className="">No companies available</p>
          )}
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        setTake={setTake}
        setSkip={setSkip}
        take={take}
      />
    </div>
  );
}

export default AdminCompany;
