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
            className={`w-full rounded-xl p-5 ${theme === 'dark' ? 'bg-[#323335]' : 'bg-white border border-[#ececec]'} relative shadow-md`}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
            <p className={`${theme === 'dark' ? 'text-white' : 'text-black'} text-[1.3rem] font-medium`}>Specifications</p>
            <div className='grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-3 xl:gap-2 my-4 xl:text-[0.7rem] 2xl:text-[0.8rem]'>
                {specs.map((spec, index) => (
                    <motion.div 
                        key={index} 
                        className='flex flex-col items-center justify-center' 
                        variants={itemVariants}
                    >
                        <div className={`${theme === 'dark' ? 'bg-[#1b1c1e]' : 'bg-[#f7f7f7]'} p-5 rounded-2xl`}>
                            <img src={theme === 'dark' ? spec.darkImg : spec.lightImg} alt={spec.label} className='w-[4rem] h-[3rem] 2xl:w-[5rem] 2xl:h-[4rem] object-contain' />
                        </div>
                        <div className='flex flex-col items-center justify-center'>
                            <p className={`${theme === 'dark' ? 'text-[#adadae]' : 'text-[#767778]'} font-medium text-center`}>{spec.label}</p>
                            <p className={`${theme === 'dark' ? 'text-white' : 'text-black'} font-medium`}>{spec.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default Specification;
