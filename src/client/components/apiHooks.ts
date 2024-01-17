import { useEffect, useState } from "react";
import {
    HubConfig,
    PFile,
    PScript,
    ProjConfig,
    ProjConfigTodo,
    ProjPost,
} from "src/modules";

async function post(path: string, body: any) {
    try {
        const res = await fetch(path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        if (res.ok) {
            return await res.json();
        } else {
            return [];
        }
    } catch (e) {
        console.error(e);
    }
}

export function useProjects(): [PFile[]] {
    const [files, setFiles] = useState<PFile[]>([]);

    useEffect(() => {
        post("http://localhost:3000/api/getDirContents", {
            path: "./projects",
        })
            .then((body) => setFiles(body.files))
            .catch(() => setFiles([]));
    }, []);

    return [files];
}

export function useProjectFiles(projName: string): [PFile[]] {
    const [files, setFiles] = useState<PFile[]>([]);

    useEffect(() => {
        post("http://localhost:3000/api/getDirContents", {
            path: `./projects/${projName}`,
        })
            .then((body) =>
                setFiles(
                    (body.files as PFile[]).sort((a, b) => b.mTime - a.mTime)
                )
            )
            .catch(() => setFiles([]));
    }, [projName]);

    return [files];
}

export function useFileContents(path: string) {
    const [text, setText] = useState("");

    useEffect(() => {
        post("http://localhost:3000/api/getFileContents", {
            path: path,
        })
            .then((body) => setText(body.text))
            .catch(() => setText(""));
    }, [path]);

    return [text];
}

export function useProjConfig(projName: string) {
    const [config, setConfig] = useState<ProjConfig | undefined>();

    useEffect(() => {
        post("http://localhost:3000/api/getProjConfig", {
            projName,
        })
            .then((body) => {
                setConfig(body.config);
            })
            .catch(() => setConfig(undefined));
    }, [projName]);

    function updateConfig(key: keyof ProjConfig, value: any) {
        const newConfig = { ...config };
        newConfig[key] = value;
        setConfig(newConfig);
        post("http://localhost:3000/api/setProjConfig", {
            projName,
            config: newConfig,
        });
    }

    return {
        ...config,
        setPosts: (val: ProjPost[]) => updateConfig("posts", val),
        setTodo: (newTodo: ProjConfigTodo[]) => updateConfig("todo", newTodo),
    };
}

export function useProjectTodo() {
    const [projectTodo, setprojectTodo] = useState<
        Map<string, number> | undefined
    >(undefined);

    useEffect(() => {
        post("http://localhost:3000/api/getDirContents", {
            path: "./projects",
        }).then((body) => {
            const projNames = (body.files as PFile[]).map((file) => file.name);
            Promise.all(
                projNames.map((projName) =>
                    post("http://localhost:3000/api/getProjConfig", {
                        projName,
                    }).then((body) => ({
                        name: projName,
                        todo: (body.config as ProjConfig).todo.filter(
                            (val) => !val.checked
                        ).length,
                    }))
                )
            ).then((val) =>
                setprojectTodo(new Map(val.map((val) => [val.name, val.todo])))
            );
        });
    }, []);

    return projectTodo;
}

export function useHubConfig(): [newProjScripts: PScript[]] {
    const [newProjScripts, setNewProjScripts] = useState<any>(undefined);

    useEffect(() => {
        post("http://localhost:3000/api/getHubConfig", {})
            .then((body) => {
                const config = body.config as HubConfig;
                setNewProjScripts(config.newProjScripts);
            })
            .catch(() => setNewProjScripts(undefined));
    }, []);

    return [newProjScripts];
}
