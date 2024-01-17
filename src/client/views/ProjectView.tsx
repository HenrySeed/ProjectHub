import { OpenInNew } from "@mui/icons-material";
import {
    Button,
    Divider,
    Grid,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useParams } from "react-router-dom";
import { timeAgo } from "../../utils";
import { ProjectPostLog } from "../components/MessageLog";
import { TodoLog } from "../components/TodoLog";
import {
    useFileContents,
    useProjConfig,
    useProjectFiles,
} from "../components/apiHooks";

export function ProjectView() {
    const { projName } = useParams();
    const [files] = useProjectFiles(projName);
    const theme = useTheme();
    const { launchPath, readme, screenshot } = useProjConfig(projName);

    return (
        <Grid container spacing={2}>
            <Grid
                item
                xs={12}
                md={8}
                lg={9}
                style={{
                    paddingTop: "26px",
                    minHeight: "100vh",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        padding: "0px",
                        borderRight: `1px solid ${theme.palette.divider}`,
                        paddingRight: "24px",
                        paddingBottom: "200px",
                    }}
                >
                    <Grid container spacing={4}>
                        <Grid
                            item
                            xs={12}
                            container
                            justifyContent="space-between"
                        >
                            <Grid item flexGrow={1}>
                                <Typography color="textPrimary" variant="h2">
                                    {projName}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <a href={launchPath}>
                                    <Button startIcon={<OpenInNew />}>
                                        View
                                    </Button>
                                </a>
                            </Grid>
                        </Grid>

                        {screenshot && (
                            <Grid item xs={12}>
                                <img
                                    src={`http://localhost:3000${screenshot}`}
                                    style={{
                                        borderRadius: "10px",
                                        width: "100%",
                                    }}
                                />
                            </Grid>
                        )}

                        {readme && <ReadMeCard path={readme} />}

                        {files && (
                            <Grid item xs={12}>
                                <Box sx={{ width: "100%" }}>
                                    <DataGrid
                                        rows={files.map((val, i) => ({
                                            id: i,
                                            name: val.name,
                                            mTime: val.mTime,
                                        }))}
                                        columns={[
                                            {
                                                field: "name",
                                                headerName: "Name",
                                                flex: 0.6,
                                            },
                                            {
                                                field: "mTime",
                                                headerName: "Last Modified",
                                                flex: 0.4,
                                                renderCell: (params: any) => (
                                                    <Tooltip
                                                        title={new Date(
                                                            params.value
                                                        ).toLocaleString()}
                                                        placement="top"
                                                    >
                                                        <span>
                                                            {timeAgo(
                                                                new Date(
                                                                    params.value
                                                                )
                                                            )}
                                                        </span>
                                                    </Tooltip>
                                                ),
                                            },
                                        ]}
                                        hideFooter
                                        rowSelection={false}
                                    />
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Grid>

            <Grid
                item
                xs={12}
                md={4}
                lg={3}
                style={{
                    paddingTop: "26px",
                    minHeight: "100vh",
                }}
            >
                <Grid
                    container
                    direction="column"
                    justifyContent={"flex-start"}
                    spacing={2}
                    style={{ paddingBottom: "200px" }}
                >
                    <Grid item xs={12}>
                        <TodoLog projName={projName} />
                    </Grid>
                    <Grid item xs={12} style={{ padding: "30px 0px 10px 0" }}>
                        <Divider
                            style={{ width: "calc(100% + 24px)" }}
                            orientation="horizontal"
                            variant="fullWidth"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ProjectPostLog projName={projName} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

function ReadMeCard({ path }: { path: string }) {
    const theme = useTheme();
    const [readme] = useFileContents(path);

    return (
        <Grid item xs={12}>
            <Box
                sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    padding: "10px",
                }}
            >
                <Typography
                    color="primary"
                    gutterBottom
                    style={{ margin: "3px 10px 10px 5px" }}
                >
                    README.md
                </Typography>
                <Divider variant="fullWidth" orientation="horizontal" />
                <div className="markdown" style={{ margin: "0 7px" }}>
                    <ReactMarkdown>{readme}</ReactMarkdown>
                </div>
            </Box>
        </Grid>
    );
}
