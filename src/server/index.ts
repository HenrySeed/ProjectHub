import express, { Application } from "express";
import * as fs from "fs";
import path from "path";
import { PFile, ProjConfig } from "src/modules";
import { updateScreenshot } from "./takeScrenshotPreview";
const cors = require("cors");
const phpExpress = require("php-express")({
    // assumes php is in your PATH
    binPath: "php",
});

const PUBLIC_URL: string = process.env.PUBLIC_URL || "";
const PORT: string = process.env.PORT || "3000";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================== Static Serving =========================== //
app.use("/projects", express.static("projects"));
app.use("/projAssets", express.static("projAssets"));

app.use(
    PUBLIC_URL,
    express.static(path.resolve(__dirname, "../../build"), { maxAge: Infinity })
);

// ============================== PHP Serving =========================== //
// set view engine to php-express
app.set("views", "./projects");
app.engine("php", phpExpress.engine);
app.set("view engine", "php");

// routing all .php file to php-express
app.all(/.+\.php$/, phpExpress.router);

// ============================== CORS =========================== //
// Allow requests from your React app's domain
app.use(
    cors({
        origin: "http://localhost:3001", // Replace with your React app's URL
    })
);

// ============================== Helpers =========================== //
function getFiles(path: string): PFile[] {
    return fs
        .readdirSync(path)
        .filter((name) => !name.startsWith("."))
        .map((val) => ({
            name: val,
            mTime: fs.statSync(`${path}/${val}`).mtime.getTime(),
        }));
}

function fileExists(path: string) {
    return fs.existsSync(path);
}

function throwAPIError(res: any, message: string) {
    console.error(`[API] ${message}`);
    return res.status(500).send({ error: message });
}

function setup() {
    console.log(`[Setup] Generating Project Metadata`);
    // detects all projects
    const projects = getFiles("./projects").map((file) => file.name);

    if (!fileExists("./projAssets")) {
        fs.mkdirSync("./projAssets");
    }

    // make sure projAssets has config for each
    for (const projName of projects) {
        const dirPath = `./projAssets/${projName}`;
        const configPath = `./projAssets/${projName}/config.json`;
        let screenshotPath = `./projAssets/${projName}/screenshot.png`;
        const READMEPath = fileExists(`./projects/${projName}/README.md`)
            ? `./projects/${projName}/README.md`
            : "";
        let launchPath = `/projects/${projName}/`;
        let buildCmd = "";

        // if the folder isnt there, make it
        if (!fileExists(dirPath)) {
            console.log(`[Setup] ${projName} - Making asset folder`);
            fs.mkdirSync(dirPath);
        }

        if (fileExists(`./projects/${projName}/package.json`)) {
            console.log(`[Setup] ${projName} - package.json found`);
            const packageJSON = JSON.parse(
                fs
                    .readFileSync(`./projects/${projName}/package.json`)
                    .toString()
            );
            buildCmd =
                packageJSON.scripts?.build ||
                packageJSON.scripts?.compile ||
                "";
            launchPath = `/projects/${projName}/build/`;
        }

        // If Screenshot is missing, make it
        if (!fileExists(screenshotPath)) {
            console.log(`[Setup] ${projName} - Taking screenshot`);
            try {
                updateScreenshot(
                    `http://localhost:3000${launchPath}`,
                    projName,
                    screenshotPath
                );
            } catch {
                screenshotPath = "";
            }
        }

        // if the configJSON isnt there, make it
        if (!fileExists(configPath)) {
            console.log(`[Setup] ${projName} - Writing config`);
            const config: ProjConfig = {
                name: projName,
                launchPath,
                buildCmd,
                posts: [],
                readme: READMEPath,
                screenshot: screenshotPath.slice(1),
                todo: [],
            };

            fs.writeFileSync(configPath, JSON.stringify(config));
        }
    }
}

// ============================== API =========================== //
// ------------------ HubConfig ------------------ //
app.post("/api/getHubConfig", (req, res) => {
    const path = "./configuration.json";
    try {
        res.send({ config: JSON.parse(fs.readFileSync(path).toString()) });
    } catch {
        return throwAPIError(res, `Failed to read Configuration file: ${path}`);
    }
});
app.post("/api/setHubConfig", (req, res) => {
    const path = "./configuration.json";
    try {
        fs.writeFileSync(path, JSON.stringify(req.body.config));
        res.send();
    } catch {
        return throwAPIError(res, `Failed to read Configuration file: ${path}`);
    }
});

// ------------------ Directory Contents ------------------ //
app.post("/api/getDirContents", (req, res) => {
    const directoryPath = req.body.path;
    try {
        res.send({ files: getFiles(directoryPath) });
    } catch {
        return throwAPIError(res, `Failed to read dir ${directoryPath}`);
    }
});

// ------------------ File Contents ------------------ //
app.post("/api/getFileContents", (req, res) => {
    const path = req.body.path;
    try {
        res.send({ text: fs.readFileSync(path).toString() });
    } catch (e) {
        return throwAPIError(res, `Error Writing File ${path}\n${e.message}`);
    }
});

// ------------------ Project Configs ------------------ //
app.post("/api/getProjConfig", (req, res) => {
    const filePath = `./projAssets/${req.body.projName}/config.json`;

    try {
        res.send({ config: JSON.parse(fs.readFileSync(filePath).toString()) });
    } catch (e) {
        return throwAPIError(
            res,
            `Error Reading Config ${filePath}\n${e.message}`
        );
    }
});

app.post("/api/setProjConfig", (req, res) => {
    const projName: string = req.body.projName;
    const config: ProjConfig = req.body.config;
    const filePath = `./projAssets/${projName}/config.json`;

    try {
        fs.writeFileSync(filePath, JSON.stringify(config));
        res.send();
    } catch (e) {
        return throwAPIError(
            res,
            `Error Writing Config ${filePath}\n${e.message}`
        );
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../build/index.html"));
});

// ============================== The Server =========================== //
app.listen(PORT, () => {
    setup();
    console.log(
        "\x1b[34m",
        `${String.fromCodePoint(
            0x1f680
        )} Server has started running at http://localhost:${PORT}/ ${String.fromCodePoint(
            0x1f680
        )}`
    );
});

module.exports = app;
