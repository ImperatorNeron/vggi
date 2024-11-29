function Vertex(p) {
    this.p = p;
    this.normal = [];
    this.triangles = [];
    this.weight = null;
}

function Triangle(v0, v1, v2) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.normal = [];
    this.tangent = [];
}