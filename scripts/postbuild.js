// Generates codebase/dhtmlxgantt.d.ts from the bundled template after a build.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));
const template = fs.readFileSync(path.join(rootDir, "src", "types", "gantt_types.ts"), "utf8");
const content = template.replace(/{{version}}/g, pkg.version);

fs.writeFileSync(path.join(rootDir, "codebase", "dhtmlxgantt.d.ts"), content);
fs.writeFileSync(path.join(rootDir, "codebase", "dhtmlxgantt.es.d.ts"), content);
console.log("codebase/dhtmlxgantt.d.ts generated");
