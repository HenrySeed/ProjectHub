import useWhisper from "@chengsokdara/use-whisper";
import { Add, Close, Delete, Mic, Save, Stop } from "@mui/icons-material";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    IconButton,
    InputBase,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { openAIapiKey } from "../../key";
import { timeAgo } from "../../utils";
import { useProjConfig } from "./apiHooks";

function ProjPostCard({
    label,
    labelHover,
    text,
    style,
    cardActions,
    onEdit,
    disabled,
}: {
    label: string;
    labelHover?: string;
    text: string | ReactNode;
    style?: React.CSSProperties;
    cardActions?: ReactNode;
    onEdit?: () => void;
    disabled?: boolean;
}) {
    const theme = useTheme();

    if (onEdit) {
        return (
            <Button
                disabled={disabled}
                onClick={() => onEdit()}
                style={{
                    textAlign: "inherit",
                    textTransform: "none",
                    fontSize: "11pt",
                    padding: 0,
                    justifyContent: "flex-start",
                }}
                fullWidth
            >
                <CardContent style={{ padding: "16px" }}>
                    <Tooltip title={labelHover}>
                        <Typography
                            color="textPrimary"
                            style={{
                                margin: "-28px 0 0 0",
                                fontSize: "11pt",
                                position: "absolute",
                                color:
                                    style?.borderColor ||
                                    theme.palette.primary.main,
                                background: theme.palette.background.default,
                                padding: "0 4px",
                            }}
                        >
                            {label}
                        </Typography>
                    </Tooltip>
                    {typeof text === "string" ? (
                        <Typography color="textPrimary">{text}</Typography>
                    ) : (
                        text
                    )}
                </CardContent>
            </Button>
        );
    } else {
        return (
            <Card
                style={{
                    ...style,
                }}
            >
                <CardContent>
                    <Tooltip title={labelHover}>
                        <Typography
                            color="textPrimary"
                            style={{
                                marginTop: "-28px",
                                fontSize: "11pt",
                                position: "absolute",
                                color:
                                    style?.borderColor ||
                                    theme.palette.primary.main,
                                background: theme.palette.background.default,
                                padding: "0 4px",
                            }}
                        >
                            {label}
                        </Typography>
                    </Tooltip>
                    {typeof text === "string" ? (
                        <Typography
                            color="textPrimary"
                            style={{ marginTop: "5px" }}
                        >
                            {text}
                        </Typography>
                    ) : (
                        text
                    )}
                </CardContent>
                {cardActions && <CardActions>{cardActions}</CardActions>}
            </Card>
        );
    }
}

