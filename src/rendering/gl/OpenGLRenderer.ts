import {mat4, vec2, vec4} from 'gl-matrix';
import Drawable from './Drawable';
import Camera from '../../Camera';
import {gl} from '../../globals';
import ShaderProgram from './ShaderProgram';

// In this file, `gl` is accessible because it is imported above
class OpenGLRenderer {
  constructor(public canvas: HTMLCanvasElement) {
  }

  setClearColor(r: number, g: number, b: number, a: number) {
    gl.clearColor(r, g, b, a);
  }

  setSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
  renderBackground(camera: Camera, prog: ShaderProgram, drawables: Array<Drawable>,
  
    cameraPosParam: vec4,
    screenSizeParam: vec4,
    AtmosphereParam: vec4,

    timeInfo: vec4
  )
  {
    let viewProj = mat4.create();
    let AtmosphereColor = vec4.fromValues(AtmosphereParam[0] / 255, AtmosphereParam[1] / 255, AtmosphereParam[2] / 255, AtmosphereParam[3]);

    mat4.multiply(viewProj, camera.projectionMatrix, camera.viewMatrix);

    prog.setViewProjMatrix(viewProj);
    prog.setCameraPos(cameraPosParam);
    prog.setOceanColor(screenSizeParam);
    prog.setAtmosphereColor(AtmosphereColor);
    prog.setTimeInfo(timeInfo);

    for (let drawable of drawables)
    {
      prog.setTexture(drawable.diffuseMap);
      prog.setModelMatrix(drawable.modelMat);
      prog.draw(drawable);
    }

  }

  render(camera: Camera, prog: ShaderProgram, drawables: Array<Drawable>,
    sunPosParam: vec4,

    oceanColorParam: vec4,
    shorelineParam: vec4,
    foliageParam: vec4,
    mountainsParam: vec4,
    snowParam: vec4,
    polarCapsParam: vec4,
    AtmosphereParam: vec4,

    heightsParam: vec4,
    
    timeInfo: vec4,

    cameraPosParam: vec4
  )
  {    
    let viewProj = mat4.create();
    let sunPos = vec4.fromValues(sunPosParam[0], sunPosParam[1], sunPosParam[2], sunPosParam[3]);
    let oceanColor = vec4.fromValues(oceanColorParam[0] / 255, oceanColorParam[1] / 255, oceanColorParam[2] / 255, oceanColorParam[3]);
    let shorelineColor = vec4.fromValues(shorelineParam[0] / 255, shorelineParam[1] / 255, shorelineParam[2] / 255, shorelineParam[3]);
    let foliageColor = vec4.fromValues(foliageParam[0] / 255, foliageParam[1] / 255, foliageParam[2] / 255, foliageParam[3]);
    let mountainsColor = vec4.fromValues(mountainsParam[0] / 255, mountainsParam[1] / 255, mountainsParam[2] / 255, mountainsParam[3]);
    let snowColor = vec4.fromValues(snowParam[0] / 255, snowParam[1] / 255, snowParam[2] / 255, snowParam[3]);
    let polarCapsColor = vec4.fromValues(polarCapsParam[0] / 255, polarCapsParam[1] / 255, polarCapsParam[2] / 255, polarCapsParam[3]);
    let AtmosphereColor = vec4.fromValues(AtmosphereParam[0] / 255, AtmosphereParam[1] / 255, AtmosphereParam[2] / 255, AtmosphereParam[3]);
   
    mat4.multiply(viewProj, camera.projectionMatrix, camera.viewMatrix);

    prog.setViewProjMatrix(viewProj);

    prog.setSunPos(sunPos);

    prog.setOceanColor(oceanColor);
    prog.setShorelineColor(shorelineColor);
    prog.setFoliageColor(foliageColor);
    prog.setMountainsColor(mountainsColor);
    prog.setSnowColor(snowColor);
    prog.setPolarCapsColor(polarCapsColor);
    prog.setAtmosphereColor(AtmosphereColor);

    prog.setHeights(heightsParam);

    prog.setTimeInfo(timeInfo);

    prog.setCameraPos(cameraPosParam);

    for (let drawable of drawables) {
      prog.setTexture(drawable.diffuseMap);
      prog.setModelMatrix(drawable.modelMat);
      prog.draw(drawable);
    }
  }
};

export default OpenGLRenderer;
