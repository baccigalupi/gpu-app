import "./style.css";
import { gpuApp } from "./gpuApp.ts";
import { render } from "./examples/backgroundAttachment/index.ts";

const gpu = await gpuApp();
render(gpu);
