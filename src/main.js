import "./style.css";
import * as THREE from "three";
import { loadMuseum } from "./museum/museum.js";
import scene from "./core/scene.js";
import camera from "./core/camera.js";
import renderer from "./core/renderer.js";
import {
    createMuseumControls,
    setCameraRotation
} from "./controls/MuseumControls.js";
import { navigationPoints } from "./navigation/NavigationManager.js";
import {
    createMarkers,
    enableMarkerClicks
} from "./navigation/Markers.js";
import { updateDynamicFocus } from "./effects/DynamicFocus.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { MotionBlurPass, resetMotionBlur } from "./effects/MotionBlurPass.js";
import { createPaintingViewer } from "./ui/PaintingViewer.js";

window.camera = camera;
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(
    scene,
    camera
);

composer.addPass(renderPass);

const bokehPass = new BokehPass(
    scene,
    camera,
    {
        focus: 3,
        aperture: 0.001,
        maxblur: 0.005
    }
);

composer.addPass(bokehPass);

const motionBlurPass = new MotionBlurPass();
composer.addPass(motionBlurPass);
window.addEventListener("resize", () => {
    motionBlurPass.mobile = window.innerWidth < 768;
});

const outputPass = new OutputPass();

composer.addPass(outputPass);

window.renderer = renderer;

document
    .getElementById("app")
    .appendChild(renderer.domElement);

createPaintingViewer(scene, camera, renderer);

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
resetMotionBlur(motionBlurPass, camera);
createMarkers(navigationPoints, scene);
enableMarkerClicks(
    camera,
    renderer
);
});

//window.moveTo = (id)=>moveTo(id,camera,controls);
createMuseumControls(camera, renderer);

// Animation
const motionBlurClock = new THREE.Clock();
function animate(){

    requestAnimationFrame(animate);

    motionBlurPass.update(camera, motionBlurClock.getDelta());

    updateDynamicFocus(
        camera,
        scene,
        bokehPass
    );

    composer.render();
}

animate();

