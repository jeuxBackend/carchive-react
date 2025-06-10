import React from 'react';
import { useTheme } from '../../../Contexts/ThemeContext';
import { motion } from 'framer-motion';
import vin from './assets/vin.png';
import plate from './assets/plate.png';
import mileage from './assets/mileage.png';
import year from './assets/year.png';
import vinLight from './assets/vinLight.png';
import plateLight from './assets/plateLight.png';
import mileageLight from './assets/mileageLight.png';
import yearLight from './assets/yearLight.png';
import emailLight from "./assets/emailLight.png"
import email from "./assets/email.png"
import phone from "./assets/phone.png"
import phoneLight from "./assets/phoneLight.png"
import userLight from "./assets/userLight.png"
import user from "./assets/user.png"

const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

function Specification({data}) {
    const { theme } = useTheme();
    const specs = [
        { label: 'Vin Number', value: data?.vinNumber, darkImg: vin, lightImg: vinLight },
        { label: 'Number Plate', value: data?.numberPlate, darkImg: plate, lightImg: plateLight },
        { label: 'Mileage', value: data?.mileage, darkImg: mileage, lightImg: mileageLight },
        { label: 'Manufacturing Year', value: data?.manufacturingYear, darkImg: year, lightImg: yearLight },
        { label: 'Owner Name', value: data?.user_details?.name, darkImg: user, lightImg: userLight },
        { label: 'Email', value: data?.user_details?.email, darkImg: email, lightImg: emailLight },
        { label: 'Phone', value: data?.user_details?.phNumber, darkImg: phone, lightImg: phoneLight },
    ];

    return (
        <motion.div 
            className={`w-full rounded-xl p-3 sm:p-4 lg:p-5 ${theme === 'dark' ? 'bg-[#323335]' : 'bg-white border border-[#ececec]'} relative shadow-md`}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
            <p className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-lg sm:text-xl lg:text-[1.3rem] font-medium mb-3 sm:mb-4`}>
                Specifications
            </p>
            
            {/* Mobile Layout - Single Column with Horizontal Cards */}
            <div className="block sm:hidden space-y-3">
                {specs.map((spec, index) => (
                    <motion.div 
                        key={index}
                        className={`${theme === 'dark' ? 'bg-[#1b1c1e]' : 'bg-[#f7f7f7]'} p-3 rounded-lg flex items-center gap-3`}
                        variants={itemVariants}
                    >
                        <div className="flex-shrink-0">
                            <img 
                                src={theme === 'dark' ? spec.darkImg : spec.lightImg} 
                                alt={spec.label} 
                                className='w-8 h-8 object-contain' 
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`${theme === 'dark' ? 'text-[#adadae]' : 'text-[#767778]'} font-medium text-sm`}>
                                {spec.label}
                            </p>
                            <p className={`${theme === 'dark' ? 'text-white' : 'text-black'} font-medium text-sm truncate`}>
                                {spec.value || 'N/A'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tablet and Desktop Layout - Grid */}
            <div className='hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 lg:gap-4 xl:gap-2 text-xs sm:text-sm lg:text-base xl:text-[0.7rem] 2xl:text-[0.8rem]'>
                {specs.map((spec, index) => (
                    <motion.div 
                        key={index} 
                        className='flex flex-col items-center justify-center' 
                        variants={itemVariants}
                    >
                        <div className={`${theme === 'dark' ? 'bg-[#1b1c1e]' : 'bg-[#f7f7f7]'} p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl mb-2`}>
                            <img 
                                src={theme === 'dark' ? spec.darkImg : spec.lightImg} 
                                alt={spec.label} 
                                className='w-8 h-6 sm:w-12 sm:h-9 lg:w-[4rem] lg:h-[3rem] 2xl:w-[5rem] 2xl:h-[4rem] object-contain mx-auto' 
                            />
                        </div>
                        <div className='flex flex-col items-center justify-center text-center'>
                            <p className={`${theme === 'dark' ? 'text-[#adadae]' : 'text-[#767778]'} font-medium mb-1 leading-tight`}>
                                {spec.label}
                            </p>
                            <p className={`${theme === 'dark' ? 'text-white' : 'text-black'} font-medium break-words max-w-full`}>
                                {spec.value || 'N/A'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default Specification;