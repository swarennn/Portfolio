import "./style.css";
import { loadMuseum } from "./museum/Museum.js";
import scene from "./core/Scene.js";
import camera from "./core/Camera";
import renderer from "./core/Renderer.js";
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
        maxblur: 0.008
    }
);

composer.addPass(bokehPass);

const outputPass = new OutputPass();

composer.addPass(outputPass);

window.renderer = renderer;

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

    updateDynamicFocus(
        camera,
        scene,
        bokehPass
    );

    composer.render();
}

animate();

const menuButton = document.getElementById("ui");

const mobileMenu = document.getElementById("mobileMenu");

menuButton.onclick = () => {

    if(window.innerWidth <= 768){

        menuButton.classList.toggle("open");

        mobileMenu.classList.toggle("open");

    }

};
