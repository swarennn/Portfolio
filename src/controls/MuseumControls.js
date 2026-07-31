export let controlsEnabled = true;
let isDragging = false;
let yaw = 0;
let pitch = 0;

export function setCameraRotation(camera){

    camera.rotation.order = "YXZ";

    yaw = camera.rotation.y;
    pitch = camera.rotation.x;

}

export function getYaw() {
    return yaw;
}

export function getPitch() {
    return pitch;
}

export function setYaw(value) {
    yaw = value;
}

export function setPitch(value) {
    pitch = value;
}

export function createMuseumControls(camera, renderer){

    renderer.domElement.addEventListener("mousedown",()=>{

        isDragging = true;

    });

    window.addEventListener("mouseup",()=>{

        isDragging = false;

    });

    window.addEventListener("mousemove",(event)=>{
        if(!controlsEnabled) return;
        if(!isDragging) return;

        yaw += event.movementX * 0.002;
        pitch += event.movementY * 0.002;

        pitch = Math.max(
            -Math.PI/2.2,
            Math.min(Math.PI/2.2,pitch)
        );

        camera.rotation.order = "YXZ";

        camera.rotation.y = yaw;
        camera.rotation.x = pitch;

    });

}

export function disableControls() {

    controlsEnabled = false;

}

export function enableControls() {

    controlsEnabled = true;

}