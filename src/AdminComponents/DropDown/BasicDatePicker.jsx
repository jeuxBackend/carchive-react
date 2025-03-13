import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTheme } from "../../Contexts/ThemeContext";

export default function CustomDatePicker({label, onChange}) {
  const { theme } = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        onChange={(date) => onChange(date)}
        sx={{
          width: "100%",
          fontWeight: 500,
          borderRadius: "0.75rem", 
          backgroundColor: theme === "dark" ? "#323335" : "#f7f7f7",
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
