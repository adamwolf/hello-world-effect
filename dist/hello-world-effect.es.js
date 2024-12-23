import { Effect as c, BlendFunction as n } from "postprocessing";
import { Uniform as f, Vector3 as a } from "three";
class i extends c {
  constructor({
    blendFunction: e = n.NORMAL,
    weights: t = new a(1, 1, 1)
  } = {}) {
    super("HelloWorldEffect", `
      uniform vec3 weights;
        
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){
        outputColor = vec4(inputColor.rgb * weights, inputColor.a);      
      }
`, {
      blendFunction: e,
      uniforms: /* @__PURE__ */ new Map([
        ["weights", new f(t)]
      ])
    });
  }
  updateWeights(e, t, o) {
    this.uniforms.get("weights").value.set(e, t, o);
  }
}
class l extends HTMLElement {
  static get observedAttributes() {
    return ["red", "green", "blue"];
  }
  constructor() {
    super(), this.effects = [new i()];
  }
  connectedCallback() {
    var e;
    if (super.connectedCallback && super.connectedCallback(), ((e = this.parentNode) == null ? void 0 : e.nodeName.toLowerCase()) === "effect-composer" && (this.effectComposer = this.parentNode), !this.effectComposer)
      throw new Error(
        "<hello-world-effect> must be a child of an <effect-composer>."
      );
    this.updateWeights(), this.effectComposer.updateEffects();
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback && super.disconnectedCallback();
    for (const t of this.effects)
      t.dispose();
    (e = this.effectComposer) == null || e.updateEffects();
  }
  attributeChangedCallback(e, t, o) {
    var s;
    this.updateWeights(), (s = this.effectComposer) == null || s.queueRender();
  }
  updateWeights() {
    let e = [];
    const t = ["red", "green", "blue"];
    for (const o of t)
      if (!this.hasAttribute(o))
        e.push(1);
      else {
        const s = parseFloat(this.getAttribute(o));
        if (isNaN(s))
          throw new Error(`${o} must be a number`);
        e.push(Math.max(0, s));
      }
    this.effects[0].updateWeights(...e);
  }
}
customElements.define("hello-world-effect", l);
export {
  l as default
};
//# sourceMappingURL=hello-world-effect.es.js.map
