import { OpenInNew } from "@mui/icons-material";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../components/apiHooks";

function ProjectTile({ name }: { name: string }) {
    const nav = useNavigate();
    return (
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
            <Card variant="outlined" style={{ cursor: "pointer" }}>
                <div
                    style={{
                        backgroundImage: `url("http://localhost:3000/projAssets/${name}/screenshot.png")`,
                        width: "100%",
                        height: "200px",
                        backgroundSize: "cover",
                    }}
                    onClick={() => nav(`/project/${name}`)}
                />
                <CardContent onClick={() => nav(`/project/${name}`)}>
                    <Typography variant="h4" color="textPrimry">
                        {name}
                    </Typography>
                </CardContent>
                <CardActions>
                    <a href={`/projects/${name}`}>
                        <Button startIcon={<OpenInNew />}>View</Button>
                    </a>
                </CardActions>
            </Card>
        </Grid>
    );
}

export function HomeView() {
    const [projects] = useProjects();
    return (
        <div>
            <Grid container spacing={3}>
                {projects.map((project) => (
                    <ProjectTile key={project.name} name={project.name} />
                ))}
            </Grid>
        </div>
    );
}
