
import { Effect, BlendFunction } from "postprocessing";
import { Uniform, Vector3 } from "three";

class HelloWorldEffect extends Effect {
  constructor({
    blendFunction = BlendFunction.NORMAL,
    weights = new Vector3(1.0, 1.0, 1.0),
} = {}) {

    const fragmentShader = `
      uniform vec3 weights;
        
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor){
        outputColor = vec4(inputColor.rgb * weights, inputColor.a);      
      }
`;

    super("HelloWorldEffect", fragmentShader, {
      blendFunction,
      uniforms: new Map([
        ["weights", new Uniform(weights)],
      ]),
    });
  }

  updateWeights(r, g, b) {
    // Set the weights uniform to the three components passed in
    this.uniforms.get("weights").value.set(r, g, b);
  }

}

class HelloWorldEffectElement extends HTMLElement {
  static get observedAttributes() {
    return ['red', 'green', 'blue'];
  }

  constructor() {
    super();
    // model-viewer-effects looks at the effects property of any child elements
    // and expects a list of postprocressing Effects
    this.effects = [ new HelloWorldEffect() ] ;
  }

  connectedCallback() {
    super.connectedCallback && super.connectedCallback();

    if (this.parentNode?.nodeName.toLowerCase() === "effect-composer") {
      this.effectComposer = this.parentNode;
    }

    if (!this.effectComposer) {
      throw new Error(
        "<hello-world-effect> must be a child of an <effect-composer>.",
      );
    }

    this.updateWeights();
    // We poke the EffectComposer that there have been changes, and it needs to
    // rebuild its EffectPasses
    this.effectComposer.updateEffects();
  }

  disconnectedCallback() {
    // When we are removed from the DOM, we need to clean up.
    super.disconnectedCallback && super.disconnectedCallback();
    for (const effect of this.effects) {
      effect.dispose();
    }
    this.effectComposer?.updateEffects();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateWeights();
    // After updating the weights, we need to tell the EffectComposer that it needs a new frame
    this.effectComposer?.queueRender();
  }

  updateWeights() {
    // We interact with the shader in our Effect through a three-component vector uniform called "weights"
    // This element maps a red, green, and blue html attribute to the components of this vector.

    let weights = [];
    const attrs = ['red', 'green', 'blue'];

    for (const attr of attrs) {
      if (!this.hasAttribute(attr)) {
        weights.push(1.0); // if the attribute is not set, we want to ignore that channel, so we set the weight to 1
      } else {
        const value = parseFloat(this.getAttribute(attr));
        if (isNaN(value)) {
          throw new Error(`${attr} must be a number`);
        }
        weights.push(Math.max(0, value)); // set to 0 if negative
      }
    }

    this.effects[0].updateWeights(...weights);
  }
}

customElements.define('hello-world-effect', HelloWorldEffectElement);

export default HelloWorldEffectElement;