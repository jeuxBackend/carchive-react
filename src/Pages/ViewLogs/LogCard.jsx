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

  // Updated function to handle time strings instead of timestamps
  function formatTime(timeString) {
    // If it's already in the expected format (HH:MM), just return it
    if (typeof timeString === 'string' && timeString.includes(':')) {
      return timeString;
    }
    
    // If it's a timestamp number, convert it
    if (!isNaN(Number(timeString))) {
      const date = new Date(Number(timeString));
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} `;
    }
    
    // Fallback
    return timeString || 'N/A';
  }

  const startCoords = data?.lat_long_start?.split(',').map(Number);
  const endCoords = data?.lat_long_end?.split(',').map(Number);

  // Only create path if both start and end coordinates exist
  const path = startCoords && endCoords ? [
    [startCoords[0], startCoords[1]],
    [endCoords[0], endCoords[1]],
  ] : null;

  // Check if we have valid coordinates to display the map
  const hasValidCoordinates = startCoords && startCoords.length === 2 && !isNaN(startCoords[0]) && !isNaN(startCoords[1]);

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
            <p className={theme === "dark" ? "text-white" : "text-black"}>{formatTime(data?.start_time)}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">End Time:</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{formatTime(data?.end_time)}</p>
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

      {hasValidCoordinates && (
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
            {endCoords && !isNaN(endCoords[0]) && !isNaN(endCoords[1]) && (
              <Marker position={endCoords} />
            )}
            {path && (
              <Polyline positions={path} color="red" />
            )}
          </MapContainer>
        </div>
      )}
    </motion.div>
  );
};

export default LogCard;