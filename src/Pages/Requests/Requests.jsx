import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import backgroundpic from "./assets/bg.png";
import GradientButton from "../../Components/Buttons/GradientButton";
import RequestButton from "../../Components/Buttons/RequestButton";
import g1 from "./assets/g1.png";
import GarageCard from "./GarageCard";

const requestsData = [
  { driverName: "M2 Competition", plate: "GLA 350", vin: "WBAJB31090G999530" },
  { driverName: "M2 Competition", plate: "GLA 350", vin: "WBAJB31090G999530" },
  { driverName: "M2 Competition", plate: "GLA 350", vin: "WBAJB31090G999530" },
  { driverName: "M2 Competition", plate: "GLA 350", vin: "WBAJB31090G999530" },
  { driverName: "M2 Competition", plate: "GLA 350", vin: "WBAJB31090G999530" },
  { driverName: "M2 Competition", plate: "GLA 350", vin: "WBAJB31090G999530" }
];

const garageData = [
  { name: "Leslie Alexender", bg: g1 },
  { name: "Leslie Alexender", bg: g1 },
  { name: "Leslie Alexender", bg: g1 }
];

const Requests = () => {
  const { theme } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      {/* Requests Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
      >
        {requestsData.map((request, index) => (
          <motion.div
            key={index}
            className={`relative p-6 rounded-lg shadow-lg overflow-hidden transition-all 
              ${theme === "dark" ? "bg-[#323335] border-2 border-[#323335]" : "bg-white border-2 border-[#ECECEC]"}`}
            style={{
              backgroundImage: `url(${backgroundpic})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right bottom",
              backgroundSize: "130px auto"
            }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Card Content */}
            <div className="relative z-10">
              <div className="flex justify-between sm:flex-row flex-col">
                <div>
                  <p className="text-[#8D8D8F] text-sm">Driver Name</p>
                  <p className={`${theme==="dark"?"text-white":"text-black"} font-semibold`}>{request.driverName}</p>
                </div>
                <div>
                  <p className="text-[#8D8D8F] text-sm">Number Plate</p>
                  <p className={`${theme==="dark"?"text-white":"text-black"} font-semibold`}>{request.plate}</p>
                </div>
              </div>

              <div className="flex justify-between sm:flex-row flex-col">
                <div className="mt-4">
                  <p className="text-[#8D8D8F] text-sm">Vin Number</p>
                  <p className={`${theme==="dark"?"text-white":"text-black"} font-semibold`}>{request.vin}</p>
                </div>

                <div className="mt-8">
                  <a href="#" className="text-[#319BFB] font-medium hover:underline">
                    View Details
                  </a>
                </div>
              </div>

            
              <div className="mt-4 flex gap-4 sm:flex-row flex-col">
                <GradientButton name="Reject" />
                <RequestButton name="Accept" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <p className={`${theme === "dark" ? "text-white" : "text-black"} font-medium text-[2rem] my-4`}>
          Garage Requests
        </p>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
        >
          {garageData.map((data, index) => (
            <motion.div 
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <GarageCard data={data} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Requests;
