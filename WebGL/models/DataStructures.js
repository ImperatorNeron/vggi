function Vertex(p, uv = [0, 0]) {
    this.p = p; // Координати вершини
    this.normal = []; // Усереднений нормаль
    this.tangent = []; // Усереднений тангент
    this.uv = uv; // Координати текстур
    this.triangles = []; // Трикутники, що містять цю вершину
    this.weight = null; // Вага для усереднення нормалей
}

function Triangle(v0, v1, v2) {
    this.v0 = v0; // Перша вершина трикутника
    this.v1 = v1; // Друга вершина трикутника
    this.v2 = v2; // Третя вершина трикутника
    this.normal = []; // Нормаль трикутника
    this.tangent = []; // Тангенти трикутника
}
