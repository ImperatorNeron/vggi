function Vertex(point) {
    this.point = point;
    this.normal = [];
    this.triangles = [];
}

function Triangle(vertex0, vertex1, vertex2) {
    this.vertex0 = vertex0;
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.normal = [];
    this.tangent = [];
}


function createPolylineList(data1, data2, scale) {
    let vertexList = [];
    let dn1 = (data1.max - data1.min) / (data1.n)
    let dn2 = (data2.max - data2.min) / (data2.n)

    for (let i = data1.min; i <= data1.max; i += dn1) {
        let polylineVertexList = [];
        for (let j = data2.min; j <= data2.max + dn2; j += dn2) {
            let vertex = getVertex(i, j, scale);
            polylineVertexList.push(vertex);
        }
        vertexList.push(polylineVertexList);
    }

    return vertexList;
}

function addTriangles(vertexList) {

}

function orderPolylineToStripVertexes(vertexList) {
    let strips = []
    for (let i = 0; i < vertexList.length - 1; i++) {
        let strip = []
        for (let j = 0; j < vertexList[i].length - 1; j++) {
            strip.push(new Vertex(vertexList[i][j]))
            strip.push(new Vertex(vertexList[i + 1][j]))
        }
        strips.push(strip)
    }
    return strips
}

function getJustVertexes(vertexList) {
    let newVertexList = []
    for (let i = 0; i < vertexList.length; i++) {
        let tempList = []
        for (let j of vertexList[i]) {
            tempList.push(j.point)
        }
        newVertexList.push(tempList)
    }

    return newVertexList
}

function createIndices(stripList) {
    let stripsIndicesList = []
    for (let i = 0; i < stripList.length; i++) {
        let stripIndicesList = []
        for (let j = 0; j < Math.floor(stripList[i].length / 2) - 1; j++) {
            stripIndicesList.push(j * 2, j * 2 + 1, j * 2 + 2);
            stripIndicesList.push(j * 2 + 1, j * 2 + 2, j * 2 + 3);
        }
        stripsIndicesList.push(stripIndicesList)
    }
    return stripsIndicesList
}

function CreateSurfaceData(uData, vData, scale) {
    let uVertexList = createPolylineList(uData, vData, scale);
    let vVertexList = createPolylineList(vData, uData, scale);

    let uStripList = orderPolylineToStripVertexes(uVertexList);
    let vStripList = orderPolylineToStripVertexes(vVertexList);

    let uOrderedPoints = getJustVertexes(uStripList)
    let vOrderedPoints = getJustVertexes(vStripList)

    let stripLists = { uOrderedPoints, vOrderedPoints }
    let uIndices = createIndices(uStripList);
    let vIndices = createIndices(vStripList);
    let indiceLists = { uIndices, vIndices }

    return { stripLists, indiceLists };
}


function getVertex(u, v, scale) {
    let x = u * Math.cos(Math.cos(u)) * Math.cos(v)
    let y = u * Math.cos(Math.cos(u)) * Math.sin(v)
    let z = u * Math.sin(Math.cos(u))
    return [scale * x, scale * y, scale * z];
}