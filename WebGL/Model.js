function Model(name) {
    this.name = name;
    this.allStripsListV = [];
    this.allStripsIndicesV = [];
    this.allStripsListU = [];
    this.allStripsIndicesU = [];

    this.createStripsAndIndicesHelper = function (lines, strips, stripsIndices) {
        for (let i = 0; i < lines.length - 1; i++) {
            let strip = []
            for (let j = 0; j < lines[i].length - 1; j++) {
                strip.push(lines[i][j])
                strip.push(lines[i + 1][j])
            }
            strips.push(strip)
        }

        for (let i = 0; i < strips.length; i++) {
            let oneStripIndices = []
            for (let j = 0; j < Math.floor(strips[i].length / 2) - 1; j++) {
                oneStripIndices.push(j * 2, j * 2 + 1, j * 2 + 2);
                oneStripIndices.push(j * 2 + 1, j * 2 + 2, j * 2 + 3);
            }
            stripsIndices.push(oneStripIndices)
        }

    }

    this.createStripsAndIndices = function (vertexLists) {
        this.createStripsAndIndicesHelper(vertexLists.vVertexList, this.allStripsListV, this.allStripsIndicesV)
        // this.BufferDataHelper(vertexLists.uVertexList, this.allStripsListU, this.allStripsIndicesU)
    }

    this.bufferAndDrawHelper = function (strips, stripsIndices) {
        for (let i = 0; i < stripsIndices.length; i++) {

            let flatStrip = strips[i].flat();
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatStrip), gl.STREAM_DRAW);

            gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(shProgram.iAttribVertex);

            let indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(stripsIndices[i]), gl.STREAM_DRAW);

            gl.drawElements(gl.TRIANGLES, stripsIndices[i].length, gl.UNSIGNED_SHORT, 0);
        }
    }

    this.bufferAndDraw = function () {
        this.bufferAndDrawHelper(this.allStripsListV, this.allStripsIndicesV)
        // this.DrawHelper(this.allStripsListU, this.allStripsIndicesU)
    }
}