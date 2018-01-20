import {vec2, vec4, mat4} from 'gl-matrix';
import Drawable from './Drawable';
import {gl} from '../../globals';

var activeProgram: WebGLProgram = null;

export class Shader {
  shader: WebGLShader;

  constructor(type: number, source: string) {
    this.shader = gl.createShader(type);
    gl.shaderSource(this.shader, source);
    gl.compileShader(this.shader);

    if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
      throw gl.getShaderInfoLog(this.shader);
    }
  }
};

class ShaderProgram {
  prog: WebGLProgram;

  attrPos: number;
  attrNor: number;
  attrCol: number;

  unifModel: WebGLUniformLocation;
  unifModelInvTr: WebGLUniformLocation;
  unifViewProj: WebGLUniformLocation;

  unifSunPosition: WebGLUniformLocation;
  unifOceanColor: WebGLUniformLocation;
  unifShorelineColor: WebGLUniformLocation;
  unifFoliageColor: WebGLUniformLocation;
  unifMountainsColor: WebGLUniformLocation;
  unifSnowColor: WebGLUniformLocation;
  unifPolarCapsColor: WebGLUniformLocation;
  unifAtmosphereColor: WebGLUniformLocation;

  unifHeights: WebGLUniformLocation;
  unifTimeInfo : WebGLUniformLocation;
  unifCameraPos : WebGLUniformLocation;
  unifDiffuseMap: WebGLUniformLocation;

  constructor(shaders: Array<Shader>) {
    this.prog = gl.createProgram();

    for (let shader of shaders) {
      gl.attachShader(this.prog, shader.shader);
    }
    gl.linkProgram(this.prog);
    if (!gl.getProgramParameter(this.prog, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(this.prog);
    }

    this.attrPos = gl.getAttribLocation(this.prog, "vs_Pos");
    this.attrNor = gl.getAttribLocation(this.prog, "vs_Nor");
    this.attrCol = gl.getAttribLocation(this.prog, "vs_Col");
    this.unifModel      = gl.getUniformLocation(this.prog, "u_Model");
    this.unifModelInvTr = gl.getUniformLocation(this.prog, "u_ModelInvTr");
    this.unifViewProj   = gl.getUniformLocation(this.prog, "u_ViewProj");

    this.unifSunPosition = gl.getUniformLocation(this.prog, "u_SunPosition");

    this.unifOceanColor = gl.getUniformLocation(this.prog, "u_OceanColor");
    this.unifShorelineColor = gl.getUniformLocation(this.prog, "u_ShorelineColor");
    this.unifFoliageColor = gl.getUniformLocation(this.prog, "u_FoliageColor");
    this.unifMountainsColor = gl.getUniformLocation(this.prog, "u_MountainsColor");
    this.unifSnowColor = gl.getUniformLocation(this.prog, "u_SnowColor");
    this.unifPolarCapsColor = gl.getUniformLocation(this.prog, "u_PolarCapsColor");
    this.unifAtmosphereColor = gl.getUniformLocation(this.prog, "u_AtmosphereColor");
    this.unifHeights =  gl.getUniformLocation(this.prog, "u_HeightsInfo");

    this.unifTimeInfo = gl.getUniformLocation(this.prog, "u_TimeInfo");

    this.unifCameraPos = gl.getUniformLocation(this.prog, "u_CameraPos");

    this.unifDiffuseMap = gl.getUniformLocation(this.prog, "u_DiffuseMap");
  }

  use() {
    if (activeProgram !== this.prog) {
      gl.useProgram(this.prog);
      activeProgram = this.prog;
    }
  }

  setModelMatrix(model: mat4) {
    this.use();
    if (this.unifModel !== -1) {
      gl.uniformMatrix4fv(this.unifModel, false, model);
    }

    if (this.unifModelInvTr !== -1) {
      let modelinvtr: mat4 = mat4.create();
      mat4.transpose(modelinvtr, model);
      mat4.invert(modelinvtr, modelinvtr);
      gl.uniformMatrix4fv(this.unifModelInvTr, false, modelinvtr);
    }
  }

  setViewProjMatrix(vp: mat4) {
    this.use();
    if (this.unifViewProj !== -1) {
      gl.uniformMatrix4fv(this.unifViewProj, false, vp);
    }
  }

  setSunPos(pos: vec4) {
    this.use();
    if (this.unifSunPosition !== -1) {
      gl.uniform4fv(this.unifSunPosition, pos);
    }
  }

  setOceanColor(color: vec4) {
    this.use();
    if (this.unifOceanColor !== -1) {
      gl.uniform4fv(this.unifOceanColor, color);
    }
  }

  setShorelineColor(color: vec4) {
    this.use();
    if (this.unifShorelineColor !== -1) {
      gl.uniform4fv(this.unifShorelineColor, color);
    }
  }

  setFoliageColor(color: vec4) {
    this.use();
    if (this.unifFoliageColor !== -1) {
      gl.uniform4fv(this.unifFoliageColor, color);
    }
  }

  setMountainsColor(color: vec4) {
    this.use();
    if (this.unifMountainsColor !== -1) {
      gl.uniform4fv(this.unifMountainsColor, color);
    }
  }

  setSnowColor(color: vec4) {
    this.use();
    if (this.unifSnowColor !== -1) {
      gl.uniform4fv(this.unifSnowColor, color);
    }
  }

  setPolarCapsColor(color: vec4) {
    this.use();
    if (this.unifPolarCapsColor !== -1) {
      gl.uniform4fv(this.unifPolarCapsColor, color);
    }
  }


  setAtmosphereColor(color: vec4) {
    this.use();
    if (this.unifAtmosphereColor !== -1) {
      gl.uniform4fv(this.unifAtmosphereColor, color);
    }
  }

  setHeights(heights: vec4) {
    this.use();
    if (this.unifHeights !== -1) {
      gl.uniform4fv(this.unifHeights, heights);
    }
  }

  setTimeInfo(info: vec4) {
    this.use();
    if (this.unifTimeInfo !== -1) {
      gl.uniform4fv(this.unifTimeInfo, info);
    }
  }

  setCameraPos(cameraPos: vec4) {
    this.use();
    if (this.unifCameraPos !== -1) {
      gl.uniform4fv(this.unifCameraPos, cameraPos);
    }
  }

  setTexture(texture: WebGLTexture) {
      this.use();
      if (this.unifDiffuseMap !== -1) {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.uniform1i(gl.getUniformLocation(this.prog, "u_DiffuseMap"), 0);
      }
  }

  draw(d: Drawable) {
    this.use();

    if (this.attrPos != -1 && d.bindPos()) {
      gl.enableVertexAttribArray(this.attrPos);
      gl.vertexAttribPointer(this.attrPos, 4, gl.FLOAT, false, 0, 0);
    }

    if (this.attrNor != -1 && d.bindNor()) {
      gl.enableVertexAttribArray(this.attrNor);
      gl.vertexAttribPointer(this.attrNor, 4, gl.FLOAT, false, 0, 0);
    }

    d.bindIdx();
    gl.drawElements(d.drawMode(), d.elemCount(), gl.UNSIGNED_INT, 0);

    if (this.attrPos != -1) gl.disableVertexAttribArray(this.attrPos);
    if (this.attrNor != -1) gl.disableVertexAttribArray(this.attrNor);
  }
};

export default ShaderProgram;
