import React, { useCallback, useEffect, useState } from "react";
import Search from "../../AdminComponents/Search/Search";
import Dropdown from "../../AdminComponents/DropDown/Dropdown";
import GradientCards from "../../AdminComponents/Cards/GradientCards";
import { getAdminCompanies } from "../../API/adminServices";
import { getApproveAdminCompanies } from "../../API/adminServices";
import { getUnapproveAdminCompanies } from "../../API/adminServices";
import { BeatLoader } from "react-spinners";
import Pagination from "../../AdminComponents/Pagination/pagination";
import NoDataFound from "../../GlobalComponents/NoDataFound/NoDataFound";

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
        <div className="flex justify-center items-center h-[75vh]">
          <BeatLoader color="#009eff" loading={loading} mt-4 size={15} />
        </div>
      ) : (allCompanyData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {/* for all company */}
       {
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
            ))}
        
        </div>):<div className="h-[73vh] flex items-center justify-center"><NoDataFound/></div>
      )}
      {allCompanyData.length > 0 &&
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

export default AdminCompany;
