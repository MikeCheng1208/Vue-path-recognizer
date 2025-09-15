import { ref as m, createElementBlock as v, openBlock as y, renderSlot as P } from "vue";
class M {
  constructor(o, n, t = null) {
    this.directions = o, this.datas = n, this.filter = t;
  }
}
class w {
  constructor(o, n, t, e) {
    this.sliceCount = o, this.deltMove = n, this.costMax = t, this.path = e, this.directions = this.computeDirections();
  }
  recognize(o) {
    let n = Number.POSITIVE_INFINITY, t = null;
    for (let e of o) {
      let i = this.costLeven(e.directions, this.directions);
      if (e.filter !== null) {
        let s = new I(
          this.path.deltaPoints,
          this.path.boundingBox,
          this.directions,
          i
        );
        i = e.filter(s, e);
      }
      i < this.costMax && i < n && (n = i, t = e);
    }
    return t;
  }
  directionCost(o, n) {
    let t = Math.abs(o - n);
    return t > this.sliceCount / 2 && (t = this.sliceCount - t), t;
  }
  create2dArray(o, n, t) {
    let e = [];
    for (let i = 0; i < o; i++) {
      e.push([]);
      for (let s = 0; s < n; s++)
        e[i].push(t);
    }
    return e;
  }
  costLeven(o, n) {
    let t = this.create2dArray(o.length + 1, n.length + 1, 0), e = this.create2dArray(o.length + 1, n.length + 1, 0), i = Number.POSITIVE_INFINITY;
    for (let r = 1; r <= o.length; r++)
      for (let l = 1; l < n.length; l++)
        t[r][l] = this.directionCost(o[r - 1], n[l - 1]);
    for (let r = 1; r <= n.length; r++)
      e[0][r] = i;
    for (let r = 1; r <= o.length; r++)
      e[r][0] = i;
    e[0][0] = 0;
    let s = 0, c, h, d;
    for (let r = 1; r <= o.length; r++)
      for (let l = 1; l < n.length; l++)
        s = t[r][l], c = e[r - 1][l] + s, h = e[r][l - 1] + s, d = e[r - 1][l - 1] + s, e[r][l] = Math.min(Math.min(c, h), d);
    return e[o.length][n.length - 1];
  }
  computeDirections() {
    let o = this.path.deltaPoints;
    if (o.count < 2)
      return [];
    let n = [], t = Math.PI * 2 / this.sliceCount;
    for (let e = 0; e < o.length - 1; e++) {
      let i = o[e].angleWithPoint(o[e + 1]);
      if (i < 0 && (i += Math.PI * 2), i < t / 2 || i > Math.PI * 2 - t)
        n.push(0);
      else {
        let s = Math.round(i / t);
        n.push(s);
      }
    }
    return n;
  }
}
class I {
  constructor(o, n, t, e) {
    this.deltaPoints = o, this.boundingBox = n, this.directions = t, this.cost = e;
  }
}
class b {
  constructor(o, n) {
    this.points = [];
    let t = Number.POSITIVE_INFINITY;
    this.boundingBox = new D(t, t, -t, -t);
    let e = new x(o[0].x, o[0].y), i = null;
    this.deltaPoints = [e];
    for (let s of o)
      i = new x(s.x, s.y), this.points.push(i), s.x < this.boundingBox.left && (this.boundingBox.left = s.x), s.x > this.boundingBox.right && (this.boundingBox.right = s.x), s.y < this.boundingBox.top && (this.boundingBox.top = s.y), s.y > this.boundingBox.bottom && (this.boundingBox.bottom = s.y), e.squareDistanceTo(i) >= n * n && (this.deltaPoints.push(i), e = i);
    e !== i && this.deltaPoints.push(i);
  }
  get count() {
    return this.points.length;
  }
}
class D {
  constructor(o = 0, n = 0, t = 0, e = 0) {
    this.top = o, this.left = n, this.bottom = t, this.right = e;
  }
  get height() {
    return this.bottom - this.top;
  }
  get width() {
    return this.right - this.left;
  }
}
class x {
  constructor(o, n) {
    this.x = o, this.y = n;
  }
  squareDistanceTo(o) {
    let n = o.x - this.x, t = o.y - this.y;
    return n * n + t * t;
  }
  angleWithPoint(o) {
    let n = o.x - this.x, t = o.y - this.y;
    return Math.atan2(t, n);
  }
}
const B = { class: "PathRecognizer" }, z = {
  __name: "PathRecognizer",
  props: {
    sliceCount: {
      type: Number,
      default: 8
    },
    deltaMove: {
      type: Number,
      default: 8
    },
    costMax: {
      type: Number,
      default: 32
    },
    models: {
      type: Array,
      default: () => []
    },
    onStartDraw: {
      type: Function,
      default: () => {
      }
    },
    onMovePath: {
      type: Function,
      default: () => {
      }
    },
    onStopDraw: {
      type: Function,
      default: () => {
      }
    },
    onGesture: {
      type: Function,
      default: () => {
      }
    }
  },
  emits: ["start-draw", "move-path", "stop-draw", "gesture"],
  setup(u, { expose: o, emit: n }) {
    const t = u, e = n, i = m(null), s = m([]), c = (a) => {
      i.value = a.currentTarget, s.value = [{ x: a.clientX, y: a.clientY }], window.document.addEventListener("mouseup", h), r();
    }, h = () => {
      window.document.removeEventListener("mouseup", h), l();
    }, d = (a) => {
      const f = { x: a.clientX, y: a.clientY };
      s.value = [...s.value, f], t.onMovePath && t.onMovePath(s.value), e("move-path", s.value);
    }, r = () => {
      i.value.addEventListener("mousemove", d), t.onStartDraw && t.onStartDraw(), e("start-draw");
    }, l = () => {
      i.value.removeEventListener("mousemove", d), t.onStopDraw && t.onStopDraw(), e("stop-draw"), s.value.length >= 2 ? p() : (t.onGesture && t.onGesture(null), e("gesture", null));
    }, p = () => {
      const a = new b(s.value, t.deltaMove), g = new w(
        t.sliceCount,
        t.deltaMove,
        t.costMax,
        a
      ).recognize(t.models);
      g ? (t.onGesture && t.onGesture(g.datas), e("gesture", g.datas)) : (t.onGesture && t.onGesture(null), e("gesture", null));
    };
    return o({
      handleDown: c,
      handleUp: h,
      analyze: p,
      clear: () => {
        s.value = [], i.value = null;
      },
      getCurrentPoints: () => s.value,
      moveTarget: i,
      points: s
    }), (a, f) => (y(), v("div", B, [
      P(a.$slots, "default", {
        onMouseDown: c,
        onMouseUp: h
      })
    ]));
  }
}, S = M;
export {
  S as PathRecognizerModel,
  z as default
};
