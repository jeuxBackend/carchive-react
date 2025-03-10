import React, { useState } from 'react';
import { useTheme } from "../../Contexts/ThemeContext";
import { CiSearch } from "react-icons/ci";
import { LuSend } from "react-icons/lu";

// import { GiHamburgerMenu } from "react-icons/gi";
import ham from "../../assets/hamburger.png"
import hamLight from "../../assets/hamLight.png"
import { FiX } from 'react-icons/fi';

const Chat = () => {
    const { theme } = useTheme();
    const users = [
        { id: 1, name: "Robert Fox", email: 'robertfox@gmail.com', message: "Perfect! Will Check it.", time: "10:32 PM", image: "https://randomuser.me/api/portraits/men/1.jpg" },
        { id: 2, name: "Jenny Wilson", email: 'jennywilson@gmail.com', message: "Thanks, Jimmy! Talk Later", time: "05:36 PM", image: "https://randomuser.me/api/portraits/women/2.jpg" }
    ];

    const messages = [
        { id: 1, sender: "Robert Fox", text: "Hey, How It Going?", time: "7:12 Min", self: false },
        { id: 2, sender: "You", text: "Not Too Bad, Just Trying To Survive This Week. You?", time: "7:12 Min", self: true }
    ];

    const [selectedUser, setSelectedUser] = useState(users[0]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`${theme === "dark" ? "bg-[#1B1C1E] text-white" : "bg-white text-black"} transition-all `}>

            <div className="flex h-[86vh] w-full relative gap-6">

                {/* Sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                <div className={`absolute lg:relative z-30 flex-col lg:w-[40%] h-[82vh] sm:h-[88vh] lg:h-full ${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#dfdfdf]"} rounded-xl p-3 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-[150%]"}`}>


                    <button
                        className="lg:hidden p-2 bg-gray-300 rounded-full mb-2 self-end"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <FiX size={24} />
                    </button>

                    <div className="relative w-full my-3">
                        <input
                            type="text"
                            placeholder="Search for a user..."
                            className={`w-full p-3 pl-4 pr-10 rounded-3xl ${theme === "dark" ? "bg-[#292A2C] text-white border border-white/30 " : "bg-white text-black border-gray-300"} focus:outline-none shadow`}
                        />
                        <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl cursor-pointer" />
                    </div>


                    <div className="space-y-2">
                        {users.map((user) => (
                            <div>
                                <div key={user.id}
                                    className={`flex items-center rounded-t p-3 cursor-pointer border-b border-dashed ${theme==="dark"?"border-[#464749]":"border-[#e8e8e8]"} ${selectedUser.id === user.id ? (theme === "dark" ? "bg-gray-700 " : "bg-gray-300 ") : ""}`}
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setIsSidebarOpen(false);
                                    }}
                                >
                                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
                                    <div className="ml-3 w-full">
                                        <div className='flex items-center justify-between w-full'>
                                        <h3 className="font-semibold">{user.name}</h3>
                                        <p className={`text-[0.8rem] ${theme==="dark"?"text-[#adadae]":"text-[#767778]"}`}>10:32 pm</p>

                                        </div>
                                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{user.message}</p>
                                    </div>

                                </div>
                             
                            </div>

                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={`flex flex-col flex-1 h-[82vh] sm:h-[86vh] rounded-xl ${theme === "dark" ? "bg-[#1B1C1E] text-white border border-white/30" : "bg-white text-black border border-[#ECECEC]"}`}>
                    {/* Header */}
                    <div className={`flex items-center rounded-t-xl p-4 ${theme === "dark" ? "bg-[#323335]" : "bg-gray-100"} shadow-md relative`}>


                        <button
                            className="lg:hidden rounded-full  mr-3"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <img src={theme==="dark"?ham:hamLight} alt="" className='w-[24px]'/>
                        
                        </button>

                        <img src={selectedUser.image} alt={selectedUser.name} className="w-10 h-10 rounded-full" />
                        <div className="ml-3">
                            <h3 className="font-semibold">{selectedUser.name}</h3>
                            <p className="text-sm">{selectedUser.email}</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.self ? "justify-end" : "justify-start"} mb-2`}>
                                <div className={`p-3 rounded-lg ${msg.self ? (theme === "dark" ? "bg-[#F7F7F7] text-[#7C7C7C]" : "bg-[#f7f7f7] text-black") : (theme === "dark" ? "bg-[#bbbbbb] text-[#5d5d5d]" : "bg-[#eaf5ff] text-black")}`}>
                                    <p>{msg.text}</p>
                                    <span className="text-xs text-gray-400">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Field */}
                    <div className="p-4 relative w-full">
                        <input
                            type="text"
                            placeholder="Type Message"
                            className={`w-full p-3 pl-4 pr-10 rounded-3xl border ${theme === "dark" ? "bg-[#1B1C1E] text-white border-gray-500" : "bg-gray-100 text-black border-gray-300"} focus:outline-none`}
                        />
                        <LuSend className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;





