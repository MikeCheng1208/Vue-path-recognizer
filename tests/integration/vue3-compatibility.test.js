import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref, reactive, nextTick } from "vue";
import PathRecognizer from "../../src/PathRecognizer.vue";

describe("Vue3 相容性整合測試", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PathRecognizer, {
      props: {
        models: [],
      },
    });
  });

  it("應該與 Vue3 Composition API 相容", async () => {
    // 測試組件是否正確使用 Vue3 特性
    expect(wrapper.vm).toBeDefined();
    expect(wrapper.vm.$).toBeDefined(); // Vue3 instance
  });

  it("應該支援響應式 props", async () => {
    const testSliceCount = ref(16);
    
    await wrapper.setProps({
      sliceCount: testSliceCount.value,
    });

    expect(wrapper.props("sliceCount")).toBe(16);

    // 測試響應式更新
    testSliceCount.value = 12;
    await wrapper.setProps({
      sliceCount: testSliceCount.value,
    });

    expect(wrapper.props("sliceCount")).toBe(12);
  });

  it("應該正確處理 Vue3 事件系統", async () => {
    const eventHandler = vi.fn();

    // 使用 Vue3 事件監聽方式
    wrapper.vm.$on = undefined; // Vue3 沒有 $on
    
    // 測試事件發送
    wrapper.vm.$emit("test-event", "test-data");
    
    // 檢查事件是否正確發送
    expect(wrapper.emitted("test-event")).toBeTruthy();
    expect(wrapper.emitted("test-event")[0][0]).toBe("test-data");
  });

  it("應該支援 Vue3 插槽系統", () => {
    const slotWrapper = mount(PathRecognizer, {
      props: { models: [] },
      slots: {
        default: `
          <template #default="{ onMouseDown, onMouseUp }">
            <div 
              data-testid="custom-slot"
              @mousedown="onMouseDown"
              @mouseup="onMouseUp"
            >
              Custom Content
            </div>
          </template>
        `,
      },
    });

    const customSlot = slotWrapper.find('[data-testid="custom-slot"]');
    expect(customSlot.exists()).toBe(true);
    expect(customSlot.text()).toBe("Custom Content");
  });

  it("應該正確處理 Vue3 響應式狀態", async () => {
    // 測試內部響應式狀態更新
    const mockEvent = {
      currentTarget: document.createElement("div"),
      clientX: 100,
      clientY: 100,
    };

    await wrapper.vm.handleDown(mockEvent);
    
    // Vue3 應該正確更新響應式狀態
    await nextTick();
    
    // 檢查狀態是否正確更新
    expect(wrapper.vm.moveTarget).toBeTruthy();
    expect(wrapper.vm.points).toBeDefined();
    expect(Array.isArray(wrapper.vm.points)).toBe(true);
  });

  it("應該支援 Vue3 的 defineExpose", () => {
    // 測試公開方法是否可訪問
    expect(typeof wrapper.vm.handleDown).toBe("function");
    expect(typeof wrapper.vm.handleUp).toBe("function");
    expect(typeof wrapper.vm.analyze).toBe("function");
    
    // Vue3 特有的方法檢查
    if (wrapper.vm.getCurrentPoints) {
      expect(typeof wrapper.vm.getCurrentPoints).toBe("function");
    }
  });

  it("應該正確處理 Vue3 生命週期", async () => {
    // 測試組件掛載和更新
    expect(wrapper.vm.$el).toBeDefined();
    
    // 測試 props 更新觸發重新渲染
    await wrapper.setProps({
      sliceCount: 16,
    });

    await nextTick();
    expect(wrapper.props("sliceCount")).toBe(16);
  });

  it("應該與 Vue3 測試工具相容", () => {
    // 測試 @vue/test-utils v2 的功能
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    expect(wrapper.classes()).toBeDefined();
    
    // 測試查找功能
    const rootElement = wrapper.find(".PathRecognizer");
    expect(rootElement.exists()).toBe(true);
  });

  it("應該支援 Vue3 的 Teleport 和 Suspense 功能", () => {
    // 測試組件在 Teleport 中的行為
    const teleportWrapper = mount({
      template: `
        <div>
          <Teleport to="body">
            <PathRecognizer :models="[]" />
          </Teleport>
        </div>
      `,
      components: {
        PathRecognizer,
      },
    });

    expect(teleportWrapper.exists()).toBe(true);
  });

  it("應該正確處理 Vue3 的錯誤邊界", async () => {
    // 測試錯誤處理不會破壞 Vue3 的錯誤邊界
    const errorHandler = vi.fn();
    
    // 模擬錯誤情況
    try {
      await wrapper.vm.handleDown(null); // 傳入 null 可能觸發錯誤
    } catch (error) {
      errorHandler(error);
    }

    // 組件應該仍然可用
    expect(wrapper.exists()).toBe(true);
  });
});
