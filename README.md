# `hello-world-effect`

a sample custom effect for [model-viewer-effects](https://github.com/google/model-viewer/tree/master/packages/model-viewer-effects#readme)

I needed to create a custom effect for model-viewer and model-viewer-effects. I didn't find much documentation, so I'm sharing what I've learned. There are a lot of pieces. I don't claim to be an expert at any of them.

## Examples

* [Interactive sliders using an import map and CDNs](https://adamwolf.github.io/hello-world-effect/)
* [Interactive sliders with a bundle of code and dependencies](https://adamwolf.github.io/hello-world-effect/index.bundle.html)

## Building

Install the dependencies with `npm install`. You can run vite directly, or through npm script commands.

`npx vite build` builds the library for production, and saves the output into `dist/`.
`npx vite dev` starts a development server with hot reloading.

## Usage

hello-world-effect is a custom effect web component for model-viewer-effects.

Since it's JavaScript-based, there are, of course, lots of different ways to use it.

### Import Map

If we're not careful, the browser will use multiple versions of the same dependencies. To avoid this, we can use an import map.

In the <head> of your page, add

```
<script async src="https://ga.jspm.io/npm:es-module-shims@1.7.1/dist/es-module-shims.js"></script>
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js",
    "postprocessing": "https://cdn.jsdelivr.net/npm/postprocessing@6.36.4/build/index.js"
  }
}
</script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer-module.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@google/model-viewer-effects/dist/model-viewer-effects.min.js"></script>
```

Then add something that points to the `hello-world-effect.es.js file`, like 

```
<script type="module" src="./hello-world-effect.es.js"></script>
```

Now you can use the `<hello-world-effect>` tag in your HTML.

### hello-world-effect in HTML

Once you've included the `hello-world-effect.es.js` script and its dependencies, you can use `<hello-world-effect>` in your HTML.

```
<model-viewer 
        src="blender-export.glb"
        alt="A 3D model of a case for some electronic development boards.">
    <effect-composer>
        <hello-world-effect red="1.0" green="0" blue="0"></hello-world-effect>
    </effect-composer>
</model-viewer>
```

The `<hello-world-effect>` element has three attributes: `red`, `green`, and `blue`. These are numbers used to modify the color of the model. They should be 0 or greater.  If you leave the attributes blank, they default to 1.0, which doesn't change the color. (If it looks like hello-world-effect isn't working, make sure you're setting the values to something different!)

## Development

[model-viewer-effects](https://github.com/google/model-viewer/tree/master/packages/model-viewer-effects)
 uses pmndrs' [postprocessing](https://github.com/pmndrs/postprocessing) library, which uses shaders to add effects to [Three.js](https://threejs.org/).  model-viewer-effects wraps effects from postprocessing in web components, so folks can use [declarative HTML to add those effects](https://modelviewer.dev/examples/postprocessing/#setup) to [model-viewer](https://modelviewer.dev/).

To make a custom effect for model-viewer-effects, we need to create a postprocessing Effect, then wrap it in a custom element.

There isn't a lot of documentation that ties these pieces together. I mostly used the [Custom Effects](https://github.com/pmndrs/postprocessing/wiki/Custom-Effects/) page on the postprocessing wiki, the source of [model-viewer-effects source](https://github.com/google/model-viewer/tree/master/packages/model-viewer-effects) (particularly [EffectComposer](https://github.com/google/model-viewer/blob/master/packages/model-viewer-effects/src/effect-composer.ts) and the [built-in effects](https://github.com/google/model-viewer/tree/master/packages/model-viewer-effects/src/effects)) and the source of [postprocessing](https://github.com/pmndrs/postprocessing). I also used the [Khronos OpenGL wiki](https://www.khronos.org/opengl/wiki/) and Mozilla's [WebGL reference](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) for help figuring out shaders.

`HelloWorldEffect` extends `Effect` from postprocessing. In hello-world-effect, the shader is in the `fragmentShader` string, but the [Custom Effects](https://github.com/pmndrs/postprocessing/wiki/Custom-Effects/) wiki page shows how to store the shader in its own file.

`HelloWorldEffectElement` is the custom element that interfaces between the DOM/HTML and EffectComposer inside model-viewer-effects. The custom element needs to have an `effects` property with a list of its postprocessing Effects.  When the custom element is initializing, it should confirm its parent node is a model-viewer-effects EffectComposer. It should call the EffectComposer's `updateEffects()` method when the element is connected or disconnected. If the custom element changes, it can tell the EffectComposer to render a new frame using `queueRender()`.  There are some other properties that model-viewer-effects can use, like `disabled` or `requireSeparatePass`. Currently, the best documentation is the source.

### Resources

* [Custom Effects](https://github.com/pmndrs/postprocessing/wiki/Custom-Effects/) on the postprocessing wiki
* [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
* [model-viewer-effects source](https://github.com/google/model-viewer/tree/master/packages/model-viewer-effects)
  * [EffectComposer](https://github.com/google/model-viewer/blob/master/packages/model-viewer-effects/src/effect-composer.ts)
  * [built-in effects](https://github.com/google/model-viewer/tree/master/packages/model-viewer-effects/src/effects)
* [model-viewer-effects examples and docs](https://modelviewer.dev/examples/postprocessing/)
* [postprocessing](https://github.com/pmndrs/postprocessing)
* [Khronos OpenGL wiki](https://www.khronos.org/opengl/wiki/)
* Mozilla's [WebGL reference](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

### Bundling

Instead of import maps, another option is to bundle all the dependencies together.

There are lots of ways to do this. I did it with [Vite](https://vite.dev/), with the config in `vite.bundle.config.js`. 
You can build the bundle with `npx vite build --config vite.bundle.config.js`.

To visualize what's all included, you can use `@rollup/plugin-bundle-analyzer`.

To do this, run

```
npm install --save-dev @rollup/plugin-bundle-analyzer
```

and then adding 

```
import bundleAnalyzer from '@rollup/plugin-bundle-analyzer';
```
to the top of the appropriate vite config and 

```
rollupOptions: {
  plugins: [
    visualizer({ 
      filename: 'bundle-analysis.html',
    })
  ]
}
```
to the body of the config. If any of those are already there, you'll have to merge them.

When you run `npx vite build`, Vite will generate `bundle-analysis.html` file that you can open in your browser to see a visualization of the bundle contents.
