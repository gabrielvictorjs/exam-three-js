const app = {
    scene: null,
    sceneLight: null,
    coreLight: null,
    cam: null,
    renderer: null,
    clock: null,
    coreParticles: [],
    smokeParticles: []
}

function setupLights() {
    app.sceneLight = new THREE.DirectionalLight(0xffffff, 0.4);
    app.sceneLight.position.set(0, 0, 1);
    app.scene.add(app.sceneLight);

    // Center light
    app.coreLight = new THREE.PointLight(0x26A69A, 30, 1000, 1.7);
    app.coreLight.position.set(0, 0, 250);
    app.scene.add(app.coreLight);
}

function setupCam() {
    app.cam = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 10000);
    app.cam.position.z = 1000;
    app.scene.add(app.cam);
}

function setupRenderer() {
    app.renderer = new THREE.WebGLRenderer();
    app.renderer.setClearColor(0x1A1A1A, 1);
    app.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(app.renderer.domElement);
}

function setupParticles() {
    const loader = new THREE.TextureLoader();

    loader.load("smoke.png", function (texture) {
        const smokeGeometry = new THREE.PlaneBufferGeometry(3000, 4000);
        const smokeMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true
        });

        for (let p = 0; p < 160; p++) {
            let particle = new THREE.Mesh(smokeGeometry, smokeMaterial);
            particle.position.set(
                Math.random() * 1000 - 500,
                Math.random() * 400 - 200,
                25
            );
            particle.rotation.z = Math.random() * 360;
            particle.material.opacity = .65;
            app.smokeParticles.push(particle);
            app.scene.add(particle);
        }
    });

    loader.load("flame.png", function (texture) {
        const coreGeometry = new THREE.PlaneBufferGeometry(250, 250);
        const coreMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true
        });

        for (let p = 1200; p > 100; p--) {
            let particle = new THREE.Mesh(coreGeometry, coreMaterial);

            particle.position.set(
                0.5 * p * Math.cos((4 * p * Math.PI) / 150),
                0.5 * p * Math.sin((4 * p * Math.PI) / 150),
                0.1 * p * Math.sqrt((0.9 * p * Math.PI) / 150),
            );

            particle.rotation.z = Math.random() * 360;
            particle.material.opacity = 0.1;
            app.coreParticles.push(particle);
            app.scene.add(particle);
        }
    });
}

function startAnimation() {
    let delta = app.clock.getDelta();
    app.coreParticles.forEach(p => p.rotation.z -= delta * .3);
    app.smokeParticles.forEach(p => p.rotation.z -= delta * 0.04);
    app.renderer.render(app.scene, app.cam);
    requestAnimationFrame(startAnimation);
}

(function init() {
    app.scene = new THREE.Scene();
    app.clock = new THREE.Clock();

    setupLights();
    setupCam();
    setupRenderer();
    setupParticles();

    startAnimation();
})();