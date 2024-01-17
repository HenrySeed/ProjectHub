import { ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { App } from "./App";
import "./index.scss";
import { darkTheme } from "./themes";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <ThemeProvider theme={darkTheme}>
                <App />
            </ThemeProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById("app")
);
