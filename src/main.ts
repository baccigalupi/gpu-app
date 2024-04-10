import "./style.css";
import { gpuApp } from "./gpuApp.ts";
import { helloHardCoded } from "./views/helloHardCoded.ts";

const gpu = await gpuApp();

helloHardCoded(gpu);

window.addEventListener('resize', () => gpu.onCanvasResize())
// listen for input
