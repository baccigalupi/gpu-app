import examples, { RenderFunction } from "../index";

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
