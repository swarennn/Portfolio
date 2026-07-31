import * as THREE from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const light = new THREE.AmbientLight(0xffffff, 5);
scene.add(light);

export default scene;