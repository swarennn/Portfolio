import * as THREE from "three";

export const marker = new THREE.Mesh(
    new THREE.CircleGeometry(0.25, 32),
    new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35
    })
);

marker.rotation.x = -Math.PI / 2;

// Choose a point on your museum floor
marker.position.set(5, 0.02, -8);

import { Raycaster, Vector2 } from "three";
import gsap from "gsap";

const raycaster = new Raycaster();
const mouse = new Vector2();

export function setupNavigation(camera, renderer){

    renderer.domElement.addEventListener("click",(event)=>{

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse,camera);

        const hit = raycaster.intersectObject(marker);

        if(hit.length){

            gsap.to(camera.position,{
                x:marker.position.x,
                z:marker.position.z + 2,
                duration:1.5,
                ease:"power2.inOut"
            });

        }

    });

}