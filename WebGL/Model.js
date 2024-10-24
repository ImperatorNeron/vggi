function Model(name) {
    this.name = name;
    this.iVertexBufferU = [];
    this.iVertexBufferV = [];
    this.countsU = [];
    this.countsV = [];

    this.BufferDataHelper = function (lines, counts, iVertexBuffer) {
        for (let line of lines) {
            let flatVertices = line.flat();
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatVertices), gl.STREAM_DRAW);
            iVertexBuffer.push(buffer);
            counts.push(flatVertices.length / 3);
        }
    }

    this.BufferData = function (vertexLists) {
        this.BufferDataHelper(vertexLists.uVertexList, this.countsU, this.iVertexBufferU)
        this.BufferDataHelper(vertexLists.vVertexList, this.countsV, this.iVertexBufferV)
    }

    this.DrawHelper = function (iVertexBuffer, counts) {
        for (let i = 0; i < iVertexBuffer.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, iVertexBuffer[i]);
            gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(shProgram.iAttribVertex);
            gl.drawArrays(gl.LINE_STRIP, 0, counts[i]);
        }
    }

    this.Draw = function () {
        this.DrawHelper(this.iVertexBufferU, this.countsU)
        this.DrawHelper(this.iVertexBufferV, this.countsV)
    }
}