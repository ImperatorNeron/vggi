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

    this.FlatPoints = function (vertexList) {
        vertexList = vertexList.flat();
        return vertexList.reduce((acc, vertex) => acc.concat(vertex.p), []);
    }

    this.FlatNormals = function (vertexList) {
        vertexList = vertexList.flat();
        return vertexList.reduce((acc, vertex) => acc.concat(vertex.normal), []);
    }

    this.BufferDataHelper = function (vertexList, iVertexBuffer, indecises, indecisesBuffer, normalBuffer) {
        // vertexes
        flatVertices = this.FlatPoints(vertexList);
        gl.bindBuffer(gl.ARRAY_BUFFER, iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatVertices), gl.STREAM_DRAW);

        // Normals
        let flatNormals = this.FlatNormals(vertexList);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatNormals), gl.STREAM_DRAW);

        // Indecises
        let flatIndecises = indecises.flat()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indecisesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatIndecises), gl.STREAM_DRAW);
    }

    this.BufferData = function (shapeData) {
        this.modelData = shapeData
        this.BufferDataHelper(shapeData.uVertexList, this.iVertexBufferU, shapeData.uIndecises, this.indecisesBufferU, this.normalsBufferU)
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
}