#version 300 es

// This is a fragment shader. If you've opened this file first, please
// open and read lambert.vert.glsl before reading on.
// Unlike the vertex shader, the fragment shader actually does compute
// the shading of geometry. For every pixel in your program's output
// screen, the fragment shader is run for every bit of geometry that
// particular pixel overlaps. By implicitly interpolating the position
// data passed into the fragment shader by the vertex shader, the fragment shader
// can compute what color to apply to its pixel based on things like vertex
// position, light position, and vertex color.
precision highp float;

uniform mat4 u_Model;

uniform vec4 u_Color; // The color with which to render this instance of geometry.
uniform sampler2D u_DiffuseMap;

// These are the interpolated values out of the rasterizer, so you can't know
// their specific values without knowing the vertices that contributed to them
in vec4 fs_Pos;
in vec4 fs_Nor;
in vec4 fs_LightVec;
in vec4 fs_Col;

out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.

void main()
{
    // Material base color (before shading)
        vec4 diffuseColor = u_Color;

        // Calculate the diffuse term for Lambert shading
        float diffuseTerm = dot(normalize(fs_Nor), normalize(fs_LightVec));
        // Avoid negative lighting values
        diffuseTerm = clamp(diffuseTerm, 0.0, 1.0);

		vec3 n = normalize(fs_Pos.xyz);
        vec2 uv = vec2(atan(n.x, n.z) / 6.2831853, n.y * 0.5) + 0.5;
        uv.y = 1.0 - uv.y;
        //if Sun
        if(u_Model[3][0] == 0.0 && u_Model[3][1] == 0.0 && u_Model[3][2] == 0.0)
        {
            diffuseTerm = 1.0;
            diffuseColor *= texture(u_DiffuseMap, uv);
        }
        else        
            diffuseColor = texture(u_DiffuseMap, uv);

        float ambientTerm = 0.1;

        float lightIntensity = diffuseTerm + ambientTerm;   //Add a small float value to the color multiplier
                                                            //to simulate ambient lighting. This ensures that faces that are not
                                                            //lit by our point light are not completely black.

        // Compute final shaded color
        out_Col = vec4(diffuseColor.rgb * lightIntensity, diffuseColor.a);
}
