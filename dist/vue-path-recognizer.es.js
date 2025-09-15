import { ref as b, openBlock as R, createElementBlock as S, renderSlot as T } from "vue";
const E = (d, p) => {
  const f = d.__vccOpts || d;
  for (const [r, h] of p)
    f[r] = h;
  return f;
}, F = { class: "PathRecognizer" }, G = {
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
  setup(d, { expose: p, emit: f }) {
    const r = d, h = f, g = b(null), c = b([]), x = (a) => {
      g.value = a.currentTarget, c.value = [{ x: a.clientX, y: a.clientY }], window.document.addEventListener("mouseup", m), I();
    }, m = () => {
      window.document.removeEventListener("mouseup", m), D();
    }, y = (a) => {
      const t = { x: a.clientX, y: a.clientY };
      c.value = [...c.value, t], r.onMovePath && r.onMovePath(c.value), h("move-path", c.value);
    }, I = () => {
      g.value.addEventListener("mousemove", y), r.onStartDraw && r.onStartDraw(), h("start-draw");
    }, D = () => {
      g.value.removeEventListener("mousemove", y), r.onStopDraw && r.onStopDraw(), h("stop-draw"), c.value.length >= 2 ? P() : (r.onGesture && r.onGesture(null), h("gesture", null));
    }, P = () => {
      const a = new C(c.value, r.deltaMove), e = new z(r.sliceCount, r.deltaMove, r.costMax, a).recognize(r.models);
      e ? (r.onGesture && r.onGesture(e.datas), h("gesture", e.datas)) : (r.onGesture && r.onGesture(null), h("gesture", null));
    };
    p({
      handleDown: x,
      handleUp: m,
      analyze: P,
      clear: () => {
        c.value = [], g.value = null;
      },
      getCurrentPoints: () => c.value,
      moveTarget: g,
      points: c
    });
    class z {
      constructor(t, e, o, n) {
        this.sliceCount = t, this.deltMove = e, this.costMax = o, this.path = n, this.directions = this.computeDirections();
      }
      recognize(t) {
        let e = Number.POSITIVE_INFINITY, o = null;
        for (let n of t) {
          let s = this.costLeven(n.directions, this.directions);
          if (n.filter !== null) {
            let i = new B(this.path.deltaPoints, this.path.boundingBox, this.directions, s);
            s = n.filter(i, n);
          }
          s < this.costMax && s < e && (e = s, o = n);
        }
        return o;
      }
      directionCost(t, e) {
        let o = Math.abs(t - e);
        return o > this.sliceCount / 2 && (o = this.sliceCount - o), o;
      }
      create2dArray(t, e, o) {
        let n = [];
        for (let s = 0; s < t; s++) {
          n.push([]);
          for (let i = 0; i < e; i++)
            n[s].push(o);
        }
        return n;
      }
      costLeven(t, e) {
        let o = this.create2dArray(t.length + 1, e.length + 1, 0), n = this.create2dArray(t.length + 1, e.length + 1, 0), s = Number.POSITIVE_INFINITY;
        for (let l = 1; l <= t.length; l++)
          for (let u = 1; u < e.length; u++)
            o[l][u] = this.directionCost(t[l - 1], e[u - 1]);
        for (let l = 1; l <= e.length; l++)
          n[0][l] = s;
        for (let l = 1; l <= t.length; l++)
          n[l][0] = s;
        n[0][0] = 0;
        let i = 0, v, _, M;
        for (let l = 1; l <= t.length; l++)
          for (let u = 1; u < e.length; u++)
            i = o[l][u], v = n[l - 1][u] + i, _ = n[l][u - 1] + i, M = n[l - 1][u - 1] + i, n[l][u] = Math.min(Math.min(v, _), M);
        return n[t.length][e.length - 1];
      }
      computeDirections() {
        let t = this.path.deltaPoints;
        if (t.count < 2)
          return [];
        let e = [], o = Math.PI * 2 / this.sliceCount;
        for (let n = 0; n < t.length - 1; n++) {
          let s = t[n].angleWithPoint(t[n + 1]);
          if (s < 0 && (s += Math.PI * 2), s < o / 2 || s > Math.PI * 2 - o)
            e.push(0);
          else {
            let i = Math.round(s / o);
            e.push(i);
          }
        }
        return e;
      }
    }
    class B {
      constructor(t, e, o, n) {
        this.deltaPoints = t, this.boundingBox = e, this.directions = o, this.cost = n;
      }
    }
    class C {
      constructor(t, e) {
        this.points = [];
        let o = Number.POSITIVE_INFINITY;
        this.boundingBox = new N(o, o, -o, -o);
        let n = new w(t[0].x, t[0].y), s = null;
        this.deltaPoints = [n];
        for (let i of t)
          s = new w(i.x, i.y), this.points.push(s), i.x < this.boundingBox.left && (this.boundingBox.left = i.x), i.x > this.boundingBox.right && (this.boundingBox.right = i.x), i.y < this.boundingBox.top && (this.boundingBox.top = i.y), i.y > this.boundingBox.bottom && (this.boundingBox.bottom = i.y), n.squareDistanceTo(s) >= e * e && (this.deltaPoints.push(s), n = s);
        n !== s && this.deltaPoints.push(s);
      }
      get count() {
        return this.points.length;
      }
    }
    class N {
      constructor(t = 0, e = 0, o = 0, n = 0) {
        this.top = t, this.left = e, this.bottom = o, this.right = n;
      }
      get height() {
        return this.bottom - this.top;
      }
      get width() {
        return this.right - this.left;
      }
    }
    class w {
      constructor(t, e) {
        this.x = t, this.y = e;
      }
      squareDistanceTo(t) {
        let e = t.x - this.x, o = t.y - this.y;
        return e * e + o * o;
      }
      angleWithPoint(t) {
        let e = t.x - this.x, o = t.y - this.y;
        return Math.atan2(o, e);
      }
    }
    return (a, t) => (R(), S("div", F, [
      T(a.$slots, "default", {
        onMouseDown: x,
        onMouseUp: m
      }, void 0, !0)
    ]));
  }
}, L = /* @__PURE__ */ E(G, [["__scopeId", "data-v-0bfdb856"]]);
class A {
  constructor(p, f, r = null) {
    this.directions = p, this.datas = f, this.filter = r;
  }
}
const k = A, V = (d) => {
  d.component("PathRecognizer", L);
};
typeof window < "u" && window.Vue && V(window.Vue);
export {
  k as PathRecognizerModel,
  A as PathRecognizerModels,
  L as default,
  V as install
};
