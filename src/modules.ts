export type PFile = {
    name: string;
    mTime: number;
};

export type ProjPost = {
    id: string;
    time: number;
    text: string;
};

export type ProjConfigTodo = { id: string; name: string; checked: boolean };

export type ProjConfig = {
    name: string;
    launchPath: string;
    buildCmd: string;
    posts: ProjPost[];
    screenshot: string;
    readme: string;
    todo: ProjConfigTodo[];
};

export type PScript = {
    name: string;
    description: string;
    script: string;
};

export type HubConfig = {
    newProjScripts: PScript[];
};

