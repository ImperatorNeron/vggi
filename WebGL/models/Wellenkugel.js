export default function CreateSurfaceData(uData, vData, scale) {
    let uVertexList = [];
    let vVertexList = [];

    let du = (uData.max - uData.min) / (uData.n)
    let dv = (vData.max - vData.min) / (vData.n)

    for (let u = uData.min; u <= uData.max; u += du) {
        let uSinglePolylineVertexList = [];
        for (let v = vData.min; v <= vData.max; v += dv) {
            let vertex = getVertex(u, v, scale);
            uSinglePolylineVertexList.push(vertex);
        }
        uVertexList.push(uSinglePolylineVertexList);
    }

    for (let v = vData.min; v <= vData.max; v += dv) {
        let vSinglePolylineVertexList = [];
        for (let u = uData.min; u <= uData.max; u += du) {
            let vertex = getVertex(u, v, scale);
            vSinglePolylineVertexList.push(vertex);
        }
        vVertexList.push(vSinglePolylineVertexList);
    }

    return { uVertexList, vVertexList };
}


function getVertex(u, v, scale) {
    let x = u * Math.cos(Math.cos(u)) * Math.cos(v)
    let y = u * Math.cos(Math.cos(u)) * Math.sin(v)
    let z = u * Math.sin(Math.cos(u))
    return [scale * x, scale * y, scale * z];
}