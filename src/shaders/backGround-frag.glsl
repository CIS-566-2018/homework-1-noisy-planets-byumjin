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
uniform mat4 u_ViewProj; 

uniform vec4 u_Color; // The color with which to render this instance of geometry.
uniform vec4 u_CameraPos;
uniform vec4 u_OceanColor; // this is for screenSize
uniform vec4 u_AtmosphereColor;

uniform vec4 u_TimeInfo;

float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
float noise(float x) { float i = floor(x); float f = fract(x); float u = f * f * (3.0 - 2.0 * f); return mix(hash(i), hash(i + 1.0), u); }
float noise(vec2 x) { vec2 i = floor(x); vec2 f = fract(x); float a = hash(i); float b = hash(i + vec2(1.0, 0.0)); float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0)); vec2 u = f * f * (3.0 - 2.0 * f); return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y; }

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
in vec2 fs_UV;

//refer to Morgan McGuire's Earth-like Tiny Planet
vec3 addStars(vec2 screenSize)
{
    float time = u_TimeInfo.x;

    // Background starfield
    float galaxyClump = (pow(noise(fs_UV.xy * (30.0 * screenSize.x)), 3.0) * 0.5 + pow(noise(100.0 + fs_UV.xy * (15.0 * screenSize.x)), 5.0)) / 3.5;
    
    vec3 starColor = vec3(galaxyClump * pow(hash(fs_UV.xy), 1500.0) * 80.0);

    starColor.x *= sqrt(noise(fs_UV.xy) * 1.2);
    starColor.y *= sqrt(noise(fs_UV.xy * 4.0));

    vec2 delta = (fs_UV.xy - screenSize.xy * 0.5) * screenSize.y * 1.2;  
    float radialNoise = mix(1.0, noise(normalize(delta) * 20.0 + time * 0.5), 0.12);

    float att = 0.057 * pow(max(0.0, 1.0 - (length(delta) - 0.9) / 0.9), 8.0);

    starColor += radialNoise * u_AtmosphereColor.xyz * min(1.0, att);

    float randSeed = rand(fs_UV);

    return starColor *  (( sin(randSeed + randSeed * time* 0.05) + 1.0)* 0.4 + 0.2);
}



out vec4 out_Col; // This is the final output color that you will see on your
                  // screen for the pixel that is currently being processed.

vec2 getScreenSpaceCoords( vec2 NDC ) 
{
    return vec2((NDC.x + 1.0) * 0.5, (1.0 - NDC.y) * 0.5);
}

vec2 getNDC( vec2 ssc ) 
{
    return vec2((ssc.x * 2.0) - 1.0, 1.0 - (ssc.y * 2.0));
}

void main()
{
    out_Col = vec4(0.0, 0.0, 0.0, 1.0);

    vec4 planetPos_ss = u_ViewProj * vec4(0.0, 0.0, 0.0, 1.0);
    planetPos_ss /= planetPos_ss.w;

    float radius = 3.0;

    vec2 screenSize = u_OceanColor.xy;

    vec3 upVector = vec3(u_CameraPos.w, u_OceanColor.z, u_OceanColor.w);
    vec3 pinPoint = upVector * radius;

    vec4 planetPolarPos_ss = u_ViewProj * vec4(pinPoint, 1.0);
    planetPolarPos_ss /= planetPolarPos_ss.w;

    float radius_ss = abs(planetPolarPos_ss.y - planetPos_ss.y);

        
    // Background stars
    out_Col.xyz += addStars(screenSize);
    
    vec2 NDC = getNDC(fs_UV);

    float screenRatio = screenSize.x / screenSize.y;
    NDC.x *= screenRatio;
    NDC /= radius_ss;

    vec2 gap = NDC - planetPos_ss.xy;  

    float dist = length(u_CameraPos.xyz);
    dist = planetPos_ss.z;

    planetPos_ss.x *= screenRatio; 
    planetPos_ss /= radius_ss;
    
    float halo = clamp(1.0 - sqrt(gap.x*gap.x + gap.y*gap.y), 0.0, 1.0);
    halo = pow(halo, 0.5);        
    halo = pow(halo, 3.5);  

    out_Col += clamp(vec4(u_AtmosphereColor.xyz * halo * 4.0, 1.0), 0.0, 1.0);
}
