import * as THREE from "three";

const isMobile = window.innerWidth < 768;

const camera = new THREE.PerspectiveCamera(

    isMobile ? 90 : 75,

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

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.fov = window.innerWidth < 768 ? 90 : 75;

    camera.updateProjectionMatrix();

});