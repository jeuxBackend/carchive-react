import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import InfoCard from "./Infocard";
import Specs from "./Specs";
import { getVehicleById } from "../API/portalServices";

function PublicPage() {
  const { id } = useParams();
  const [vehicleDetail, setVehicleDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchVehicleData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getVehicleById(id);
      setVehicleDetail(response?.data?.car || {});
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicleData();
  }, [id]);
  return (
    <>
      {loading ? (
        <div className="h-[80vh] flex items-center justify-center">
          <BeatLoader color="#2d9bff" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid lg:grid-cols-1 gap-4 h-full">
            <div className="w-full h-full">
              <InfoCard data={vehicleDetail} />
            </div>
          </div>
          <div className="grid lg:grid-cols-1 gap-4 h-full">
            <div className="w-full h-full">
              <Specs data={vehicleDetail} />
              <div className="grid grid-cols-1 gap-5 my-4"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PublicPage;
