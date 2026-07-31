import * as THREE from "three";

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(
    7.8305,
    1.7295,
    -9.1652
);

export default camera;