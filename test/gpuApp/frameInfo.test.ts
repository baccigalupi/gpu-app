import { describe, it, expect, vi, beforeEach } from "vitest";
import { FrameInfo } from "../../lib/gpuApp/frameInfo";

describe("FrameInfo", () => {
  it("has good default values and doesnt't freak out during first calculation", () => {
    const frameInfo = new FrameInfo();

    expect(() => {
      frameInfo.update();
    }).not.toThrowError();
  });

  it("calculates the delta time and the frame rate", () => {
    const frameInfo = new FrameInfo();
    const mockNow = frameInfo.startTime + 1200;

    frameInfo.update(mockNow);

    expect(frameInfo.startTime).toEqual(mockNow);
    expect(frameInfo.deltaTime).toEqual(1200);
    expect(frameInfo.rate).toEqual(3);
  });

  it("calls the update function, if it has one", () => {
    const data = {
      deltaTime: 0,
      frameRate: 0,
    };

    const onUpdate = vi.fn((frame) => {
      data.deltaTime = frame.deltaTime;
      data.frameRate = frame.rate;
    });
    const frameInfo = new FrameInfo(onUpdate);
    const mockNow = frameInfo.startTime + 1200;

    frameInfo.update(mockNow);

    expect(data).toEqual({
      deltaTime: 1200,
      frameRate: 3,
    });
  });
});
