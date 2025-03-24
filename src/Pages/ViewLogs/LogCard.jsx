import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen';


const mapContainerStyle = {
  width: '100%',
  height: '200px',
};

const LogCard = ({ data }) => {
  const { theme } = useTheme();

  function formatTimestampCustom(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} `;
  }

  const startCoords = data?.lat_long_start?.split(',').map(Number);
  const endCoords = data?.lat_long_end?.split(',').map(Number);

  const path = [
    [startCoords[0], startCoords[1]],
    [endCoords[0], endCoords[1]],
  ];

  return (
    <motion.div
      className={`rounded-xl w-[100%] p-5 shadow-lg ${theme === "dark" ? "bg-[#323335] border-[#323335]" : "bg-white border-[#ECECEC] border"
        }`}
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full flex items-center justify-center">
        <p className={`text-[1.3rem] font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>View Logs</p>
      </div>

      <div className="flex lg:items-center justify-between gap-3 lg:flex-row flex-col">
        <div className="flex flex-col gap-3 mt-5">
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">Start Time:</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{formatTimestampCustom(Number(data?.start_time))}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">End Time:</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{formatTimestampCustom(Number(data?.end_time))}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:mt-5">
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">Start Mileage:</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{data?.start_mileage}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">End Mileage:</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{data?.end_mileage}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-2">
        <p className="text-[#777e90] font-medium">Total distance driven:</p>
        <p className={theme === "dark" ? "text-white" : "text-black"}>{data?.total_distance}</p>
      </div>

      {startCoords && endCoords && (
        <div className="mt-2">
          <p className="text-[#777e90] font-medium mb-2">Map:</p>
          <MapContainer
            center={startCoords}
            zoom={15}
            style={mapContainerStyle}
            whenCreated={(map) => map.addControl(new L.Control.Fullscreen())}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={startCoords} />
            <Marker position={endCoords} />
            <Polyline positions={path} color="red" />
          </MapContainer>
        </div>
      )}
    </motion.div>
  );
};

export default LogCard;
