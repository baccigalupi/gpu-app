import type { GpuApp } from "../../dist/gpu-app.es.js";
import type { UiData } from "./uiData.ts";

import {
  renderBackgroundAndTriangle,
  renderBackgroundOnly,
  renderBackgroundOnlyStatic,
} from "../1-backgroundAttachment/index.ts";

import {
  renderBackgroundRectangleInGpu,
  renderBackgroundRectangleWithTriangle,
} from "../2-backgroundRendered/index.ts";

const examples = {
  backgroundAttachmentStatic: renderBackgroundOnlyStatic,
  backgroundAttachmentChanging: renderBackgroundOnly,
  backgroundAttachmentWithTriangle: renderBackgroundAndTriangle,
  renderedBackground: renderBackgroundRectangleInGpu,
  renderedBackgoundWithTriangle: renderBackgroundRectangleWithTriangle,
} as ExampleMap;

type RenderFunction = (type: GpuApp, uiData: UiData) => void;
type ExampleMap = Record<string, RenderFunction>;

export const getPageParam = () => {
  if (!location.search) return "";

  const pageParam = location.search
    .split("?")[1]
    .split("&")
    .map((stringPair) => stringPair.split("="))
    .find(([key, _value]) => key === "page");

  let page = "";
  if (pageParam) page = pageParam[1];

  return page;
};

export const getGpuApp = (): RenderFunction | null => {
  const page = getPageParam();
  return examples[page];
};
