import type { GpuApp } from "../gpuApp.ts";
import type { UiData } from "./ui/uiData.ts";

export type RenderFunction = (type: GpuApp, uiData: UiData) => void;
export type ExampleMap = Record<string, RenderFunction>;

import {
  renderBackgroundAndTriangle,
  renderBackgroundOnly,
  renderBackgroundOnlyStatic,
} from "./backgroundAttachment/index.ts";

import { renderBackgroundRectangleInGpu } from "./backgroundRendered/index.ts";

export default {
  backgroundAttachmentStatic: renderBackgroundOnlyStatic,
  backgroundAttachmentChanging: renderBackgroundOnly,
  backgroundAttachmentWithTriangle: renderBackgroundAndTriangle,
  renderedBackground: renderBackgroundRectangleInGpu,
} as ExampleMap;
