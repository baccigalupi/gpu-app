import "./style.css";
import { gpuApp } from "./gpuApp.ts";
import { helloHardCoded } from "./views/helloHardCoded.ts";

const gpu = await gpuApp();
helloHardCoded(gpu);
// listen for resize
// listen for input
