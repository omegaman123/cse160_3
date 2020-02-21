// ColoredCube.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '  gl_Position = u_MvpMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '  v_TexCoord = a_TexCoord;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'varying vec2 v_TexCoord;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'uniform int u_Text;\n' +
    'uniform vec4 u_Color;\n' +
    'void main() {\n' +
    'if ( u_Text == 1 ) {\n' +
    '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);}\n' +
    'else{' +
    '   gl_FragColor = u_Color;}\n' +
    '   }\n';

let gl;
let mvpMatrix;
let u_MvpMatrix;
let textNum;
let u_Sampler;
let u_Text;
let u_Color;
let eyeObj = {};
const G_STEP = .1;
const G_ANGLE = 1;

let array = [[1, 0, 0, 2],
             [3, 2, 0, 1],
             [1, 0, 0, 1],
             [1, 1, 1, 1]];

let bigArr = [[0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3], //1
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //2
              [0,1,0,1,2,1,0,0,0,0,0,2,1,1,1,1,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //3
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //4
              [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //5
              [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,0,0,0,0,0,0,0,0,3], //6
              [3,1,1,1,0,0,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //7
              [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //8
              [3,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3], //9
              [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //11
              [3,1,0,1,2,1,0,0,0,0,0,2,1,1,1,1,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //12
              [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //13
              [3,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //14
              [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,0,0,0,0,0,0,0,0,3], //15
              [3,1,1,1,0,0,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //16
              [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //17
              [3,2,2,2,2,1,1,2,1,2,1,0,0,0,0,0,0,0,0,1,3,3,3,3,3,3,3,3,3,3,3,3], //18
              [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //19
              [3,1,0,1,2,1,0,0,0,0,0,2,1,1,1,1,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //20
              [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,3], //21
              [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //22
              [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,0,0,0,0,0,0,0,0,3], //23
              [3,1,1,1,0,0,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //24
              [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //25
              [3,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3], //26
              [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //27
              [3,1,0,1,2,1,0,0,0,0,0,2,1,1,1,1,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //28
              [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //29
              [3,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3], //30
              [3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,0,0,0,0,0,0,0,0,3], //31
              [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,3], //32
];

function main() {
    textNum = 0;
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Initialize shaders
    if (!createShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Set the vertex information
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the vertex information');
        return;
    }

    // Set the clear color and enable the depth test
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Get the storage location of u_MvpMatrix
    u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    if (!u_MvpMatrix) {
        console.log('Failed to get the storage location of u_MvpMatrix');
        return;
    }

    u_Text = gl.getUniformLocation(gl.program, 'u_Text');
    gl.uniform1i(u_Text, 1);

    u_Color = gl.getUniformLocation(gl.program, 'u_Color');

    mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(90, 1, 1, 100);
    eyeObj = {"x": 10, "y": 2, "z": 10, "lookX": 5, "lookY": 2, "lookZ": 5};
    mvpMatrix.lookAt(eyeObj.x, eyeObj.y, eyeObj.z, eyeObj.lookX, eyeObj.lookY, eyeObj.lookZ, 0, 1, 0);

    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (!initTextures(gl, n)) {
        console.log('Failed to intialize the texture.');
        return;
    }
    // Draw the cube
}

function draw(n) {
    console.log(eyeObj);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(90, 1, 1, 100);
    mvpMatrix.lookAt(eyeObj.x, eyeObj.y, eyeObj.z, eyeObj.lookX, eyeObj.lookY, eyeObj.lookZ, 0, 1, 0);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    drawCube({"x":0,"y":0,"z":0},u_MvpMatrix,mvpMatrix,{"x":32,"y":0,"z":32},n,
        {"type":0,"rgb":{"red":0,"green":60,"blue":0}});
    drawCube({"x":0,"y":-2,"z":0},u_MvpMatrix,mvpMatrix,{"x":64,"y":32,"z":64},n,
        {"type":1,"texID":1});
    for (let len = 0; len < bigArr.length; len++) {
        for (let width = 0; width < bigArr[len].length; width++) {
            switch (bigArr[len][width]) {
                case 3:
                    drawCube({"x": len, "y": 2, "z": width},
                        u_MvpMatrix,
                        mvpMatrix,
                        {"x": 1, "y": 1, "z": 1},
                        n,
                        {"type": 1, "texID": 2});
                case 2:
                    drawCube({"x": len, "y": 1, "z": width},
                        u_MvpMatrix,
                        mvpMatrix,
                        {"x": 1, "y": 1, "z": 1},
                        n,
                        {"type": 1, "texID": 2});
                case 1:
                    drawCube({"x": len, "y": 0, "z": width},
                        u_MvpMatrix,
                        mvpMatrix,
                        {"x": 1, "y": 1, "z": 1},
                        n,
                        {"type": 1, "texID": 2});
                    break;
            }
        }
    }
}


function drawCube(center, u_MvpMatrix, mvpMatrix, scale, n, color) {
    gl.uniform1i(u_Text, color.type);
    if (color.type === 0) {
        gl.uniform4fv(u_Color, new Float32Array([color.rgb.red, color.rgb.green, color.rgb.blue, 1.0]));

    } else if (color.type === 1) {
        gl.uniform1i(u_Sampler, color.texID);
    }
    let model = new Matrix4();
    model.translate(center.x, center.y, center.z);
    model.scale(scale.x, scale.y, scale.z);

    let mvp = new Matrix4();
    mvp.set(mvpMatrix);
    // mvp.rotate(cAngle,0,1,0);
    mvp.multiply(model);


    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvp.elements);
    // Clear color and depth buffer

    // Draw the cube
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffers(gl) {
    // Create a cube
    //    v8----- v7
    //   /|      /|
    //  v4------v3|
    //  | |     | |
    //  | |v5---|-|v6
    //  |/      |/
    //  v1------v2

    var vertices = new Float32Array([   // Vertex coordinates
        0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1,     // Front face
        0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0,     // Back face
        0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0,     // Top face
        0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1,     // Bottom face
        1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1,     // Right face
        0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0,     // Left face
    ]);

    var colors = new Float32Array([     // Colors
        0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
        0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0,  // v4-v7-v6-v5 back
        1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
        0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4, 0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
        1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
    ]);

    var texCoords = new Float32Array([
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,   // Front
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,   // Back
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,   // Top
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,   // Bottom
        0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,   // Right
        1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,   // Left
    ]);

    var indices = new Uint8Array([       // Indices of the vertices
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // right
        8, 9, 10, 8, 10, 11,    // up
        12, 13, 14, 12, 14, 15,    // left
        16, 17, 18, 16, 18, 19,    // down
        20, 21, 22, 20, 22, 23     // back
    ]);

    // Create a buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer)
        return -1;

    // Write the vertex coordinates and color to the buffer object
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position'))
        return -1;

    if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color'))
        return -1;

    if (!initArrayBuffer(gl, texCoords, 2, gl.FLOAT, 'a_TexCoord'))
        return -1;
    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
    var buffer = gl.createBuffer();   // Create a buffer object
    if (!buffer) {
        console.log('Failed to create the buffer object');
        return false;
    }
    // Write date into the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    // Assign the buffer object to the attribute variable
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        console.log('Failed to get the storage location of ' + attribute);
        return false;
    }
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    // Enable the assignment of the buffer object to the attribute variable
    gl.enableVertexAttribArray(a_attribute);

    return true;
}


function initTextures(gl, n) {
    // Clear <canvas>

    let images = ['resources/wall.jpg', 'resources/sky.jpg', 'resources/stone.jpg'];
    let texArr = [gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2, gl.TEXTURE3, gl.TEXTURE4, gl.TEXTURE5, gl.TEXTURE6, gl.TEXTURE7];

    u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    if (!u_Sampler) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }

    images.forEach(function (source, idx, imgArray) {
        var texture = gl.createTexture();   // Create a texture object
        if (!texture) {
            console.log('Failed to create the texture object');
            return false;
        }

        var image = new Image();  // Create the image object
        if (!image) {
            console.log('Failed to create the image object');
            return false;
        }
        // Register the event handler to be called on loading an image
        image.onload = function () {
            loadTexture(gl, n, texture, u_Sampler, image, texArr[idx]);
        };
        // Tell the browser to load an image
        image.src = source;
    });
    return true;
}

function loadTexture(gl, n, texture, u_Sampler, image, texID) {
    textNum++;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    gl.activeTexture(texID);
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit 0 to the sampler


    // gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    if (textNum === 3) {
        document.onkeydown = function (ev) {
            keydown(ev, gl, n,);
        };
        draw(n);
    }
}

function keydown(ev, gl, n) {
    switch (ev.which) {
        case 87: // W
            // console.log("KeyW");
            moveForward();
            break;
        case 83: // S
            // console.log("KeyS");
            moveBackward();
            break;
        case 65: // A
            // console.log("KeyA");
            moveLeft();
            break;
        case 68: // D
            // console.log("KeyD");
            moveRight();
            break;
        case 69: // E
            rotateRight();
            break;
        case 81: // Q
            rotateLeft();
            break;
    }
    draw(n);
}

function moveForward() {

    let at = new Vector3([eyeObj.lookX, eyeObj.lookY, eyeObj.lookZ]);
    let eye = new Vector3([eyeObj.x, eyeObj.y, eyeObj.z]);
    let dir = at.sub(eye);
    let sdir = dir.mul(G_STEP/2);
    let nEye = eye.add(sdir);
    let nAt = at.add(sdir);
    eyeObj.x = nEye.elements[0];
// eyeObj.y = nEye.y;
    eyeObj.z = nEye.elements[2];

    eyeObj.lookX = nAt.elements[0];
    eyeObj.lookY = nAt.elements[1];
    eyeObj.lookZ = nAt.elements[2];
    console.log(eyeObj);

}

function moveBackward() {
    let at = new Vector3([eyeObj.lookX, eyeObj.lookY, eyeObj.lookZ]);
    let eye = new Vector3([eyeObj.x, eyeObj.y, eyeObj.z]);
    let dir = at.sub(eye);
    let sdir = dir.mul(G_STEP/2);
    let nEye = eye.sub(sdir);
    let nAt = at.sub(sdir);
    eyeObj.x = nEye.elements[0];
// eyeObj.y = nEye.y;
    eyeObj.z = nEye.elements[2];

    eyeObj.lookX = nAt.elements[0];
    eyeObj.lookY = nAt.elements[1];
    eyeObj.lookZ = nAt.elements[2];
    console.log(eyeObj);
}

function getDeltasLR() {
    let dirX = eyeObj.x - eyeObj.lookX;
    let dirZ = eyeObj.z - eyeObj.lookZ;
    let dirH = Math.sqrt(dirX * dirX + dirZ * dirZ);
    let deltaX = G_STEP * dirZ / dirH;
    let deltaZ = G_STEP * dirX / dirH;
    return {deltaX, deltaZ};
}


function moveRight() {
    let { deltaX, deltaZ } = getDeltasLR();
    eyeObj.x = eyeObj.x + deltaX;
    eyeObj.z = eyeObj.z - deltaZ;
    eyeObj.lookX = eyeObj.lookX + deltaX;
    eyeObj.lookZ = eyeObj.lookZ - deltaZ;
}

function moveLeft() {
    let { deltaX, deltaZ } = getDeltasLR();
    eyeObj.x = eyeObj.x - deltaX;
    eyeObj.z = eyeObj.z + deltaZ;
    eyeObj.lookX = eyeObj.lookX - deltaX;
    eyeObj.lookZ = eyeObj.lookZ + deltaZ;
}

function rotateRight(){
    let at = new Vector3([eyeObj.lookX, eyeObj.lookY, eyeObj.lookZ]);
    let eye = new Vector3([eyeObj.x, eyeObj.y, eyeObj.z]);
    let dir = at.sub(eye);
    dir.normalize();
    let dX = Math.cos(G_ANGLE)*dir.elements[0] - Math.sin(G_ANGLE)*dir.elements[2];
    let dZ = Math.sin(G_ANGLE)*dir.elements[0] + Math.cos(G_ANGLE)*dir.elements[2];
    console.log(dX  + " " + dZ);
    eyeObj.lookX +=dX;
    eyeObj.lookZ +=dZ;
}
function rotateLeft() {
    let at = new Vector3([eyeObj.lookX, eyeObj.lookY, eyeObj.lookZ]);
    let eye = new Vector3([eyeObj.x, eyeObj.y, eyeObj.z]);
    let dir = at.sub(eye);
    dir.normalize();
    let dX = Math.cos(G_ANGLE)*dir.elements[0] - Math.sin(G_ANGLE)*dir.elements[2];
    let dZ = Math.sin(G_ANGLE)*dir.elements[0] + Math.cos(G_ANGLE)*dir.elements[2];
    eyeObj.lookX -=dX;
    eyeObj.lookZ -=dZ;
}


