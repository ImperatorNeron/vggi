function Model(name) {
    this.name = name;
    this.iVertexBufferU = [];
    this.iVertexBufferV = [];
    this.countsU = [];
    this.countsV = [];

    this.BufferDataHelper = function (lines, counts) {
        // Just for reset all vertices for right direction
        let bigStrip = []
        for (let i = 0; i < lines.length - 1; i++) {
            let strip = []
            for (let j = 0; j < lines[i].length - 1; j++) {
                strip.push(lines[i][j])
                strip.push(lines[i + 1][j])
                strip.push(lines[i + 1][j + 1])
                strip.push(lines[i][j])
                strip.push(lines[i + 1][j + 1])
                strip.push(lines[i][j + 1])
            }
            bigStrip.push(strip)
        }

        for (let strp of bigStrip) {
            let flatStrip = strp.flat();
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatStrip), gl.STREAM_DRAW);
            this.iVertexBufferV.push(buffer);
            counts.push(flatStrip.length / 3);
        }
    }

    this.BufferData = function (vertexLists) {
        this.BufferDataHelper(vertexLists.vVertexList, this.countsV)
    }

    this.DrawHelper = function (iVertexBuffer, counts) {
        for (let i = 0; i < iVertexBuffer.length; i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, iVertexBuffer[i]);
            gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(shProgram.iAttribVertex);
            gl.drawArrays(gl.TRIANGLES, 0, counts[i]);
        }
    }

    this.Draw = function () {
        this.DrawHelper(this.iVertexBufferV, this.countsV)
    }
}