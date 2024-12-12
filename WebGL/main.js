'use strict';

let gl;
let surface;
let shProgram;
let spaceball;

// For rotation
let lightAngle = 0;
let lightRadius = 10.0;

// Global data for shape 
let uData = { max: 15, min: 0, n: 40 }
let vData = { max: 2 * Math.PI, min: 0, n: 40 }
let scale = 0.06

function updateSliders() {
    const uSlider = document.getElementById("uSlider");
    const vSlider = document.getElementById("vSlider");
    const uValue = document.getElementById("uValue");
    const vValue = document.getElementById("vValue");

    uValue.textContent = uSlider.value;
    vValue.textContent = vSlider.value;

    uData.n = parseInt(uSlider.value, 10);
    vData.n = parseInt(vSlider.value, 10);

    surface.BufferData(CreateSurfaceData(uData, vData, 0.06));
    draw();
}

function updateLightPosition() {
    lightAngle += 0.01;

    let lightX = lightRadius * Math.cos(lightAngle);
    let lightY = 10.0;
    let lightZ = lightRadius * Math.sin(lightAngle);

    gl.uniform3fv(shProgram.iLightSource, [lightX, lightY, lightZ]);
}

function animate() {
    draw();
    requestAnimationFrame(animate);
}

function ShaderProgram(name, program) {

    this.name = name;
    this.prog = program;

    this.iAttribVertex = -1;
    this.iAttribNormal = -1;
    this.iColor = -1;
    this.iModelViewProjectionMatrix = -1;

    this.Use = function () {
        gl.useProgram(this.prog);
    }
}


function draw() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let projection = m4.perspective(Math.PI / 8, 1, 8, 12);
    let modelView = spaceball.getViewMatrix();
    let rotateToPointZero = m4.axisRotation([0.707, 0.707, 0], 0.0);
    let translateToPointZero = m4.translation(0, 0, -10);
    let matAccum0 = m4.multiply(rotateToPointZero, modelView);
    let matAccum1 = m4.multiply(translateToPointZero, matAccum0);

    let modelViewProjection = m4.multiply(projection, matAccum1);

    // Normal matrix
    let normalMatrix = m4.identity();
    m4.multiply(modelView, matAccum1, normalMatrix);
    m4.inverse(normalMatrix, normalMatrix);
    m4.transpose(normalMatrix, normalMatrix);

    gl.uniformMatrix4fv(shProgram.iModelViewProjectionMatrix, false, modelViewProjection);
    gl.uniformMatrix4fv(shProgram.iNormalMatrix, false, normalMatrix);
    let viewerPosition = [0.0, 0.0, 1.0];
    gl.uniform3fv(shProgram.iViewerPos, viewerPosition);

    updateLightPosition();
    gl.uniform3fv(shProgram.iLightSource, [0.0, 0.0, -10.0]);
    gl.uniform4fv(shProgram.iColor, [1, 1, 0, 1]);

    surface.Draw();
}


function initGL() {
    let prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    shProgram = new ShaderProgram('Basic', prog);
    shProgram.Use();

    shProgram.iAttribVertex = gl.getAttribLocation(prog, "vertex");

    if (shProgram.iAttribVertex === -1) {
        console.error('ERROR: vertex attribute location not found!');
    }

    shProgram.iAttribNormal = gl.getAttribLocation(prog, "normal");

    if (shProgram.iAttribNormal === -1) {
        console.error('ERROR: normal attribute location not found!');
    }

    shProgram.iModelViewProjectionMatrix = gl.getUniformLocation(prog, "ModelViewProjectionMatrix");
    shProgram.iColor = gl.getUniformLocation(prog, "color");

    shProgram.iNormalMatrix = gl.getUniformLocation(prog, "normalMatrix");
    shProgram.iLightSource = gl.getUniformLocation(prog, "lightPos");
    shProgram.iViewerPos = gl.getUniformLocation(prog, "viewerPos");
    shProgram.iCoordinates = gl.getAttribLocation(prog, "coordinates");
    shProgram.iTan = gl.getAttribLocation(prog, "tan");
    shProgram.iDiffuseTexture = gl.getUniformLocation(prog, "diffuseTexture");
    shProgram.iSpecularTexture = gl.getUniformLocation(prog, "specularTexture");
    shProgram.iNormalTexture = gl.getUniformLocation(prog, "normalTexture");

    surface = new Model('Surface');
    surface.BufferData(CreateSurfaceData(uData, vData, scale));

    gl.enable(gl.DEPTH_TEST);
}


function createProgram(gl, vShader, fShader) {
    let vsh = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsh, vShader);
    gl.compileShader(vsh);
    if (!gl.getShaderParameter(vsh, gl.COMPILE_STATUS)) {
        throw new Error("Error in vertex shader:  " + gl.getShaderInfoLog(vsh));
    }
    let fsh = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsh, fShader);
    gl.compileShader(fsh);
    if (!gl.getShaderParameter(fsh, gl.COMPILE_STATUS)) {
        throw new Error("Error in fragment shader:  " + gl.getShaderInfoLog(fsh));
    }
    let prog = gl.createProgram();
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        throw new Error("Link error in program:  " + gl.getProgramInfoLog(prog));
    }
    return prog;
}


function init() {
    let canvas;
    try {
        canvas = document.getElementById("webglcanvas");
        gl = canvas.getContext("webgl");
        if (!gl) {
            throw "Browser does not support WebGL";
        }
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not get a WebGL graphics context.</p>";
        return;
    }
    try {

        initGL();
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not initialize the WebGL graphics context: " + e + "</p>";
        return;
    }

    spaceball = new TrackballRotator(canvas, draw, 0);

    document.getElementById("uSlider").addEventListener("input", updateSliders);
    document.getElementById("vSlider").addEventListener("input", updateSliders);

    draw();
    // Call for lighting animation
    animate();
}
