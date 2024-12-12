function CreateSurfaceData(uData, vData, scale) {
    let du = (uData.max - uData.min) / (uData.n)
    let dv = (vData.max - vData.min) / (vData.n)
    let uVertexList = CalculateVertexes(uData, vData, scale);
    let vVertexList = CalculateVertexes(vData, uData, scale, reversed = true);
    let uIndecises = orderIndecises(uVertexList);
    let vIndecises = orderIndecises(vVertexList, true);
    addTriangles(uVertexList, uIndecises);
    addTriangles(vVertexList, vIndecises);
    addNormals(uVertexList, du, dv);
    addNormals(vVertexList, du, dv);
    let texData = getCoordinatesAndTanList();
    return { uVertexList, vVertexList, uIndecises, vIndecises, coordinates: texData.coordinatesList, tanList: texData.tanList };
}

function arraysHaveSameValues(arr1, arr2) {
    return arr1.every(value => arr2.includes(value)) && arr2.every(value => arr1.includes(value));
}

function addNormals(vertexList) {
    let flatVertexList = vertexList.flat();
    for (let i = 0; i < flatVertexList.length; i++) {
        for (let j = 0; j < flatVertexList[i].triangles.length; j++) {
            let p0 = flatVertexList[i].triangles[j].v0;
            let p1 = flatVertexList[i].triangles[j].v1;
            let p2 = flatVertexList[i].triangles[j].v2;

            let vector1 = null;
            let vector2 = null;

            if (arraysHaveSameValues(p0, flatVertexList[i].p)) {
                vector1 = m4.subtractVectors(p1, flatVertexList[i].p);
                vector2 = m4.subtractVectors(p2, flatVertexList[i].p);
            } else if (arraysHaveSameValues(p1, flatVertexList[i].p)) {
                vector1 = m4.subtractVectors(p0, flatVertexList[i].p);
                vector2 = m4.subtractVectors(p2, flatVertexList[i].p);
            } else if (arraysHaveSameValues(p2, flatVertexList[i].p)) {
                vector1 = m4.subtractVectors(p0, flatVertexList[i].p);
                vector2 = m4.subtractVectors(p1, flatVertexList[i].p);
            }

            flatVertexList[i].triangles[j].normal = Array.from(m4.normalize(m4.cross(vector1, vector2)));
            flatVertexList[i].triangles[j].weight = m4.length(m4.cross(vector1, vector2));
        }

        let normal = [0, 0, 0];
        let totalWeight = 0;
        for (let t of flatVertexList[i].triangles) {
            normal = m4.addVectors(normal, m4.scaleVector(t.normal, t.weight));
            totalWeight += t.weight;
        }
        flatVertexList[i].normal = Array.from(normal.map(value => -value / totalWeight));
    }
}

function addTriangles(vertexList, indecises) {
    let flatVertexList = vertexList.flat()
    for (let i = 0; i < flatVertexList.length; i++) {
        let result = indecises.filter(subArray => subArray.includes(i));
        for (let j = 0; j < result.length; j++) {
            let t = new Triangle(
                flatVertexList[result[j][0]].p,
                flatVertexList[result[j][1]].p,
                flatVertexList[result[j][2]].p,
            )
            flatVertexList[i].triangles.push(t)
        }
    }
}

function orderIndecises(vertexList, isV = false) {

    let indecises = []
    let multiply = vertexList[0].length
    for (let i = 0; i < vertexList.length - 1; i++) {
        for (let j = 0; j < vertexList[i].length - 1; j++) {
            indecises.push([multiply * i + j, multiply * i + j + multiply, multiply * i + j + 1])
            indecises.push([multiply * i + j + multiply, multiply * i + j + 1, multiply * i + j + multiply + 1])
        }
        if (!isV) {
            indecises.push([multiply * i + multiply - 1, multiply * (i + 1) + multiply - 1, multiply * i])
            indecises.push([multiply * (i + 1) + multiply - 1, multiply * i, multiply * (i + 1)])
        }

    }
    if (isV) {
        for (let i = 0; i < vertexList[0].length - 1; i++) {
            indecises.push([multiply * vertexList.length - multiply + i, i, multiply * vertexList.length - multiply + i + 1])
            indecises.push([i, multiply * vertexList.length - multiply + i + 1, i + 1])
        }
    }


    return indecises
}

function CalculateVertexes(data0, data1, scale, reversed = false) {

    let vertexList = [];
    let dn0 = (data0.max - data0.min) / (data0.n)
    let dn1 = (data1.max - data1.min) / (data1.n)
    let vertex;

    for (let i = 0; i < data0.n; i++) {
        let tempList = [];
        let current0 = data0.min + i * dn0;
        for (let j = 0; j < data1.n; j++) {
            let current1 = data1.min + j * dn1;
            if (reversed) {
                vertex = getVertex(current1, current0, scale);
            } else {
                vertex = getVertex(current0, current1, scale);
            }
            tempList.push(vertex);
        }
        vertexList.push(tempList);
    }

    return vertexList;
}

function getVertex(u, v, scale) {
    let x = u * Math.cos(Math.cos(u)) * Math.cos(v)
    let y = u * Math.cos(Math.cos(u)) * Math.sin(v)
    let z = u * Math.sin(Math.cos(u))
    return new Vertex([scale * x, scale * y, scale * z]);
}

function getCoordinatesAndTanList() {
    let coordinatesList = []
    let tanList = []
    for (let u = 0; u < uData.n; u++) {
        for (let v = 0; v < vData.n; v++) {
            coordinatesList.push(u / uData.n, v / vData.n);
            tanList.push(1, 0, 0);
        }
    }
    return { coordinatesList, tanList }
}