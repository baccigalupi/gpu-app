import {
  renderBackgroundAndTriangle,
  renderBackgroundOnly,
  renderBackgroundOnlyStatic
} from "./backgroundAttachment/index.ts";

import {
  renderBackgroundRectangleInGpu
} from "./backgroundRendered/index.ts";

export default {
  backgroundViaAttachment: {
    static: renderBackgroundOnlyStatic,
    changing: renderBackgroundOnly,
    withTriangle: renderBackgroundAndTriangle,
  },
  renderedBackground: {
    changing: renderBackgroundRectangleInGpu,
  }
}