import * as THREE from "three";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

const SAMPLE_COUNT = 8;
const ANGULAR_THRESHOLD = 0.12;
const MAX_BLUR_PIXELS = 18;
const REFERENCE_DEPTH = 5;
const MOBILE_STRENGTH = 1;

const motionBlurShader = {
    uniforms: {
        tDiffuse: { value: null },
        blurVelocity: { value: new THREE.Vector2() }
    },
    vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: /* glsl */ `
        uniform sampler2D tDiffuse;
        uniform vec2 blurVelocity;
        varying vec2 vUv;

        void main() {
            vec4 color = vec4(0.0);
            for (int i = 0; i < ${SAMPLE_COUNT}; i++) {
                float t = (float(i) / float(${SAMPLE_COUNT - 1})) - 0.5;
                color += texture2D(tDiffuse, vUv + blurVelocity * t);
            }
            gl_FragColor = color / float(${SAMPLE_COUNT});
        }
    `
};

function shortestAngleDelta(current, previous) {
    return Math.atan2(
        Math.sin(current - previous),
        Math.cos(current - previous)
    );
}

export class MotionBlurPass extends ShaderPass {
    constructor() {
        super(motionBlurShader);
        this.previousPosition = new THREE.Vector3();
        this.previousYaw = 0;
        this.previousPitch = 0;
        this.hasPreviousTransform = false;
        this.smoothedPixels = 0;
        this.direction = new THREE.Vector2();
        this.localMotion = new THREE.Vector3();
        this.mobile = window.innerWidth < 768;
    }

    reset(camera) {
        this.previousPosition.copy(camera.position);
        this.previousYaw = camera.rotation.y;
        this.previousPitch = camera.rotation.x;
        this.hasPreviousTransform = true;
        this.smoothedPixels = 0;
        this.uniforms.blurVelocity.value.set(0, 0);
    }

    update(camera, deltaTime) {
        if (!this.hasPreviousTransform) {
            this.reset(camera);
            return;
        }

        const dt = Math.max(deltaTime, 1 / 240);
        camera.updateMatrixWorld();
        const deltaYaw = shortestAngleDelta(camera.rotation.y, this.previousYaw);
        const deltaPitch = camera.rotation.x - this.previousPitch;

        this.localMotion.copy(camera.position).sub(this.previousPosition);
        _right.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
        _up.setFromMatrixColumn(camera.matrixWorld, 1).normalize();
        const deltaRight = this.localMotion.dot(_right);
        const deltaUp = this.localMotion.dot(_up);

        // Camera rotation and lateral travel move the viewed image in the
        // opposite screen direction. Translation uses a conservative depth estimate.
        const screenDeltaX = -deltaYaw - deltaRight / REFERENCE_DEPTH;
        const screenDeltaY = deltaPitch - deltaUp / REFERENCE_DEPTH;
        const angularSpeed = Math.hypot(deltaYaw, deltaPitch) / dt;
        const translationSpeed = Math.hypot(deltaRight, deltaUp) / REFERENCE_DEPTH / dt;
        const speed = Math.max(
            angularSpeed,
            Math.hypot(screenDeltaX, screenDeltaY) / dt,
            translationSpeed
        );

        const targetPixels = speed < ANGULAR_THRESHOLD
            ? 0
            : Math.min(
                MAX_BLUR_PIXELS,
                Math.max(0, (speed - ANGULAR_THRESHOLD) * 10)
            ) * (this.mobile ? MOBILE_STRENGTH : 1);

        // Smooth the magnitude while keeping the streak aligned with this frame's motion.
        const smoothingRate = targetPixels > this.smoothedPixels ? 18 : 24;
        const smoothing = 1 - Math.exp(-smoothingRate * dt);
        this.smoothedPixels += (targetPixels - this.smoothedPixels) * smoothing;

        const motionLength = Math.hypot(screenDeltaX, screenDeltaY);
        const pixelRatio = window.innerWidth;
        const height = window.innerHeight;

        if (motionLength > 1e-6) {
            this.direction.set(screenDeltaX / motionLength, screenDeltaY / motionLength);
        }

        if (this.smoothedPixels > 0.02) {
            this.uniforms.blurVelocity.value.set(
                this.direction.x * this.smoothedPixels / pixelRatio,
                this.direction.y * this.smoothedPixels / height
            );
        } else {
            this.uniforms.blurVelocity.value.set(0, 0);
        }

        this.previousPosition.copy(camera.position);
        this.previousYaw = camera.rotation.y;
        this.previousPitch = camera.rotation.x;
    }
}

const _right = new THREE.Vector3();
const _up = new THREE.Vector3();

export function resetMotionBlur(pass, camera) {
    pass.mobile = window.innerWidth < 768;
    pass.reset(camera);
}
