/**
 * @desc Creates sphere-shaped geometry arrays.
 *
 * ## Usage
 *
 * In the example below we'll create an {@link XKTModel}, then create an {@link XKTMesh} with a sphere-shaped {@link XKTGeometry}.
 *
 * [[Run this example](http://xeokit.github.io/xeokit-sdk/examples/#geometry_builders_buildSphereGeometry)]
 *
 * ````javascript
 * const xktModel = new XKTModel();
 *
 * const sphere = buildSphereGeometry({
 *      center: [0,0,0],
 *      radius: 1.5,
 *      heightSegments: 60,
 *      widthSegments: 60
 * });
 *
 * const xktGeometry = xktModel.createGeometry({
 *      geometryId: "sphereGeometry",
 *      primitiveType: sphere.primitiveType, // Will be "triangles"
 *      positions: sphere.positions,
 *      normals: sphere.normals,
 *      indices: sphere.indices
 * });
 *
 * const xktMesh = xktModel.createMesh({
 *      meshId: "redSphereMesh",
 *      geometryId: "sphereGeometry",
 *      position: [-4, -6, -4],
 *      scale: [1, 3, 1],
 *      rotation: [0, 0, 0],
 *      color: [1, 0, 0],
 *      opacity: 1
 * });
 *
 *const xktEntity = xktModel.createEntity({
 *      entityId: "redSphere",
 *      meshIds: ["redSphereMesh"]
 *  });
 *
 * xktModel.finalize();
 * ````
 *
 * @function buildSphereGeometry
 * @param {*} [cfg] Configs
 * @param {Number[]} [cfg.center]  3D point indicating the center position.
 * @param {Number} [cfg.radius=1]  Radius.
 * @param {Number} [cfg.heightSegments=24] Number of latitudinal bands.
 * @param  {Number} [cfg.widthSegments=18] Number of longitudinal bands.
 * @returns {Object} Geometry arrays for {@link XKTModel#createGeometry} or {@link XKTModel#createMesh}.
 */
function buildSphereGeometry(cfg = {}) {

    const lod = cfg.lod || 1;

    const centerX = cfg.center ? cfg.center[0] : 0;
    const centerY = cfg.center ? cfg.center[1] : 0;
    const centerZ = cfg.center ? cfg.center[2] : 0;

    let radius = cfg.radius || 1;
    if (radius < 0) {
        console.error("negative radius not allowed - will invert");
        radius *= -1;
    }

    let heightSegments = cfg.heightSegments || 18;
    if (heightSegments < 0) {
        console.error("negative heightSegments not allowed - will invert");
        heightSegments *= -1;
    }
    heightSegments = Math.floor(lod * heightSegments);
    if (heightSegments < 18) {
        heightSegments = 18;
    }

    let widthSegments = cfg.widthSegments || 18;
    if (widthSegments < 0) {
        console.error("negative widthSegments not allowed - will invert");
        widthSegments *= -1;
    }
    widthSegments = Math.floor(lod * widthSegments);
    if (widthSegments < 18) {
        widthSegments = 18;
    }

    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    let i;
    let j;

    let theta;
    let sinTheta;
    let cosTheta;

    let phi;
    let sinPhi;
    let cosPhi;

    let x;
    let y;
    let z;

    let u;
    let v;

    let first;
    let second;

    for (i = 0; i <= heightSegments; i++) {

        theta = i * Math.PI / heightSegments;
        sinTheta = Math.sin(theta);
        cosTheta = Math.cos(theta);

        for (j = 0; j <= widthSegments; j++) {

            phi = j * 2 * Math.PI / widthSegments;
            sinPhi = Math.sin(phi);
            cosPhi = Math.cos(phi);

            x = cosPhi * sinTheta;
            y = cosTheta;
            z = sinPhi * sinTheta;
            u = 1.0 - j / widthSegments;
            v = i / heightSegments;

            normals.push(x);
            normals.push(y);
            normals.push(z);

            uvs.push(u);
            uvs.push(v);

            positions.push(centerX + radius * x);
            positions.push(centerY + radius * y);
            positions.push(centerZ + radius * z);
        }
    }

    for (i = 0; i < heightSegments; i++) {
        for (j = 0; j < widthSegments; j++) {

            first = (i * (widthSegments + 1)) + j;
            second = first + widthSegments + 1;

            indices.push(first + 1);
            indices.push(second + 1);
            indices.push(second);
            indices.push(first + 1);
            indices.push(second);
            indices.push(first);
        }
    }

    return {
        primitiveType: "triangles",
        positions: positions,
        normals: normals,
        uv: uvs,
        indices: indices
    };
}

export {buildSphereGeometry};
