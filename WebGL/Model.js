function Model(name) {
    this.name = name;
    this.vStripList = [];
    this.vStripIndicesList = [];
    this.uStripList = [];
    this.uStripIndicesList = [];


    this.createStripsAndIndices = function (data) {
        this.vStripList = data.stripLists.vOrderedPoints
        this.uStripList = data.stripLists.uOrderedPoints
        this.vStripIndicesList = data.indiceLists.vIndices
        this.uStripIndicesList = data.indiceLists.uIndices
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
        this.bufferAndDrawHelper(this.vStripList, this.vStripIndicesList)
        this.bufferAndDrawHelper(this.uStripList, this.uStripIndicesList)
    }
}