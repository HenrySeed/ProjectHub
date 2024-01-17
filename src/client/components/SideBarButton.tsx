import { Add, Home, Web } from "@mui/icons-material";
import { Badge, Button, SvgIconProps, useTheme } from "@mui/material";
import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";

function SideBarButton({
    name,
    icon,
    onClick,
    selected,
    remainingTodo,
}: {
    name: string;
    icon: ReactNode;
    onClick: () => void;
    selected: boolean;
    remainingTodo?: number;
}) {
    const theme = useTheme();

    return (
        <Button
            fullWidth
            variant="text"
            style={{
                borderRadius: "10px",
                padding: "10px 5px",
                paddingLeft: !icon ? "40px" : undefined,
                justifyContent: "flex-start",
                textAlign: "left",
                textTransform: "none",
                fontSize: "10pt",
                fontWeight: "normal",
                color: selected ? theme.palette.primary.main : "#FFF",
                background: selected
                    ? theme.palette.action.selected
                    : undefined,
            }}
            onClick={() => onClick()}
        >
            {icon && (
                <span
                    style={{
                        height: "17px",
                        width: "30px",
                        marginTop: "-4px",
                        marginRight: "7px",
                    }}
                >
                    {icon}
                </span>
            )}
            {name}
            <Badge
                color="error"
                style={{ position: "absolute", right: "20px" }}
                badgeContent={remainingTodo}
                max={99}
            />
        </Button>
    );
}

export function SideBarProject({
    name,
    onClick,
    remainingTodo,
}: {
    name: string;
    onClick: () => void;
    remainingTodo?: number;
}) {
    const theme = useTheme();
    const path = useLocation().pathname;

    let activeProj = "";
    if (path.startsWith("/project/")) {
        activeProj = path.replace(/^\/project\//, "");
    }
    const selected = activeProj === name;
    const iconProps: SvgIconProps = {
        style: { fontSize: "16pt" },
        color: "primary",
    };

    let icon: JSX.Element | undefined = undefined;
    if (name === "Home") icon = <Home {...iconProps} />;
    else if (name === "New Project") icon = <Add {...iconProps} />;
    else icon = <Web {...iconProps} />;
    // else if (!selected) icon = <KeyboardArrowRight {...iconProps} />;
    // else if (selected) icon = <KeyboardArrowDown {...iconProps} />;

    return (
        <>
            <div style={{ margin: "0 10px" }}>
                <SideBarButton
                    name={name}
                    onClick={onClick}
                    icon={icon}
                    selected={selected}
                    remainingTodo={remainingTodo}
                />
            </div>
            {/* {selected && (
                <div
                    style={{
                        marginLeft: "20px",
                        width: "calc(100% - 32px)",
                        color: "rgba(2555,255,255,0.7)",
                    }}
                >
                    <SideBarButton
                        name={"Files"}
                        onClick={() => {}}
                        icon={
                            <Folder
                                {...iconProps}
                                style={{ ...iconProps.style, fontSize: "14pt" }}
                            />
                        }
                        selected={false}
                    />
                    <SideBarButton
                        name={"ReadMe"}
                        onClick={() => {}}
                        icon={
                            <Article
                                {...iconProps}
                                style={{ ...iconProps.style, fontSize: "14pt" }}
                            />
                        }
                        selected={false}
                    />
                </div>
            )} */}
        </>
    );
}
