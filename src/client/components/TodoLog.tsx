import { Add, Delete } from "@mui/icons-material";
import {
    Button,
    Checkbox,
    Grid,
    IconButton,
    InputBase,
    Typography,
    useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useProjConfig } from "./apiHooks";

function TodoItem({
    name,
    checked,
    onChange,
    onDelete,
    focussed,
}: {
    name: string;
    checked: boolean;
    onChange: (name: string, checked: boolean) => void;
    onDelete: () => void;
    focussed: boolean;
}) {
    const [textVal, setTextVal] = useState(name);
    const [isHovered, setIsHovered] = useState(false);

    function handleNameChange() {
        if (textVal.trim() === "") {
            onDelete();
        } else {
            onChange(textVal, checked);
        }
    }

    return (
        <InputBase
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            value={textVal}
            onChange={(e) => setTextVal(e.target.value.replace(/\n/g, ""))}
            autoFocus={focussed}
            multiline
            fullWidth
            defaultValue={name}
            style={{ padding: 0 }}
            startAdornment={
                <Checkbox
                    checked={checked}
                    onChange={(e) => {
                        onChange(name, e.target.checked);
                    }}
                />
            }
            endAdornment={
                isHovered && (
                    <IconButton
                        color="error"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <Delete
                            sx={{
                                width: "26px",
                                height: "26px",
                            }}
                        />
                    </IconButton>
                )
            }
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.stopPropagation();
                    handleNameChange();
                }
            }}
            onBlur={(e) => {
                handleNameChange();
            }}
        />
    );
}

export function TodoLog({ projName }: { projName: string }) {
    const { todo, setTodo } = useProjConfig(projName);
    const [newInput, setNewInput] = useState(false);
    const [hideDone, setHideDone] = useState(true);
    const theme = useTheme();

    if (!todo) return <></>;

    const completedTodo = todo.filter((val) => val.checked);
    const incompletedTodo = todo.filter((val) => !val.checked);

    return (
        <>
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                style={{ marginBottom: "10px" }}
            >
                <Grid item>
                    <Typography
                        color="primary"
                        style={{
                            background: theme.palette.background.default,
                            width: "fit-content",
                            padding: "0 5px",
                            fontSize: "11pt",
                            display: "inline-block",
                        }}
                    >
                        Todo
                    </Typography>
                </Grid>
                <Grid item>
                    {hideDone && completedTodo.length > 0 && (
                        <Button fullWidth onClick={() => setHideDone(false)}>
                            {completedTodo.length} Done
                        </Button>
                    )}
                    {!hideDone && completedTodo.length > 0 && (
                        <Button fullWidth onClick={() => setHideDone(true)}>
                            Hide Done
                        </Button>
                    )}
                </Grid>
            </Grid>

            <Grid container spacing={0}>
                {[...incompletedTodo, ...(!hideDone ? completedTodo : [])].map(
                    (val, i) => (
                        <Grid item xs={12} key={val.id}>
                            <TodoItem
                                name={val.name}
                                checked={val.checked}
                                focussed={
                                    newInput &&
                                    i ===
                                        todo.filter((val) => !val.checked)
                                            .length -
                                            1
                                }
                                onChange={(name, checked) => {
                                    const newTodo = [...todo];
                                    const index = newTodo.findIndex(
                                        (todo) => todo.id === val.id
                                    );
                                    newTodo[index].name = name;
                                    newTodo[index].checked = checked;
                                    setNewInput(false);
                                    setTodo(newTodo);
                                }}
                                onDelete={() => {
                                    const newTodo = [...todo];
                                    const index = newTodo.findIndex(
                                        (todo) => todo.id === val.id
                                    );
                                    newTodo.splice(index, 1);
                                    setTodo(newTodo);
                                }}
                            />
                        </Grid>
                    )
                )}

                <Grid item xs={12} style={{ textAlign: "center" }}>
                    <Button
                        fullWidth
                        onClick={() => {
                            setTodo([
                                ...todo,
                                {
                                    id: uuidv4(),
                                    name: "",
                                    checked: false,
                                },
                            ]);
                            setNewInput(true);
                        }}
                        style={{
                            justifyContent: "flex-start",
                            textTransform: "none",
                            padding: 0,
                        }}
                    >
                        <Add style={{ margin: "8px" }} />
                        <Typography>New Todo</Typography>
                    </Button>
                </Grid>
            </Grid>
        </>
    );
}
