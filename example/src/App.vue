<script setup>
import { ref, onMounted } from "vue";
import PathRecognizer, {
  PathRecognizerModel,
} from "../../dist/vue-path-recognizer.es.js";

const context = ref(null);
const result = ref("");

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

const models = ref([
  new PathRecognizerModel([0, 3, 7, 1, 5], "★"),
  new PathRecognizerModel([7, 1], "A"),
  new PathRecognizerModel([2, 6, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4], "B"),
  new PathRecognizerModel([4, 3, 2, 1, 0], "C"),
  new PathRecognizerModel([2, 6, 7, 0, 1, 2, 3, 4], "D", filter),
  new PathRecognizerModel([4, 3, 2, 1, 0, 4, 3, 2, 1, 0], "E"),
  new PathRecognizerModel([4, 2], "F"),
  new PathRecognizerModel([4, 3, 2, 1, 0, 7, 6, 5, 0], "G", filter),
  new PathRecognizerModel([2, 6, 7, 0, 1, 2], "H"),
  new PathRecognizerModel([2], "I"),
  new PathRecognizerModel([2, 3, 4], "J"),
  new PathRecognizerModel([3, 4, 5, 6, 7, 0, 1], "K"),
  new PathRecognizerModel([2, 0], "L"),
  new PathRecognizerModel([6, 1, 7, 2], "M"),
  new PathRecognizerModel([6, 1, 6], "N"),
  new PathRecognizerModel([4, 3, 2, 1, 0, 7, 6, 5, 4], "O"),
  new PathRecognizerModel([2, 6, 7, 0, 1, 2, 3, 4], "P", filter),
  new PathRecognizerModel([4, 3, 2, 1, 0, 7, 6, 5, 4, 0], "Q", filter),
  new PathRecognizerModel([2, 6, 7, 0, 1, 2, 3, 4, 1], "R"),
  new PathRecognizerModel([4, 3, 2, 1, 0, 1, 2, 3, 4], "S"),
  new PathRecognizerModel([0, 2], "T"),
  new PathRecognizerModel([2, 1, 0, 7, 6], "U"),
  new PathRecognizerModel([1, 7, 0], "V"),
  new PathRecognizerModel([2, 7, 1, 6], "W"),
  new PathRecognizerModel([1, 0, 7, 6, 5, 4, 3], "X"),
  new PathRecognizerModel([2, 1, 0, 7, 6, 2, 3, 4, 5, 6, 7], "Y"),
  new PathRecognizerModel([0, 3, 0], "Z"),
]);

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

onMounted(() => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.stokeStyle = "#444";
  ctx.lineWidth = 6;
  context.value = ctx;
});
</script>

<template>
  <div>
    <h1>Vue Path Recognizer Example</h1>
    <p>在畫布上畫出字母或符號，系統會自動識別！</p>

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
        ></canvas>
      </template>
    </PathRecognizer>

    <div class="result">
      <h2>識別結果：{{ result || "尚未識別" }}</h2>
    </div>

    <div class="instructions">
      <h3>支援的字母和符號：</h3>
      <p>A-Z, ★ (星號)</p>
      <p>在畫布上用滑鼠畫出字母形狀即可識別</p>
    </div>
  </div>
</template>

<style scoped>
#canvas {
  background-color: #ddd;
  border: 2px solid #333;
  border-radius: 8px;
  cursor: crosshair;
}

.result {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}

.result h2 {
  color: #333;
  font-size: 24px;
  margin: 0;
}

.instructions {
  margin-top: 20px;
  padding: 15px;
  background-color: #e8f4f8;
  border-radius: 8px;
}

.instructions h3 {
  color: #2c3e50;
  margin-top: 0;
}

.instructions p {
  color: #555;
  margin: 5px 0;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

div {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 20px;
}
</style>
