<script setup>
import { ref, onMounted } from "vue";
import PathRecognizer from "vue-path-recognizer";
import { PathRecognizerModels } from "vue-path-recognizer";

// 響應式狀態
const context = ref(null);
const result = ref("");

// 過濾函數
const filter = (infos, model) => {
  let lastPoint;
  switch (model.datas) {
    case "P":
      lastPoint = [...infos.deltaPoints].pop();
      if (lastPoint.y > infos.boundingBox.top + infos.boundingBox.height * 0.6)
        return Number.POSITIVE_INFINITY;
      return infos.cost;
    case "D":
      lastPoint = [...infos.deltaPoints].pop();
      if (lastPoint.y < infos.boundingBox.top + infos.boundingBox.height * 0.6)
        return Number.POSITIVE_INFINITY;
      return infos.cost;
    case "Q":
      lastPoint = [...infos.deltaPoints].pop();
      if (lastPoint.y > infos.boundingBox.top + infos.boundingBox.height * 0.3)
        return Number.POSITIVE_INFINITY;
      return infos.cost;
    case "G":
      lastPoint = [...infos.deltaPoints].pop();
      if (lastPoint.y < infos.boundingBox.top + infos.boundingBox.height * 0.3)
        return Number.POSITIVE_INFINITY;
      return infos.cost;
    default:
      return infos.cost;
  }
};

// 字母模型定義
const models = [
  new PathRecognizerModels([0, 3, 7, 1, 5], "★"),
  new PathRecognizerModels([7, 1], "A"),
  new PathRecognizerModels([2, 6, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4], "B"),
  new PathRecognizerModels([4, 3, 2, 1, 0], "C"),
  new PathRecognizerModels([2, 6, 7, 0, 1, 2, 3, 4], "D", filter),
  new PathRecognizerModels([4, 3, 2, 1, 0, 4, 3, 2, 1, 0], "E"),
  new PathRecognizerModels([4, 2], "F"),
  new PathRecognizerModels([4, 3, 2, 1, 0, 7, 6, 5, 0], "G", filter),
  new PathRecognizerModels([2, 6, 7, 0, 1, 2], "H"),
  new PathRecognizerModels([2], "I"),
  new PathRecognizerModels([2, 3, 4], "J"),
  new PathRecognizerModels([3, 4, 5, 6, 7, 0, 1], "K"),
  new PathRecognizerModels([2, 0], "L"),
  new PathRecognizerModels([6, 1, 7, 2], "M"),
  new PathRecognizerModels([6, 1, 6], "N"),
  new PathRecognizerModels([4, 3, 2, 1, 0, 7, 6, 5, 4], "O"),
  new PathRecognizerModels([2, 6, 7, 0, 1, 2, 3, 4], "P", filter),
  new PathRecognizerModels([4, 3, 2, 1, 0, 7, 6, 5, 4, 0], "Q", filter),
  new PathRecognizerModels([2, 6, 7, 0, 1, 2, 3, 4, 1], "R"),
  new PathRecognizerModels([4, 3, 2, 1, 0, 1, 2, 3, 4], "S"),
  new PathRecognizerModels([0, 2], "T"),
  new PathRecognizerModels([2, 1, 0, 7, 6], "U"),
  new PathRecognizerModels([1, 7, 0], "V"),
  new PathRecognizerModels([2, 7, 1, 6], "W"),
  new PathRecognizerModels([1, 0, 7, 6, 5, 4, 3], "X"),
  new PathRecognizerModels([2, 1, 0, 7, 6, 2, 3, 4, 5, 6, 7], "Y"),
  new PathRecognizerModels([0, 3, 0], "Z"),
];

// 事件處理函數
const handleGesture = (datas) => {
  if (datas) {
    result.value = datas;
  } else {
    result.value = null;
  }
};

const handleStartDraw = () => {
  context.value.clearRect(0, 0, 400, 400);
};

const handleMovePath = (points) => {
  context.value.clearRect(0, 0, 400, 400);
  context.value.moveTo(points[0].x, points[0].y);
  context.value.beginPath();
  for (let i = 1; i < points.length; i++) {
    context.value.lineTo(points[i].x, points[i].y);
  }
  context.value.stroke();
};

// 組件掛載後初始化 canvas
onMounted(() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 6;
  context.value = ctx;
});
</script>

<template>
  <div>
    <h1>Vue Path Recognizer 範例</h1>
    <p>在下方畫布上畫出字母，系統會自動辨識：</p>

    <PathRecognizer
      :models="models"
      :onGesture="handleGesture"
      :onStartDraw="handleStartDraw"
      :onMovePath="handleMovePath"
    >
      <template #default="props">
        <canvas
          id="canvas"
          width="400"
          height="400"
          @mousedown="props.onMouseDown"
          @mouseup="props.onMouseUp"
        />
      </template>
    </PathRecognizer>

    <div class="result">
      <h2 v-if="result">辨識結果: {{ result }}</h2>
      <h2 v-else>請在畫布上畫出字母...</h2>
    </div>

    <div class="instructions">
      <h3>支援的字母：</h3>
      <p>
        A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X,
        Y, Z, ★
      </p>
    </div>
  </div>
</template>

<style>
body {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
}

#canvas {
  background-color: #ddd;
  border: 2px solid #999;
  border-radius: 8px;
  cursor: crosshair;
  margin: 20px 0;
}

.result {
  margin: 20px 0;
  font-size: 24px;
  font-weight: bold;
}

.instructions {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.instructions h3 {
  margin-top: 0;
}

.instructions p {
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>
