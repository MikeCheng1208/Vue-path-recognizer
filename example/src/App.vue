<script>
import Vue from "vue";
import PathRecognizer, { PathRecognizerModel } from "./PathRecognizer.vue";
export default {
  components: {
    PathRecognizer
  },
  data() {
    return {
      context: null,
      result: "",
      models: [
        new PathRecognizerModel([6,0, 2,4,7], "幹"),
        new PathRecognizerModel([0, 3, 7, 1, 5], "★"),
        new PathRecognizerModel([7, 1], "A"),
        new PathRecognizerModel([2, 6, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4], "B"),
        new PathRecognizerModel([4, 3, 2, 1, 0], "C"),
        new PathRecognizerModel([2, 6, 7, 0, 1, 2, 3, 4], "D", this.filter),
        new PathRecognizerModel([4, 3, 2, 1, 0, 4, 3, 2, 1, 0], "E"),
        new PathRecognizerModel([4, 2], "F"),
        new PathRecognizerModel([4, 3, 2, 1, 0, 7, 6, 5, 0], "G", this.filter),
        new PathRecognizerModel([2, 6, 7, 0, 1, 2], "H"),
        new PathRecognizerModel([2], "I"),
        new PathRecognizerModel([2, 3, 4], "J"),
        new PathRecognizerModel([3, 4, 5, 6, 7, 0, 1], "K"),
        new PathRecognizerModel([2, 0], "L"),
        new PathRecognizerModel([6, 1, 7, 2], "M"),
        new PathRecognizerModel([6, 1, 6], "N"),
        new PathRecognizerModel([4, 3, 2, 1, 0, 7, 6, 5, 4], "O"),
        new PathRecognizerModel([2, 6, 7, 0, 1, 2, 3, 4], "P", this.filter),
        new PathRecognizerModel(
          [4, 3, 2, 1, 0, 7, 6, 5, 4, 0],
          "Q",
          this.filter
        ),
        new PathRecognizerModel([2, 6, 7, 0, 1, 2, 3, 4, 1], "R"),
        new PathRecognizerModel([4, 3, 2, 1, 0, 1, 2, 3, 4], "S"),
        new PathRecognizerModel([0, 2], "T"),
        new PathRecognizerModel([2, 1, 0, 7, 6], "U"),
        new PathRecognizerModel([1, 7, 0], "V"),
        new PathRecognizerModel([2, 7, 1, 6], "W"),
        new PathRecognizerModel([1, 0, 7, 6, 5, 4, 3], "X"),
        new PathRecognizerModel([2, 1, 0, 7, 6, 2, 3, 4, 5, 6, 7], "Y"),
        new PathRecognizerModel([0, 3, 0], "Z")
      ]
    };
  },
  methods: {
    filter(infos, model) {
      let lastPoint;
      switch (model.datas) {
        case "P":
          lastPoint = [...infos.deltaPoints].pop();
          if (
            lastPoint.y >
            infos.boundingBox.top + infos.boundingBox.height * 0.6
          )
            return Number.POSITIVE_INFINITY;
          return infos.cost;
        case "D":
          lastPoint = [...infos.deltaPoints].pop();
          if (
            lastPoint.y <
            infos.boundingBox.top + infos.boundingBox.height * 0.6
          )
            return Number.POSITIVE_INFINITY;
          return infos.cost;
        case "Q":
          lastPoint = [...infos.deltaPoints].pop();
          if (
            lastPoint.y >
            infos.boundingBox.top + infos.boundingBox.height * 0.3
          )
            return Number.POSITIVE_INFINITY;
          return infos.cost;
        case "G":
          lastPoint = [...infos.deltaPoints].pop();
          if (
            lastPoint.y <
            infos.boundingBox.top + infos.boundingBox.height * 0.3
          )
            return Number.POSITIVE_INFINITY;
          return infos.cost;
        default:
          return infos.cost;
      }
    },
    handleGesture(datas) {
      if (datas) {
        this.result = datas;
      } else {
        this.result = null;
      }
    },
    handleStartDraw() {
      this.context.clearRect(0, 0, 400, 400);
    },
    handleMovePath(points) {
      this.context.clearRect(0, 0, 400, 400);
      this.context.moveTo(points[0].x, points[0].y);
      this.context.beginPath();
      for (let i = 1; i < points.length; i++) {
        this.context.lineTo(points[i].x, points[i].y);
      }
      this.context.stroke();
    }
  },
  mounted() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    context.stokeStyle = "#444";
    context.lineWidth = 6;
    this.context = context;
  }
};
</script>

<template>
  <div>
    <path-recognizer
      :models="models"
      :onGesture="handleGesture"
      :onStartDraw="handleStartDraw"
      :onMovePath="handleMovePath"
    >
      <template v-slot:default="props">
        <canvas
          id="canvas"
          width="400"
          height="400"
          @mousedown="props.onMouseDown"
          @mouseup="props.onMouseUp"
        ></canvas>
      </template>
    </path-recognizer>
    <div class="result">
      <h1>{{this.result}}</h1>
    </div>
  </div>
</template>

<style lang="scss">
    #canvas{
        background-color: #ddd;
    }
</style>
