#version 300 es

//This is a vertex shader. While it is called a "shader" due to outdated conventions, this file
//is used to apply matrix transformations to the arrays of vertex data passed to it.
//Since this code is run on your GPU, each vertex is transformed simultaneously.
//If it were run on your CPU, each vertex would have to be processed in a FOR loop, one at a time.
//This simultaneous transformation allows your program to run much faster, especially when rendering
//geometry with millions of vertices.

uniform mat4 u_Model;       // The matrix that defines the transformation of the
                            // object we're rendering. In this assignment,
                            // this will be the result of traversing your scene graph.

uniform mat4 u_ModelInvTr;  // The inverse transpose of the model matrix.
                            // This allows us to transform the object's normals properly
                            // if the object has been non-uniformly scaled.

uniform mat4 u_ViewProj;    // The matrix that defines the camera's transformation.
                            // We've written a static matrix for you to use for HW2,
                            // but in HW3 you'll have to generate one yourself

uniform vec4 u_TimeInfo;

in vec4 vs_Pos;             // The array of vertex positions passed to the shader
in vec4 vs_Nor;             // The array of vertex normals passed to the shader
in vec4 vs_Col;             // The array of vertex colors passed to the shader.

out vec2 fs_UV;

void main()
{
    if(gl_VertexID == 0)
    {
        gl_Position = vec4(-1.0, -1.0, 0.99999, 1.0);
        fs_UV = vec2(0.0, 1.0);
    }
    else if(gl_VertexID == 1)
    {
        gl_Position = vec4(1.0, -1.0, 0.99999, 1.0);
        fs_UV = vec2(1.0, 1.0);
    }
    else if(gl_VertexID == 2)
    {
        gl_Position = vec4(1.0, 1.0, 0.99999, 1.0);
        fs_UV = vec2(1.0, 0.0);
    }
    else if(gl_VertexID == 3)
    {
        gl_Position = vec4(-1.0, 1.0, 0.99999, 1.0);
        fs_UV = vec2(0.0, 0.0);
    }
}
