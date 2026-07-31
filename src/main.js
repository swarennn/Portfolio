import "./style.css";
import { loadMuseum } from "./museum/Museum";
import scene from "./core/Scene";
import camera from "./core/Camera";
import renderer from "./core/Renderer";
import * as THREE from "three";
import {
    createMuseumControls,
    setCameraRotation
} from "./controls/MuseumControls";
import { navigationPoints } from "./navigation/NavigationManager";
import {
    createMarkers,
    enableMarkerClicks
} from "./navigation/Markers";

window.camera = camera;

document
    .getElementById("app")
    .appendChild(renderer.domElement);

loadMuseum(scene, () => {

    const start = navigationPoints["001"];

if (!start) {

    console.error("Nav_001 not found");

    return;

}

camera.position.copy(start.position);

// Apply Blender rotation
camera.rotation.order = "XYZ";

camera.position.copy(start.position);

camera.rotation.copy(start.rotation);

// Temporary correction
camera.rotateX(Math.PI / 2);


// Update our mouse-look system
setCameraRotation(camera);
createMarkers(navigationPoints, scene);
enableMarkerClicks(
    camera,
    renderer
);
});

//window.moveTo = (id)=>moveTo(id,camera,controls);
createMuseumControls(camera, renderer);

// Animation
function animate(){

    requestAnimationFrame(animate);
    renderer.render(scene,camera);

}

animate();

const hamburger = document.getElementById("hamburger");

const mobileMenu = document.getElementById("mobileMenu");

hamburger.onclick = ()=>{

    mobileMenu.classList.toggle("open");

};