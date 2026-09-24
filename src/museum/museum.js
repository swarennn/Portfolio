import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
    findNavigationPoints,
    navigationPoints
} from "../navigation/NavigationManager.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);
const loader = new GLTFLoader();
const paintingNamePattern = /^(?:Painting[_\s]+)(\d+)$/;

loader.setDRACOLoader(dracoLoader);

export function loadMuseum(scene, onLoaded){

    loader.load(

        "/models/museum-draco.glb",

        (gltf)=>{

            scene.add(gltf.scene);
            console.log(gltf);
            gltf.scene.traverse((object) => {
                const match = object.name.match(paintingNamePattern);
                if (match) {
                    object.userData.isPainting = true;
                    object.userData.paintingNumber = Number(match[1]);
                    object.userData.paintingImage = `/Painting_${match[1]}.jpg`;
                }
            });
            findNavigationPoints(gltf.scene);

            if(onLoaded) onLoaded();

            const loading = document.getElementById("loading-screen");

setTimeout(()=>{

    loading.style.opacity="0";

    setTimeout(()=>{

        loading.remove();

    },700);

},400);

            console.log("Museum Loaded!");

        },

        () => {},

        (error)=>{

            console.error(error);

        }

    );

}
