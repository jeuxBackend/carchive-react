import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./Contexts/ThemeContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { GlobalContextProvider } from "./Contexts/GlobalContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <GlobalContextProvider>
          <App />
        </GlobalContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