function EditPost({
    text,
    onSave,
    onCancel,
    onDelete,
    audoDictate,
}: {
    text: string;
    onSave: (text: string) => void;
    onCancel: () => void;
    onDelete?: () => void;
    audoDictate?: boolean;
}) {
    const [val, setVal] = useState(text);
    const theme = useTheme();
    const {
        recording,
        transcribing,
        transcript,
        stopRecording,
        startRecording,
        pauseRecording,
    } = useWhisper({
        apiKey: openAIapiKey,
        whisperConfig: {
            language: "en",
        },
        autoStart: audoDictate,
        removeSilence: true,
    });

    useEffect(() => {
        if (transcript.text && transcript.text !== "") {
            console.log(transcript.text);
            if (audoDictate) {
                onSave(transcript.text);
            } else {
                setVal((prev) => prev + transcript.text);
            }
        }
    }, [transcript.text]);

    const handleUserKeyPress = useCallback(
        (e: any) => {
            if (e.key === "Enter") {
                if (recording) {
                    stopRecording();
                } else if (!e.shiftKey) {
                    onSave(val.trim());
                }
            }
            if (e.key === "Escape") {
                onCancel();
            }
        },
        [recording, stopRecording, startRecording]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    return (
        <ProjPostCard
            style={{ borderColor: theme.palette.primary.main }}
            label="Editing"
            text={
                <InputBase
                    disabled={recording || transcribing}
                    autoFocus
                    value={
                        (recording && "Recording... Press ENTER to stop") ||
                        (transcribing && "Transcribing...") ||
                        val
                    }
                    onChange={(e) => setVal(e.target.value)}
                    fullWidth
                    multiline
                />
            }
            cardActions={
                <Grid container justifyContent="flex-end" spacing={1}>
                    <Grid item flexGrow={1}>
                        {onDelete && (
                            <Tooltip title="Delete">
                                <IconButton
                                    onClick={() => onDelete()}
                                    color="error"
                                >
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Grid>
                    <Grid item>
                        {!recording && (
                            <Tooltip title="Dictate">
                                <IconButton
                                    onClick={() => startRecording()}
                                    disabled={transcribing}
                                    color="info"
                                >
                                    <Mic />
                                </IconButton>
                            </Tooltip>
                        )}
                        {recording && (
                            <Tooltip title="Stop Dictation">
                                <IconButton
                                    onClick={() => stopRecording()}
                                    color="error"
                                >
                                    <Stop />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Grid>
                    <Grid item>
                        <Tooltip title="Cancel">
                            <IconButton
                                disabled={transcribing}
                                onClick={() => {
                                    pauseRecording();
                                    onCancel();
                                }}
                                color="info"
                            >
                                <Close />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title="Save">
                            <IconButton
                                disabled={recording || transcribing}
                                onClick={() => onSave(val)}
                                color="primary"
                            >
                                <Save />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            }
        />
    );
}

export function ProjectPostLog({ projName }: { projName: string }) {
    const { posts, setPosts } = useProjConfig(projName);
    const [editingMsg, setEditingMsg] = useState<null | number>(null);
    const [newMsg, setNewMsg] = useState<"TEXT" | "VOICE" | null>(null);
    const theme = useTheme();
    const smallScreen = useMediaQuery(theme.breakpoints.between("md", "xl"));

    if (!posts) {
        return <></>;
    }

    return (
        <>
            <Typography
                color="primary"
                style={{
                    marginBottom: "20px",
                    background: theme.palette.background.default,
                    width: "fit-content",
                    marginLeft: "-5px",
                    padding: "0 5px",
                    fontSize: "11pt",
                }}
            >
                Posts
            </Typography>
            <Grid container spacing={2}>
                {posts.map((msg, i) => (
                    <Grid item xs={12} key={msg.id}>
                        {editingMsg !== i ? (
                            <ProjPostCard
                                text={msg.text}
                                labelHover={new Date(msg.time).toLocaleString()}
                                label={timeAgo(new Date(msg.time))}
                                disabled={
                                    editingMsg !== null || newMsg !== null
                                }
                                onEdit={() => setEditingMsg(i)}
                            />
                        ) : (
                            <EditPost
                                text={msg.text}
                                onCancel={() => setEditingMsg(null)}
                                onSave={(text) => {
                                    const prev = [...posts];
                                    prev.splice(i, 1, {
                                        id: prev[i].id,
                                        time: Date.now(),
                                        text,
                                    });
                                    setPosts(prev);
                                    setEditingMsg(null);
                                }}
                                onDelete={() => {
                                    const prev = [...posts];
                                    prev.splice(i, 1);
                                    setPosts(prev);
                                    setEditingMsg(null);
                                }}
                            />
                        )}
                    </Grid>
                ))}

                {newMsg && (
                    <Grid item xs={12}>
                        <EditPost
                            text=""
                            audoDictate={newMsg === "VOICE"}
                            onCancel={() => setNewMsg(null)}
                            onSave={(text) => {
                                setNewMsg(null);
                                setPosts([
                                    ...posts,
                                    {
                                        time: Date.now(),
                                        text,
                                        id: uuidv4(),
                                    },
                                ]);
                            }}
                        />
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => setNewMsg("TEXT")}
                                variant="outlined"
                                fullWidth
                                disabled={editingMsg !== null}
                                style={{
                                    padding: "10px",
                                }}
                                startIcon={!smallScreen && <Add />}
                            >
                                {!smallScreen ? <>Add Note</> : <Add />}
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => setNewMsg("VOICE")}
                                variant="outlined"
                                fullWidth
                                disabled={editingMsg !== null}
                                style={{
                                    padding: "10px",
                                }}
                                startIcon={!smallScreen && <Mic />}
                            >
                                {!smallScreen ? <>Add Dictation</> : <Mic />}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
