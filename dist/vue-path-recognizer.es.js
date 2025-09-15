import { ref as m, openBlock as x, createElementBlock as y, renderSlot as P } from "vue";
class w {
  constructor(n, o, t = null) {
    this.directions = n, this.datas = o, this.filter = t;
  }
}
class _ {
  constructor(n, o, t, e) {
    this.sliceCount = n, this.deltMove = o, this.costMax = t, this.path = e, this.directions = this.computeDirections();
  }
  recognize(n) {
    let o = Number.POSITIVE_INFINITY, t = null;
    for (let e of n) {
      let i = this.costLeven(e.directions, this.directions);
      if (e.filter !== null) {
        let s = new M(
          this.path.deltaPoints,
          this.path.boundingBox,
          this.directions,
          i
        );
        i = e.filter(s, e);
      }
      i < this.costMax && i < o && (o = i, t = e);
    }
    return t;
  }
  directionCost(n, o) {
    let t = Math.abs(n - o);
    return t > this.sliceCount / 2 && (t = this.sliceCount - t), t;
  }
  create2dArray(n, o, t) {
    let e = [];
    for (let i = 0; i < n; i++) {
      e.push([]);
      for (let s = 0; s < o; s++)
        e[i].push(t);
    }
    return e;
  }
  costLeven(n, o) {
    let t = this.create2dArray(n.length + 1, o.length + 1, 0), e = this.create2dArray(n.length + 1, o.length + 1, 0), i = Number.POSITIVE_INFINITY;
    for (let r = 1; r <= n.length; r++)
      for (let l = 1; l < o.length; l++)
        t[r][l] = this.directionCost(n[r - 1], o[l - 1]);
    for (let r = 1; r <= o.length; r++)
      e[0][r] = i;
    for (let r = 1; r <= n.length; r++)
      e[r][0] = i;
    e[0][0] = 0;
    let s = 0, h, c, d;
    for (let r = 1; r <= n.length; r++)
      for (let l = 1; l < o.length; l++)
        s = t[r][l], h = e[r - 1][l] + s, c = e[r][l - 1] + s, d = e[r - 1][l - 1] + s, e[r][l] = Math.min(Math.min(h, c), d);
    return e[n.length][o.length - 1];
  }
  computeDirections() {
    let n = this.path.deltaPoints;
    if (n.count < 2)
      return [];
    let o = [], t = Math.PI * 2 / this.sliceCount;
    for (let e = 0; e < n.length - 1; e++) {
      let i = n[e].angleWithPoint(n[e + 1]);
      if (i < 0 && (i += Math.PI * 2), i < t / 2 || i > Math.PI * 2 - t)
        o.push(0);
      else {
        let s = Math.round(i / t);
        o.push(s);
      }
    }
    return o;
  }
}
class M {
  constructor(n, o, t, e) {
    this.deltaPoints = n, this.boundingBox = o, this.directions = t, this.cost = e;
  }
}
class b {
  constructor(n, o) {
    this.points = [];
    let t = Number.POSITIVE_INFINITY;
    this.boundingBox = new I(t, t, -t, -t);
    let e = new v(n[0].x, n[0].y), i = null;
    this.deltaPoints = [e];
    for (let s of n)
      i = new v(s.x, s.y), this.points.push(i), s.x < this.boundingBox.left && (this.boundingBox.left = s.x), s.x > this.boundingBox.right && (this.boundingBox.right = s.x), s.y < this.boundingBox.top && (this.boundingBox.top = s.y), s.y > this.boundingBox.bottom && (this.boundingBox.bottom = s.y), e.squareDistanceTo(i) >= o * o && (this.deltaPoints.push(i), e = i);
    e !== i && this.deltaPoints.push(i);
  }
  get count() {
    return this.points.length;
  }
}
class I {
  constructor(n = 0, o = 0, t = 0, e = 0) {
    this.top = n, this.left = o, this.bottom = t, this.right = e;
  }
  get height() {
    return this.bottom - this.top;
  }
  get width() {
    return this.right - this.left;
  }
}
class v {
  constructor(n, o) {
    this.x = n, this.y = o;
  }
  squareDistanceTo(n) {
    let o = n.x - this.x, t = n.y - this.y;
    return o * o + t * t;
  }
  angleWithPoint(n) {
    let o = n.x - this.x, t = n.y - this.y;
    return Math.atan2(t, o);
  }
}
const D = (a, n) => {
  const o = a.__vccOpts || a;
  for (const [t, e] of n)
    o[t] = e;
  return o;
}, z = { class: "PathRecognizer" }, B = {
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
  setup(a, { expose: n, emit: o }) {
    const t = a, e = o, i = m(null), s = m([]), h = (u) => {
      i.value = u.currentTarget, s.value = [{ x: u.clientX, y: u.clientY }], window.document.addEventListener("mouseup", c), r();
    }, c = () => {
      window.document.removeEventListener("mouseup", c), l();
    }, d = (u) => {
      const f = { x: u.clientX, y: u.clientY };
      s.value = [...s.value, f], t.onMovePath && t.onMovePath(s.value), e("move-path", s.value);
    }, r = () => {
      i.value.addEventListener("mousemove", d), t.onStartDraw && t.onStartDraw(), e("start-draw");
    }, l = () => {
      i.value.removeEventListener("mousemove", d), t.onStopDraw && t.onStopDraw(), e("stop-draw"), s.value.length >= 2 ? g() : (t.onGesture && t.onGesture(null), e("gesture", null));
    }, g = () => {
      const u = new b(s.value, t.deltaMove), p = new _(
        t.sliceCount,
        t.deltaMove,
        t.costMax,
        u
      ).recognize(t.models);
      p ? (t.onGesture && t.onGesture(p.datas), e("gesture", p.datas)) : (t.onGesture && t.onGesture(null), e("gesture", null));
    };
    return n({
      handleDown: h,
      handleUp: c,
      analyze: g,
      clear: () => {
        s.value = [], i.value = null;
      },
      getCurrentPoints: () => s.value,
      moveTarget: i,
      points: s
    }), (u, f) => (x(), y("div", z, [
      P(u.$slots, "default", {
        onMouseDown: h,
        onMouseUp: c
      }, void 0, !0)
    ]));
  }
}, C = /* @__PURE__ */ D(B, [["__scopeId", "data-v-1533d3cb"]]), E = w, N = (a) => {
  a.component("PathRecognizer", C);
};
typeof window < "u" && window.Vue && N(window.Vue);
export {
  b as Path,
  M as PathInfos,
  v as PathPoint,
  _ as PathRecognizerCore,
  E as PathRecognizerModel,
  w as PathRecognizerModels,
  I as PathRect,
  C as default,
  N as install
};
