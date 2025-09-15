<script setup>
import { ref } from "vue";
import {
  PathRecognizerCore,
  Path,
  PathInfos,
  PathRect,
  PathPoint,
} from "./models.js";

// Props 定義
const props = defineProps({
  sliceCount: {
    type: Number,
    default: 8,
  },
  deltaMove: {
    type: Number,
    default: 8,
  },
  costMax: {
    type: Number,
    default: 32,
  },
  models: {
    type: Array,
    default: () => [],
  },
  onStartDraw: {
    type: Function,
    default: () => {},
  },
  onMovePath: {
    type: Function,
    default: () => {},
  },
  onStopDraw: {
    type: Function,
    default: () => {},
  },
  onGesture: {
    type: Function,
    default: () => {},
  },
});

// 事件定義
const emit = defineEmits(["start-draw", "move-path", "stop-draw", "gesture"]);

// 響應式狀態
const moveTarget = ref(null);
const points = ref([]);

// 方法定義
const handleDown = (e) => {
  moveTarget.value = e.currentTarget;
  points.value = [{ x: e.clientX, y: e.clientY }];
  window.document.addEventListener("mouseup", handleUp);
  startRecording();
};

const handleUp = () => {
  window.document.removeEventListener("mouseup", handleUp);
  stopRecording();
};

const handleMove = (e) => {
  const client = { x: e.clientX, y: e.clientY };
  points.value = [...points.value, client];
  if (props.onMovePath) {
    props.onMovePath(points.value);
  }
  emit("move-path", points.value);
};

const startRecording = () => {
  moveTarget.value.addEventListener("mousemove", handleMove);
  if (props.onStartDraw) props.onStartDraw();
  emit("start-draw");
};

const stopRecording = () => {
  moveTarget.value.removeEventListener("mousemove", handleMove);
  if (props.onStopDraw) props.onStopDraw();
  emit("stop-draw");

  if (points.value.length >= 2) {
    analyze();
  } else {
    if (props.onGesture) {
      props.onGesture(null);
    }
    emit("gesture", null);
  }
};

const analyze = () => {
  const path = new Path(points.value, props.deltaMove);
  const recognizer = new PathRecognizerCore(
    props.sliceCount,
    props.deltaMove,
    props.costMax,
    path
  );
  const model = recognizer.recognize(props.models);

  if (model) {
    if (props.onGesture) {
      props.onGesture(model.datas);
    }
    emit("gesture", model.datas);
  } else {
    if (props.onGesture) {
      props.onGesture(null);
    }
    emit("gesture", null);
  }
};

const clear = () => {
  points.value = [];
  moveTarget.value = null;
};

const getCurrentPoints = () => {
  return points.value;
};

// 暴露給父組件的方法
defineExpose({
  handleDown,
  handleUp,
  analyze,
  clear,
  getCurrentPoints,
  moveTarget,
  points,
});
</script>

<template>
  <div class="PathRecognizer">
    <slot :onMouseDown="handleDown" :onMouseUp="handleUp" />
  </div>
</template>

<style scoped>
.PathRecognizer {
  /* 保持原有樣式或添加新樣式 */
}
</style>
