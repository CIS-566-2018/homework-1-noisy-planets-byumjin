import {mat4, vec3, vec4} from 'gl-matrix';
import {gl} from '../../globals';

abstract class Drawable {
  count: number = 0;

  bufIdx: WebGLBuffer;
  bufPos: WebGLBuffer;
  bufNor: WebGLBuffer;

  idxBound: boolean = false;
  posBound: boolean = false;
  norBound: boolean = false;

  diffuseMap: WebGLTexture;
  diffuseMapBound: boolean = false;

  modelMat: mat4 = mat4.create();
  transMat: mat4 = mat4.create();
  rotMat: mat4 = mat4.create();
  scaleMat: mat4 = mat4.create();


  abstract create() : void;

  updatePos(deltaPos:vec3)
  {
    mat4.translate(this.modelMat, this.modelMat, deltaPos);
  }

  updateNewPos(absPos:vec3)
  {
    let tranMat = mat4.create();
    mat4.translate(this.transMat, tranMat, absPos);
  }

  updateScale(newScale:vec3)
  {
    let sMat = mat4.create();
    mat4.scale(this.scaleMat, sMat, newScale);
  }

  updateRotY(rad:number)
  {
    let rotMat = mat4.create();
    mat4.rotateY(this.rotMat, rotMat, rad);
  }
  
  updateModelMat()
  {
    let sr = mat4.create();
    mat4.multiply(sr, this.scaleMat, this.transMat );
    mat4.multiply(this.modelMat, sr, this.rotMat );
  }

  

  destory() {
    gl.deleteBuffer(this.bufIdx);
    gl.deleteBuffer(this.bufPos);
    gl.deleteBuffer(this.bufNor);

    gl.deleteTexture(this.diffuseMap);
  }

  generateIdx() {
    this.idxBound = true;
    this.bufIdx = gl.createBuffer();
  }

  generatePos() {
    this.posBound = true;
    this.bufPos = gl.createBuffer();
  }

  generateNor() {
    this.norBound = true;
    this.bufNor = gl.createBuffer();
  }

  generateTexture() {
    this.diffuseMapBound = true;
  }

  bindIdx(): boolean {
    if (this.idxBound) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    }
    return this.idxBound;
  }

  bindPos(): boolean {
    if (this.posBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    }
    return this.posBound;
  }

  bindNor(): boolean {
    if (this.norBound) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    }
    return this.norBound;
  }

  bindTexture(url:string)
  {   
    const texture = gl.createTexture();

    const image = new Image();
    image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    //gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.activeTexture(gl.TEXTURE0);
    }

    image.src = url;

    this.diffuseMap = texture;
  }

  elemCount(): number {
    return this.count;
  }

  drawMode(): GLenum {
    return gl.TRIANGLES;
  }
};

export default Drawable;
