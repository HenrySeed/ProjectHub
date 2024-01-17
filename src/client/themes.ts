import { createTheme } from "@mui/material";
import { CSSProperties } from "react";

function generateTheme() {
    const backgroundBlue = "rgb(10, 25, 41)";
    const dividerBlue: CSSProperties["color"] = "rgba(20, 50, 82, 0.7)";

    return createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: "rgb(51, 153, 255)",
                dark: "#131a4f",
                contrastText: "#ffffff",
            },
            secondary: {
                main: "#ffcc00",
                dark: "#8c7000",
                contrastText: "#FFFFFF",
            },
            info: {
                main: "#FFFFFFF",
                dark: "#FFFFFF",
                light: "#FFFFFFF",
                contrastText: "#FFFFFF",
            },
            action: {
                hover: "rgba(20, 50, 82, 0.8)",
                selected: "rgba(20, 50, 82, 1)",
            },

            background: {
                default: backgroundBlue,
                paper: backgroundBlue,
            },
            divider: dividerBlue,
        },

        typography: {
            h2: {
                fontWeight: "inherit",
                fontSize: "30pt",
            },
            h4: {
                fontSize: "18pt",
                fontWeight: "500",
            },
        },

        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderColor: dividerBlue,
                        borderRadius: "10px",
                        borderWidth: "1px",
                    },
                },
            },

            MuiTooltip: {
                defaultProps: {
                    placement: "top",
                },
            },

            MuiCard: {
                defaultProps: {
                    variant: "outlined",
                },
                styleOverrides: {
                    root: {
                        borderColor: dividerBlue,
                        borderRadius: "10px",
                        borderWidth: "1px",
                    },
                },
            },

            MuiTextField: {
                defaultProps: {
                    variant: "outlined",
                },
                styleOverrides: {
                    root: {
                        color: "#FFFF",
                        borderColor: dividerBlue,
                        borderRadius: "10px",
                        borderWidth: "1px",
                    },
                },
            },

            MuiButton: {
                defaultProps: {
                    variant: "outlined",
                },
                styleOverrides: {
                    root: {
                        borderColor: dividerBlue,
                        borderRadius: "10px",
                        borderWidth: "1px",
                        fontSize: "10pt",
                        fontWeight: "normal",
                    },
                },
            },
            MuiToolbar: {
                styleOverrides: {
                    root: {
                        background: backgroundBlue,
                    },
                },
            },
        },
    });
}

export const darkTheme = generateTheme();
