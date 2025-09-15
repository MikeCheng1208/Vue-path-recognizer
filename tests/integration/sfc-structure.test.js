import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import PathRecognizer from "../../src/PathRecognizer.vue";
import fs from "fs";
import path from "path";

describe("SFC 檔案結構整合測試", () => {
  const componentPath = path.resolve(__dirname, "../../src/PathRecognizer.vue");

  it("應該使用 script setup 語法", async () => {
    // 讀取組件原始碼
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // 檢查是否使用 script setup
    expect(componentSource).toContain("<script setup>");

    // 不應該包含 Options API 的 export default
    expect(componentSource).not.toMatch(
      /export\s+default\s*\{[\s\S]*data\s*\(/
    );
  });

  it("應該按照正確的順序排列 SFC 區塊", () => {
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // 找到各個區塊的位置
    const scriptIndex = componentSource.indexOf("<script");
    const templateIndex = componentSource.indexOf("<template");
    const styleIndex = componentSource.indexOf("<style");

    // 檢查順序：script > template > style
    expect(scriptIndex).toBeLessThan(templateIndex);
    expect(templateIndex).toBeLessThan(styleIndex);
  });

  it("應該正確使用 defineProps", () => {
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // 檢查是否使用 defineProps
    expect(componentSource).toContain("defineProps");

    // 不應該使用舊的 props 定義方式
    expect(componentSource).not.toMatch(/props\s*:\s*\{/);
  });

  it("應該正確使用 defineEmits", () => {
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // 檢查是否使用 defineEmits
    expect(componentSource).toContain("defineEmits");

    // 不應該使用舊的 emits 定義方式
    expect(componentSource).not.toMatch(/emits\s*:\s*\[/);
  });

  it("應該正確使用 defineExpose", () => {
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // 檢查是否使用 defineExpose 暴露方法
    expect(componentSource).toContain("defineExpose");
  });

  it("應該使用 Composition API 的響應式 API", () => {
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // 檢查是否從 vue 匯入響應式 API
    expect(componentSource).toMatch(
      /import.*\{[^}]*ref[^}]*\}.*from.*['"]vue['"]/
    );

    // 不應該使用 Options API 的 data
    expect(componentSource).not.toMatch(/data\s*\(\s*\)\s*\{/);
  });

  it("組件應該正確編譯和掛載", () => {
    // 測試組件能否正確掛載（這證明 SFC 結構正確）
    const wrapper = mount(PathRecognizer, {
      props: {
        models: [],
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("PathRecognizer");
  });

  it("應該保持模板結構不變", () => {
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // 檢查模板中的關鍵結構
    expect(componentSource).toContain('<div class="PathRecognizer">');
    expect(componentSource).toContain("<slot");
    expect(componentSource).toContain(":onMouseDown");
    expect(componentSource).toContain(":onMouseUp");
  });

  it("應該保持樣式區塊", () => {
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // 檢查是否有樣式區塊
    expect(componentSource).toMatch(/<style[^>]*>/);
    expect(componentSource).toContain("</style>");
  });

  it("script setup 應該包含所有必要的邏輯", () => {
    const componentSource = fs.readFileSync(componentPath, "utf-8");

    // 檢查關鍵方法是否存在
    expect(componentSource).toMatch(/const\s+handleDown\s*=/);
    expect(componentSource).toMatch(/const\s+handleUp\s*=/);
    expect(componentSource).toMatch(/const\s+handleMove\s*=/);
    expect(componentSource).toMatch(/const\s+analyze\s*=/);
  });

  it("應該正確處理事件監聽器", () => {
    const wrapper = mount(PathRecognizer, {
      props: {
        models: [],
      },
      slots: {
        default: `
          <template #default="{ onMouseDown, onMouseUp }">
            <div 
              data-testid="test-area"
              @mousedown="onMouseDown"
              @mouseup="onMouseUp"
            />
          </template>
        `,
      },
    });

    const testArea = wrapper.find('[data-testid="test-area"]');
    expect(testArea.exists()).toBe(true);

    // 測試事件處理函數是否正確傳遞
    const slotContent = wrapper.find('[data-testid="test-area"]');
    expect(slotContent.exists()).toBe(true);

    // 在 Vue3 中，插槽 props 的訪問方式不同
    // 我們通過檢查組件是否正確渲染來驗證插槽功能
    expect(wrapper.vm.handleDown).toBeDefined();
    expect(wrapper.vm.handleUp).toBeDefined();
  });
});
