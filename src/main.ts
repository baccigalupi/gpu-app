import "./style.css";
import { gpuApp } from "./gpuApp.ts";
import { dynamicBackground } from "./examples/background/dynamicViaAttatchment.ts";

const gpu = await gpuApp();

dynamicBackground(gpu);

// listen for input
