import React from 'react';
import { motion } from 'framer-motion';
import Dropdown from '../../Components/DropDown/Dropdown';
import Search from '../../Components/Search/Search';
import car1 from "./assets/car1.png";
import car2 from "./assets/car2.png";
import car3 from "./assets/car3.png";
import car4 from "./assets/car4.png";
import car5 from "./assets/car5.png";
import car6 from "./assets/car6.png";
import VehicleCard from '../../Components/VehicleCard/VehicleCard';

function Vehicles() {
    const cars = [
        { id: 1, title: "C63 Coupe", regNo: "WBAJB31090G999530", plateNo: "MM2359", img: car1 },
        { id: 2, title: "M2 Competition", regNo: "WBAJB31090G999530", plateNo: "MM2359", img: car2 },
        { id: 3, title: "RS5", regNo: "WBAJB31090G999530", plateNo: "MM2359", img: car3 },
        { id: 4, title: "C63 Coupe", regNo: "WBAJB31090G999530", plateNo: "MM2359", img: car4 },
        { id: 5, title: "M2 Competition", regNo: "WBAJB31090G999530", plateNo: "MM2359", img: car5 },
        { id: 6, title: "RS5", regNo: "WBAJB31090G999530", plateNo: "MM2359", img: car6 },
    ];

    return (
        <div>
            <div className='flex items-center justify-center gap-3 md:flex-row flex-col'>
                <div className='w-full md:w-[25%]'>
                    <Dropdown />
                </div>
                <div className='w-full md:w-[75%]'>
                    <Search />
                </div>
            </div>
            <motion.div 
                className='grid lg:grid-cols-2 xl:grid-cols-3 gap-3 mt-5'
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.5 }}
            >
                {cars.map((data, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <VehicleCard data={data} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

export default Vehicles;
