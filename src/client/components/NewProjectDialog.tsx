import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useHubConfig } from "./apiHooks";

export function NewProjectDialog({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const theme = useTheme();
    const [newProjScripts] = useHubConfig();
    const [chosenScript, setChosenScript] = useState(" ");

    if (!newProjScripts) {
        return <></>;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth={"xs"}
            PaperProps={{
                style: {
                    backgroundColor: theme.palette.background.default,
                    backgroundImage: "none",
                    borderRadius: "10px",
                    padding: "10px",
                },
            }}
        >
            <DialogTitle>New Project</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} style={{ marginTop: "10px" }}>
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel
                                id="demo-simple-select-label"
                                shrink={true}
                            >
                                Script
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={chosenScript}
                                label="Script"
                                onChange={(e) =>
                                    setChosenScript(e.target.value)
                                }
                            >
                                {newProjScripts.map((script) => (
                                    <MenuItem
                                        value={script.name}
                                        key={script.name}
                                    >
                                        {script.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
