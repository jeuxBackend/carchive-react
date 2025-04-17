import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTheme } from '../Contexts/ThemeContext';

function InfoCard({ data = {} }) {
    const { theme } = useTheme();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const autoplayInterval = useRef(null);

    // Autoplay effect
    useEffect(() => {
        if (!emblaApi) return;

        const autoplay = () => {
            if (emblaApi.canScrollNext()) {
                emblaApi.scrollNext();
            } else {
                emblaApi.scrollTo(0);
            }
        };

        autoplayInterval.current = setInterval(autoplay, 3000);

        return () => clearInterval(autoplayInterval.current);
    }, [emblaApi]);

    // Update index on slide change
    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        onSelect();
    }, [emblaApi, onSelect]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`w-full rounded-xl p-5 overflow-hidden ${theme === "dark" ? 'bg-[#323335]' : "bg-white border border-[#ececec]"} relative shadow-md`}
        >
            <div className='font-medium lg:h-[350px]'>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className={`${theme === "dark" ? 'text-white' : "text-black"} text-[1.3rem]`}
                >
                    Vehicle Make / Model
                </motion.p>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className='text-[#2D9BFF] text-[1.8rem]'
                >
                    {data?.make || "Unknown Make"}
                </motion.p>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className={`text-[9.5vw] sm:text-[10vw] md:text-[12vw] lg:text-[4.5vw] 2xl:text-[4.7vw] absolute bottom-0 z-10 text-outline ${theme === "dark" ? 'text-black' : "text-[#e4e4e4]"}`}
                >
                    {data?.make || "No Make"}
                </motion.p>

                {data?.image?.length > 1 ? (
                    <div className="relative w-full mx-auto lg:h-[260px] z-20 overflow-hidden">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex">
                                {data.image.map((img, index) => (
                                    <motion.img
                                        key={index}
                                        src={img}
                                        alt={`Vehicle ${index + 1}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8, duration: 0.5 }}
                                        className="flex-none w-full h-[260px] object-contain"
                                    />
                                ))}
                            </div>
                        </div>

                      
                        <button
                            onClick={() => emblaApi && emblaApi.scrollPrev()}
                            className="absolute left-1 top-1/2 transform -translate-y-1/2 rounded-full shadow-md z-50 sm:block hidden"
                        >
                            {/* <img src={theme === "dark" ? back : backLight} alt="Previous" className="w-[2rem]" /> */}
                        </button>

                        <button
                            onClick={() => emblaApi && emblaApi.scrollNext()}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full shadow-md sm:block hidden"
                        >
                            {/* <img src={theme === "dark" ? back : backLight} alt="Next" className="w-[2rem] rotate-180" /> */}
                        </button>

                      
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {data.image.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => emblaApi && emblaApi.scrollTo(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        selectedIndex === index ? "bg-blue-500 w-4 h-2" : "bg-gray-400"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                ) : data?.image?.length === 1 ? (
                    <motion.img
                        src={data.image[0]}
                        alt="Vehicle"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className='z-20 relative w-[95%] lg:h-[260px] object-contain'
                    />
                ) : (
                    <motion.p className="text-gray-400 text-center mt-5">
                        No Image Available
                    </motion.p>
                )}
            </div>
        </motion.div>
    );
}

export default InfoCard;
