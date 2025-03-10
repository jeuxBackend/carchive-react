import React from 'react';
import { useTheme } from '../../../Contexts/ThemeContext';
import Switch from '../../../Components/Buttons/Switch';
import { IoIosArrowForward } from 'react-icons/io';
import { motion } from 'framer-motion';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function Services() {
    const { theme } = useTheme();

    return (
        <motion.div 
            className="flex flex-col gap-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
            {[
                { title: "Insurance", subtitle: "(09/02/2026) ", expired: "Expired", showSwitch: true },
                { title: "Maintenance Records", showArrow: true },
                { title: "Start Drive", showArrow: true }
            ].map((item, index) => (
                <motion.div
                    key={index}
                    className={`w-full rounded-xl p-4 2xl:p-5 ${theme === "dark" ? 'bg-[#323335]' : "bg-white border border-[#ececec]"} shadow-md flex items-center justify-between`}
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-2">
                        <p className={`${theme === "dark" ? 'text-white' : "text-black"} text-[1.4rem] font-medium`}>
                            {item.title}
                        </p>
                        {item.subtitle && (
                            <p className="text-[#2D9BFF] text-[0.8rem] font-medium">
                                {item.subtitle} <span className="text-red-500">{item.expired}</span>
                            </p>
                        )}
                    </div>
                    {item.showSwitch && <Switch />}
                    {item.showArrow && <IoIosArrowForward className={`text-[1.4rem] ${theme === "dark" ? "text-white" : "text-black"}`} />}
                </motion.div>
            ))}
        </motion.div>
    );
}

export default Services;
