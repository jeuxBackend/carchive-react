import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTheme } from "../../Contexts/ThemeContext";
import dayjs from "dayjs";

export default function CustomDatePicker({ label, value = {}, setValue, fieldKey }) {
  const { theme } = useTheme();

  const handleChange = (newValue) => {
    setValue((prev) => ({
      ...prev,
      [fieldKey]: newValue ? newValue.format("YYYY-MM-DD") : "", // ✅ Store date in a readable format
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value?.[fieldKey] ? dayjs(value?.[fieldKey]) : null} // ✅ Fix syntax
        onChange={handleChange} 
        sx={{
          width: "100%",
          fontWeight: 500,
          borderRadius: "0.75rem",
          backgroundColor: theme === "dark" ? "#1b1c1e" : "#f7f7f7",
          "& .MuiOutlinedInput-root": {
            backgroundColor: "transparent",
            color: theme === "dark" ? "white" : "black",
            borderRadius: "0.75rem",
            border: theme === "dark" ? "none" : "1px solid #e8e8e8",
            "& fieldset": {
              borderRadius: "0.75rem",
              border: theme === "dark" ? "none" : "1px solid #e8e8e8",
            },
          },
          "& .MuiInputBase-input": {
            color: theme === "dark" ? "white" : "black",
          },
          "& .MuiFormLabel-root": {
            color: theme === "dark" ? "white" : "black",
          },
          "& .MuiIconButton-root": {
            color: theme === "dark" ? "white" : "black",
          },
        }}
      />
    </LocalizationProvider>
  );
}
