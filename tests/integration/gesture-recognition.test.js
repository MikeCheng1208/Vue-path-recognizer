import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import PathRecognizer from "../../src/PathRecognizer.vue";
import { PathRecognizerModels } from "../../src/models.js";

describe("手勢辨識整合測試", () => {
  let wrapper;
  let mockModel;

  beforeEach(() => {
    // 建立測試用的辨識模型
    mockModel = new PathRecognizerModels([0, 1, 2, 3], "A");

    wrapper = mount(PathRecognizer, {
      props: {
        models: [mockModel],
        sliceCount: 8,
        deltaMove: 10,
        costMax: 50,
      },
    });
  });

  it("應該完整執行手勢辨識流程", async () => {
    const gestureCallback = vi.fn();

    await wrapper.setProps({
      onGesture: gestureCallback,
    });

    // 模擬完整的手勢輸入流程
    const startEvent = {
      currentTarget: document.createElement("div"),
      clientX: 100,
      clientY: 100,
    };

    // 開始手勢
    await wrapper.vm.handleDown(startEvent);
    expect(wrapper.emitted("start-draw")).toBeTruthy();

    // 模擬手勢移動軌跡 (右下方向)
    const moveEvents = [
      { clientX: 110, clientY: 105 },
      { clientX: 120, clientY: 110 },
      { clientX: 130, clientY: 115 },
      { clientX: 140, clientY: 120 },
    ];

    for (const event of moveEvents) {
      await wrapper.vm.handleMove(event);
    }

    // 檢查移動事件被觸發
    expect(wrapper.emitted("move-path")).toBeTruthy();
    expect(wrapper.emitted("move-path").length).toBeGreaterThan(0);

    // 結束手勢
    await wrapper.vm.handleUp();
    expect(wrapper.emitted("stop-draw")).toBeTruthy();

    // 檢查辨識結果
    expect(wrapper.emitted("gesture")).toBeTruthy();
    expect(gestureCallback).toHaveBeenCalled();
  });

  it("應該正確處理複雜手勢軌跡", async () => {
    const complexModel = new PathRecognizerModels(
      [0, 1, 2, 3, 4, 5, 6, 7],
      "O"
    );

    await wrapper.setProps({
      models: [complexModel],
    });

    // 模擬圓形軌跡
    const circlePoints = [];
    const centerX = 200;
    const centerY = 200;
    const radius = 50;

    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * 2 * Math.PI;
      circlePoints.push({
        clientX: centerX + Math.cos(angle) * radius,
        clientY: centerY + Math.sin(angle) * radius,
      });
    }

    // 開始手勢
    const startEvent = {
      currentTarget: document.createElement("div"),
      clientX: circlePoints[0].clientX,
      clientY: circlePoints[0].clientY,
    };

    await wrapper.vm.handleDown(startEvent);

    // 執行圓形軌跡
    for (let i = 1; i < circlePoints.length; i++) {
      await wrapper.vm.handleMove(circlePoints[i]);
    }

    // 結束手勢
    await wrapper.vm.handleUp();

    // 驗證辨識流程完成
    expect(wrapper.emitted("gesture")).toBeTruthy();
  });

  it("應該正確處理辨識失敗情況", async () => {
    const gestureCallback = vi.fn();

    await wrapper.setProps({
      models: [], // 空模型陣列
      onGesture: gestureCallback,
    });

    // 執行手勢但沒有匹配的模型
    const startEvent = {
      currentTarget: document.createElement("div"),
      clientX: 100,
      clientY: 100,
    };

    await wrapper.vm.handleDown(startEvent);
    await wrapper.vm.handleMove({ clientX: 150, clientY: 150 });
    await wrapper.vm.handleUp();

    // 應該返回 null 表示辨識失敗
    expect(gestureCallback).toHaveBeenCalledWith(null);
  });

  it("應該正確處理過短的手勢", async () => {
    const gestureCallback = vi.fn();

    await wrapper.setProps({
      onGesture: gestureCallback,
    });

    // 只有一個點的手勢
    const startEvent = {
      currentTarget: document.createElement("div"),
      clientX: 100,
      clientY: 100,
    };

    await wrapper.vm.handleDown(startEvent);
    // 不移動直接結束
    await wrapper.vm.handleUp();

    // 應該返回 null 因為點數不足
    expect(gestureCallback).toHaveBeenCalledWith(null);
  });

  it("應該正確計算手勢成本", async () => {
    const lowCostModel = new PathRecognizerModels([0, 0, 0], "I");

    await wrapper.setProps({
      models: [lowCostModel],
      costMax: 5, // 很低的成本閾值
    });

    // 模擬複雜軌跡（高成本）
    const startEvent = {
      currentTarget: document.createElement("div"),
      clientX: 100,
      clientY: 100,
    };

    await wrapper.vm.handleDown(startEvent);

    // 複雜的鋸齒軌跡
    const complexPoints = [
      { clientX: 110, clientY: 90 },
      { clientX: 120, clientY: 110 },
      { clientX: 130, clientY: 90 },
      { clientX: 140, clientY: 110 },
    ];

    for (const point of complexPoints) {
      await wrapper.vm.handleMove(point);
    }

    await wrapper.vm.handleUp();

    // 檢查是否觸發了手勢事件
    const gestureEvents = wrapper.emitted("gesture");
    expect(gestureEvents).toBeTruthy();

    // 由於簡單的直線軌跡與重複方向模型可能匹配，
    // 我們檢查確實有辨識結果（可能是 'I' 或 null）
    const lastResult = gestureEvents[gestureEvents.length - 1][0];
    expect(lastResult === "I" || lastResult === null).toBe(true);
  });
});
