import {
    Box,
    Divider,
    Drawer,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.scss";
import { NewProjectDialog } from "./components/NewProjectDialog";
import { SideBarProject } from "./components/SideBarButton";
import { useProjectTodo, useProjects } from "./components/apiHooks";
import { HomeView } from "./views/HomeView";
import { ProjectView } from "./views/ProjectView";

export function App() {
    const [projects] = useProjects();
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
    const nav = useNavigate();
    const sideBarWidth = "200px";
    const projectTodo = useProjectTodo();
    const theme = useTheme();

    return (
        <>
            <NewProjectDialog
                open={newProjectDialogOpen}
                onClose={() => setNewProjectDialogOpen(false)}
            />

            <Box sx={{ display: "flex" }}>
                <Drawer
                    sx={{
                        width: drawerOpen ? sideBarWidth : "0px",
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            background: "none",
                            width: drawerOpen ? sideBarWidth : "0px",
                            boxSizing: "border-box",
                            bgcolor: "background.default",
                        },
                    }}
                    variant={"permanent"}
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                >
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        <Typography
                            variant="h6"
                            style={{
                                flexGrow: 1,
                                marginTop: "8px",
                            }}
                            color="primary"
                        >
                            Project Hub
                        </Typography>
                    </Toolbar>
                    <SideBarProject
                        name={"Home"}
                        key={"Home"}
                        onClick={() => nav(`/`)}
                    />
                    <SideBarProject
                        name={"New Project"}
                        key={"New Project"}
                        onClick={() => setNewProjectDialogOpen(true)}
                    />
                    <Divider
                        orientation="horizontal"
                        variant="fullWidth"
                        style={{ margin: "10px 0" }}
                    />
                    {projects.map((val) => (
                        <SideBarProject
                            remainingTodo={projectTodo?.get(val.name)}
                            name={val.name}
                            key={val.name}
                            onClick={() => nav(`/project/${val.name}`)}
                        />
                    ))}
                </Drawer>

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: "background.default",
                        p: 3,
                        width: `100%`,
                        minHeight: "100vh",
                        boxSizing: "border-box",
                    }}
                >
                    <Routes>
                        <Route
                            path="/project/:projName"
                            element={<ProjectView />}
                        />
                        <Route path="/" element={<HomeView />} />
                    </Routes>
                </Box>
            </Box>
        </>
    );
}
