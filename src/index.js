import PathRecognizer from "./PathRecognizer.vue";
import { PathRecognizerModels } from "./models.js";

// 主要組件匯出
export default PathRecognizer;

// 模型類別匯出 (保持向後相容)
export { PathRecognizerModels };
export const PathRecognizerModel = PathRecognizerModels; // 舊名稱相容
