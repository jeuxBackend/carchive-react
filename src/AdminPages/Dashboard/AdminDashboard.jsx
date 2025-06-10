import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import { getAdminDashboard } from "../../API/adminServices";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotate: -2, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  hover: { scale: 1.05, rotate: 2, transition: { duration: 0.3 } },
};

const StatCard = ({ title, value, theme, delay, route }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay }}
      className={`px-5 py-10 rounded-lg border border-black/50 shadow-md cursor-pointer ${
        theme === "dark" ? "bg-[#323335] text-white" : "bg-white text-black"
      } ${route ? "hover:shadow-lg" : "cursor-default"}`}
      onClick={handleClick}
    >
      <motion.p
        className={`text-[1.2rem] pb-2 ${
          theme === "dark" ? "text-white/50" : "text-black/50"
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.2 }}
      >
        {title}
      </motion.p>
      <motion.p
        className="font-bold text-[2.3rem]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.3 }}
      >
        {value}
      </motion.p>
    </motion.div>
  );
};

function AdminDashboard() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});

  const fetchAdminDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAdminDashboard();
      setDashboardData(response?.data?.data || {});
    } catch (error) {
      console.log("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminDashboardData();
  }, [fetchAdminDashboardData]);

  const stats = [
    { 
      title: "Total Companies", 
      value: dashboardData?.allCom || 0, 
      delay: 0, 
      route: "/Admin/Companies" 
    },
    {
      title: "Approved Companies",
      value: dashboardData?.activeCom || 0,
      delay: 0.2,
      route: "/Admin/Companies"
    },
    {
      title: "Unapproved Companies",
      value: dashboardData?.blockedCom || 0,
      delay: 0.4,
      route: "/Admin/Companies"
    },
    { 
      title: "Total Drivers", 
      value: dashboardData?.allDrivers || 0, 
      delay: 0.6,
      route: "/Admin/Drivers"
    },
    {
      title: "Approved Drivers",
      value: dashboardData?.activeDrivers || 0,
      delay: 0.8,
      route: "/Admin/Drivers"
    },
    {
      title: "Unapproved Drivers",
      value: dashboardData?.blockedDrivers || 0,
      delay: 1,
      route: "/Admin/Drivers"
    },
    { 
      title: "Total Garages", 
      value: dashboardData?.allGrages || 0, 
      delay: 1.2,
      route: "/Admin/Garages"
    },
    {
      title: "Approved Garages",
      value: dashboardData?.activeGrages || 0,
      delay: 1.4,
      route: "/Admin/Garages"
    },
    {
      title: "Unapproved Garages",
      value: dashboardData?.blockedGrages || 0,
      delay: 1.6,
      route: "/Admin/Garages"
    },
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <BeatLoader color="#009eff" loading={loading} size={15} />
        </div>
      ) : (
        <motion.div
          className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} theme={theme} />
          ))}
        </motion.div>
      )}
    </>
  );
}

export default AdminDashboard;