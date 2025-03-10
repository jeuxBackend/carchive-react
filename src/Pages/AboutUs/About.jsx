import React from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";

const About = () => {
    const { theme } = useTheme();

    return (
        <div className={` ${theme === "dark" ? "bg-[#1B1C1E] text-[#8D8D8E]" : "bg-[#FFFFFF] text-[#4D4E50]"}`}>
            <div className="">
                {/* Description */}
                <motion.p 
                    className="text-lg leading-relaxed text-justify"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    dolor sit amet consectetur. Quam bibendum sit nec egestas facilisis molestie nisi sit sed.
                    Lobortis neque neque amet facilisis sapien velit sed id suspendisse. Sed ac porta pellentesque magna.
                    Varius nisl aliquet mauris tempor amet in. dolor sit amet consectetur. Quam bibendum sit nec egestas facilisis molestie nisi sit sed.
                    Lobortis neque neque amet facilisis sapien velit sed id suspendisse.
                    Sed ac porta pellentesque magna. Varius nisl aliquet mauris tempor amet in.
                </motion.p>

                <motion.p 
                    className="text-lg leading-relaxed mt-4 text-justify"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                >
                    dolor sit amet consectetur. Quam bibendum sit nec egestas facilisis molestie nisi sit sed.
                    Lobortis neque neque amet facilisis sapien velit sed id suspendisse. Sed ac porta pellentesque magna.
                    Varius nisl aliquet mauris tempor amet in. dolor sit amet consectetur. Quam bibendum sit nec egestas facilisis molestie nisi sit sed.
                    Lobortis neque neque amet facilisis sapien velit sed id suspendisse.
                </motion.p>
            </div>
        </div>
    );
};

export default About;
