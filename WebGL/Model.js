// Constructor
function Model(name) {
    this.name = name;
    this.modelData = null;
    this.iVertexBufferU = gl.createBuffer();
    this.iVertexBufferV = gl.createBuffer();
    this.indecisesBufferU = gl.createBuffer();
    this.indecisesBufferV = gl.createBuffer();
    this.normalsBufferU = gl.createBuffer();
    this.normalsBufferV = gl.createBuffer();
    this.coordinatesBuffer = gl.createBuffer();
    this.tanBuffer = gl.createBuffer();
    this.diffuse = gl.createTexture();
    this.normal = gl.createTexture();
    this.specular = gl.createTexture();

    this.FlatPoints = function (vertexList) {
        vertexList = vertexList.flat();
        return vertexList.reduce((acc, vertex) => acc.concat(vertex.p), []);
    }

    this.FlatNormals = function (vertexList) {
        vertexList = vertexList.flat();
        return vertexList.reduce((acc, vertex) => acc.concat(vertex.normal), []);
    }

    this.BufferDataHelper = function (vertexList, iVertexBuffer, indecises, indecisesBuffer, normalBuffer, coordinates, tanList) {
        // vertexes
        flatVertices = this.FlatPoints(vertexList);
        gl.bindBuffer(gl.ARRAY_BUFFER, iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatVertices), gl.STREAM_DRAW);

        // Normals
        let flatNormals = this.FlatNormals(vertexList);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatNormals), gl.STREAM_DRAW);

        // Tan + coordinates + textures
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordinatesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordinates), gl.STREAM_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.tanBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tanList), gl.STREAM_DRAW);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.diffuse);
        gl.uniform1i(shProgram.iDiffuseTexture, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.specular);
        gl.uniform1i(shProgram.iSpecularTexture, 1);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.normal);
        gl.uniform1i(shProgram.iNormalTexture, 2);

        this.textureImg("Texture/BaseColor.jpg", this.diffuse)
        this.textureImg("Texture/Roughness.jpg", this.specular)
        this.textureImg("Texture/Normal.png", this.normal)

        gl.bindTexture(gl.TEXTURE_2D, this.specular);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        // Indecises
        let flatIndecises = indecises.flat()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indecisesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatIndecises), gl.STREAM_DRAW);
    }

    this.BufferData = function (shapeData) {
        this.modelData = shapeData
        this.BufferDataHelper(shapeData.uVertexList, this.iVertexBufferU, shapeData.uIndecises, this.indecisesBufferU, this.normalsBufferU, shapeData.coordinates, shapeData.tanList)
        // this.BufferDataHelper(shapeData.vVertexList, this.iVertexBuffe ata.vIndecises, this.indecisesBufferV, this.normalsBufferV)
    }

    this.DrawHelper = function (iVertexBuffer, indecises, indecisesBuffer, normalBuffer) {
        // vertexes
        gl.bindBuffer(gl.ARRAY_BUFFER, iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);

        // Normals
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(shProgram.iAttribNormal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribNormal);

        // Coordinates
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordinatesBuffer);
        gl.vertexAttribPointer(shProgram.iCoordinates, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iCoordinates);

        // Tengent
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tanBuffer);
        gl.vertexAttribPointer(shProgram.iTan, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iTan);

        // Indecises
        let flatIndecises = indecises.flat()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indecisesBuffer);

        // Draw by indecises
        gl.drawElements(gl.TRIANGLES, flatIndecises.length, gl.UNSIGNED_SHORT, 0);
    }

    this.Draw = function () {
        this.DrawHelper(this.iVertexBufferU, this.modelData.uIndecises, this.indecisesBufferU, this.normalsBufferU)
        // this.DrawHelper(this.iVertexBufferV, this.modelData.vIndecises, this.indecisesBufferV, this.normalsBufferV)
    }

    this.textureImg = function(src, tex) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
    }
}