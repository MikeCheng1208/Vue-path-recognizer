import PathRecognizer from './PathRecognizer.vue'
import { PathRecognizerModels } from './models.js'

// 主要組件匯出
export default PathRecognizer

// 模型類別匯出 (保持向後相容)
export { PathRecognizerModels }
export const PathRecognizerModel = PathRecognizerModels // 舊名稱相容

// Vue 3 插件安裝函數
export const install = (app) => {
  app.component('PathRecognizer', PathRecognizer)
}

// 自動安裝 (如果在瀏覽器環境中使用)
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}