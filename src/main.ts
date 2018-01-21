import {vec2, vec3, vec4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Icosphere from './geometry/Icosphere';
import Cube from './geometry/Cube';
import Square from './geometry/Square';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';



// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  tesselations: 9,
  'Load Scene': loadNoisyPlanet, // A function pointer, essentially
  x: 0.06,
  y: 0.54,
  z: 0.6,
  Oceans: [38, 152, 232, 1.0],
  OceanHeight: 1.0,
  Shoreline: [233, 200, 143, 1.0],
  ShoreHeight: 0.02,
  Foliage: [11, 143, 11, 1.0],  
  Steeps: [62, 35, 3, 1.0],
  Snow: [255, 255, 255, 1.0],
  SnowHeight: 1.10,
  PolarCaps: [155, 214, 236, 1.0],
  PolarCapsAttitude: 1.1,
  Atmosphere: [64, 88, 172, 1.0],
  Shader: 2,
  Noise4D: 0, 
  TerrainExp: 0.35,
  TerrainSeed: 0.0,
  Time: 1,
  EnvironmentMap : 1,

};

let backScreenQaud: Square;
let noisyPlanet: Icosphere;

let time: number;
let oldTime : number;
let startTime : number;
let currentTime : number;

function rotatePlanet(planet: Icosphere, speed: number)
{
    let seed: number;
    seed = speed * time;

    planet.updateRotY(seed);
    planet.updateModelMat();
}

function loadNoisyPlanet()
{
    noisyPlanet = new Icosphere(vec3.fromValues(0, 0, 0), 1.0, controls.tesselations);
    noisyPlanet.create();
    noisyPlanet.bindTexture("src/textures/envMap2.jpg");

    backScreenQaud = new Square(vec3.fromValues(0, 0, 0));
    backScreenQaud.create();
}

function main() {
  // Initial display for framerate

  time = 0.0; 
  oldTime = startTime = Date.now();

  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'tesselations', 0, 20).step(1);
  gui.add(controls, 'Load Scene');

  var sunPos = gui.addFolder('SunDirection');
  sunPos.add(controls, 'x', -1.0, 1.0).step(0.01);
  sunPos.add(controls, 'y', -1.0, 1.0).step(0.01);
  sunPos.add(controls, 'z', -1.0, 1.0).step(0.01);

  //sunPos.open();

  var colors = gui.addFolder('Colors');
  colors.addColor(controls, 'Oceans');
  colors.addColor(controls, 'Shoreline');
  colors.addColor(controls, 'Foliage');
  colors.addColor(controls, 'Steeps');
  colors.addColor(controls, 'Snow');
  colors.addColor(controls, 'PolarCaps');
  colors.addColor(controls, 'Atmosphere');

  //colors.open();

  var terrain = gui.addFolder('Terrain'); 

  terrain.add(controls, 'OceanHeight', 0.0, 1.50).step(0.01);
  terrain.add(controls, 'ShoreHeight', 0.0, 0.04).step(0.01);
  terrain.add(controls, 'SnowHeight', 0.0, 2.00).step(0.01);
  terrain.add(controls, 'PolarCapsAttitude', 0.0, 3.0).step(0.01);
  terrain.add(controls, 'TerrainExp', 0.0, 1.0).step(0.01);
  terrain.add(controls, 'TerrainSeed', 0.0, 100.0).step(1.0);

  gui.add(controls, 'Time', { Pause: 0, Play: 1 });
  gui.add(controls, 'EnvironmentMap', { Off: 0, On: 1 });

  gui.add(controls, 'Noise4D', { Off: 0, On: 1 });

  gui.add(controls, 'Shader', { Lambertian: 0, Blinn_phong: 1, Physically_based: 2 });
  
  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  gl.enable(gl.DEPTH_TEST);

  const camera = new Camera(vec3.fromValues(0, 0, 6.0), vec3.fromValues(0, 0, 0));
  const renderer = new OpenGLRenderer(canvas);
 
  
  let planetShader: ShaderProgram;
  let spaceShader: ShaderProgram;

  planetShader = new ShaderProgram([
      new Shader(gl.VERTEX_SHADER, require('./shaders/noisePlanet-vert.glsl')),
      new Shader(gl.FRAGMENT_SHADER, require('./shaders/noisePlanet-frag.glsl')),]);

  spaceShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/backGround-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/backGround-frag.glsl')),]);

  loadNoisyPlanet();

  renderer.setClearColor(0.0, 0.0, 0.0, 1);

  
  // This function will be called every frame
  function tick()
  {
    currentTime = Date.now();

    if(controls.Time > 0.0)
    {
      time += (currentTime - oldTime) * 0.06;
    }

    oldTime = currentTime;
    camera.update();
    
    rotatePlanet(noisyPlanet, 0.0005);

    stats.begin();
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();

    renderer.renderBackground(camera, spaceShader,
      [backScreenQaud,],    
      vec4.fromValues( camera.position[0], camera.position[1], camera.position[2], camera.up[0] ),  
      vec4.fromValues( window.innerWidth, window.innerHeight, camera.up[1], camera.up[2]),
      vec4.fromValues( controls.Atmosphere[0], controls.Atmosphere[1], controls.Atmosphere[2], controls.Atmosphere[3]), 
      vec4.fromValues(time, controls.Noise4D, controls.TerrainExp, controls.TerrainSeed * 39.0),
    );

    renderer.render(camera, planetShader,
        [noisyPlanet,],

        vec4.fromValues(controls.x, controls.y, controls.z, controls.Shader),
        vec4.fromValues(controls.Oceans[0], controls.Oceans[1], controls.Oceans[2], controls.Oceans[3]),
        vec4.fromValues(controls.Shoreline[0], controls.Shoreline[1], controls.Shoreline[2], controls.Shoreline[3]),
        vec4.fromValues(controls.Foliage[0], controls.Foliage[1], controls.Foliage[2], controls.Foliage[3]),
        vec4.fromValues(controls.Steeps[0], controls.Steeps[1], controls.Steeps[2], controls.Steeps[3]),
        vec4.fromValues(controls.Snow[0], controls.Snow[1], controls.Snow[2], controls.Snow[3]),
        vec4.fromValues(controls.PolarCaps[0], controls.PolarCaps[1], controls.PolarCaps[2], controls.PolarCaps[3]),
        vec4.fromValues(controls.Atmosphere[0], controls.Atmosphere[1], controls.Atmosphere[2], controls.Atmosphere[3]),            
        vec4.fromValues(controls.OceanHeight, controls.ShoreHeight, controls.SnowHeight, controls.PolarCapsAttitude),
        vec4.fromValues(time, controls.Noise4D, controls.TerrainExp, controls.TerrainSeed * 39.0),
        vec4.fromValues(camera.position[0], camera.position[1], camera.position[2], controls.EnvironmentMap),          
    );

    stats.end();
    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();

  // Start the render loop


  tick();
}

main();
