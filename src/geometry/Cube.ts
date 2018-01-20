import {vec3, vec4, mat4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Cube extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  center: vec4;

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
  }

  create() {

  mat4.identity(this.modelMat);

  this.indices = new Uint32Array([0, 1, 2,
                                  1, 3, 2,
                                  4, 5, 6,
                                  5, 7, 6,
                                  8, 9, 10,
                                  9, 11, 10,
                                  12, 13, 14,
                                  13, 15, 14,
                                  16, 17, 18,
                                  17, 19, 18,
                                  20, 21, 22,
                                  21, 23, 22
                                  ]);
  this.normals = new Float32Array([0, 0, 1, 0,
                                   0, 0, 1, 0,
                                   0, 0, 1, 0,
                                   0, 0, 1, 0,
                                  
                                   1, 0, 0, 0,
                                   1, 0, 0, 0,
                                   1, 0, 0, 0,
                                   1, 0, 0, 0,

                                   0, 0, -1, 0,
                                   0, 0, -1, 0,
                                   0, 0, -1, 0,
                                   0, 0, -1, 0,

                                   -1, 0, 0, 0,
                                   -1, 0, 0, 0,
                                   -1, 0, 0, 0,
                                   -1, 0, 0, 0,

                                   0, 1, 0, 0,
                                   0, 1, 0, 0,
                                   0, 1, 0, 0,
                                   0, 1, 0, 0,

                                   0, -1, 0, 0,
                                   0, -1, 0, 0,
                                   0, -1, 0, 0,
                                   0, -1, 0, 0
                                  ]);

  this.positions = new Float32Array([-1, 1, 1, 1,
                                     -1, -1, 1, 1,
                                     1, 1, 1, 1,
                                     1, -1, 1, 1,

                                     1, 1, 1, 1,
                                     1, -1, 1, 1,
                                     1, 1, -1, 1,
                                     1, -1, -1, 1,

                                     1, 1, -1, 1,
                                     1, -1, -1, 1,
                                     -1, 1, -1, 1,
                                     -1, -1, -1, 1,

                                     -1, 1, -1, 1,
                                     -1, -1, -1, 1,
                                     -1, 1, 1, 1,
                                     -1, -1, 1, 1,

                                     -1, 1, -1, 1,
                                     -1, 1, 1, 1,
                                     1, 1, -1, 1,
                                     1, 1, 1, 1,

                                     -1, -1, 1, 1,
                                     -1, -1, -1, 1,
                                     1, -1, 1, 1,
                                     1, -1, -1, 1
                                    ]);

    this.generateIdx();
    this.generatePos();
    this.generateNor();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created square`);
  }
};

export default Cube;
