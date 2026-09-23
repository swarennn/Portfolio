import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const screenCenter = new THREE.Vector2(0, 0);

let currentFocus = 15;
let targetFocus = 15;

let lastCheck = 0;

const CHECK_INTERVAL = 50; // milliseconds
const FOCUS_SPEED = 0.08;

// Objects that should not become the focus target
const ignoredNames = [
    "Camera",
    "Nav",
    "Marker",
    "marker"
];

function shouldIgnore(object) {

    if (!object) return true;

    return ignoredNames.some(name =>
        object.name.includes(name)
    );
}

export function updateDynamicFocus(
    camera,
    scene,
    bokehPass
) {

    const now = performance.now();

    // Don't raycast every frame
    if (now - lastCheck < CHECK_INTERVAL) {
        return;
    }

    lastCheck = now;

    // Shoot a ray from the exact center of the screen
    raycaster.setFromCamera(
        screenCenter,
        camera
    );

    const intersections =
        raycaster.intersectObjects(
            scene.children,
            true
        );

    let hit = null;

    for (const intersection of intersections) {

        if (!shouldIgnore(intersection.object)) {

            hit = intersection;
            break;

        }
    }

    if (hit) {

        // Distance from camera to whatever we're looking at
        targetFocus = hit.distance;

    }

    // Smooth focus pull
    currentFocus +=
        (targetFocus - currentFocus) *
        FOCUS_SPEED;

    bokehPass.uniforms.focus.value =
        currentFocus;
}