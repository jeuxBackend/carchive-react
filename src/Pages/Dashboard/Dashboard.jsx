import React from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 50, rotate: -2, scale: 0.9 },
  visible: { opacity: 1, y: 0, rotate: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.05, rotate: 2, transition: { duration: 0.3 } },
};

const StatCard = ({ title, value, theme, delay }) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    transition={{ delay }}
    className={`px-5 py-10 rounded-lg border border-black/50 shadow-md ${
      theme === "dark" ? "bg-[#323335] text-white" : "bg-white text-black"
    }`}
  >
    <motion.p
      className={`text-[1.2rem] pb-2 ${theme === "dark" ? "text-white/50" : "text-black/50"}`}
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

function Dashboard() {
  const { theme } = useTheme();

  const stats = [
    { title: "Number of Vehicles", value: "234", delay: 0 },
    { title: "Number of Drivers", value: "194", delay: 0.2 },
    { title: "Number of Unpaid Invoices", value: "4,532", delay: 0.4 },
  ];

  return (
    <motion.div 
      className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-5 "
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} theme={theme} />
      ))}
    </motion.div>
  );
}

export default Dashboard;
