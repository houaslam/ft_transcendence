import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';


export function endgame(message) {
    let pop = document.createElement('div')
    pop.setAttribute('id', 'popup')
    pop.innerHTML = `
        <h4>YOU WON</h4>
        <p>by ${message}</p>
        <button id="back">BACK HOME</button>
    `
    return pop
}

function setup(scene, camera, renderer) {
    camera.position.z = 5;
    camera.position.y = 1;

    // RENDERER
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement)

    // HELPER
    const axesHelper = new THREE.AxesHelper(5);

    // ORBIT CONTROLER
    const orbit = new OrbitControls(camera, renderer.domElement)

    // LIGHT
    const light = new THREE.DirectionalLight(0xffffff, 6);
    light.castShadow = true
    light.position.y = 5;
    light.position.z = 5;

    // WINDOW
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    // ADD TO SCENE
    scene.add(light);
    scene.add(axesHelper);

}

function setupEnv() {

}

function socketSetup() {
    let url = `ws://${window.location.host}/ws/multi/`
    const gameSocket = new WebSocket(url)

    gameSocket.onopen = function(e) {
        console.log("CONECTION ESTABLISHED")
    }

    document.addEventListener('keydown', (event) => {
        gameSocket.send(JSON.stringify({
            'type': 'keycode',
            'data': event.keyCode
        }))
    });
    return gameSocket
}

export function start() {

    let gameSocket = socketSetup()

    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setAnimationLoop(animation);
    const scene = new THREE.Scene();

    setup(scene, camera, renderer);

    let ball, player1, player2, player3, player4, plane;

    //PLANE
    plane = new THREE.Mesh(
        new THREE.BoxGeometry(5, .2, 5),
        new THREE.MeshLambertMaterial({ color: 0x005599 }))

    // 	BALL
    ball = new THREE.Mesh(
        new THREE.SphereGeometry(.2, 32, 15),
        new THREE.MeshLambertMaterial({ color: 0xffffff }))

    // PLAYER
    player1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, .3, .3),
        new THREE.MeshLambertMaterial({ color: 0xff99ff }))

    player2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, .3, .3),
        new THREE.MeshLambertMaterial({ color: 0xffff88 }))

    player3 = new THREE.Mesh(
        new THREE.BoxGeometry(1, .3, .3),
        new THREE.MeshLambertMaterial({ color: 0x22ffff }))

    player4 = new THREE.Mesh(
        new THREE.BoxGeometry(1, .3, .3),
        new THREE.MeshLambertMaterial({ color: 0xff9900 }))

    // SCENE

    scene.add(player1);
    scene.add(player2);
    scene.add(player3);
    scene.add(player4);
    scene.add(plane);
    scene.add(ball);

    function animation() {
        gameSocket.onmessage = function(e) {
            let dataJson = JSON.parse(e.data)
            console.log(dataJson['type']);

            if (dataJson['type'] == "coordinates") {

                let coordinates = dataJson['data']

                ball.position.fromArray(coordinates.ball.position)
                player1.position.fromArray(coordinates.player1.position)
                player2.position.fromArray(coordinates.player2.position)
                player3.position.fromArray(coordinates.player3.position)
                player4.position.fromArray(coordinates.player4.position)

            } else if (dataJson['type'] == "message") {
                console.log("disss");

                let pop = endgame(dataJson['data']);
                canva.append(pop)
                pop.style.transform = " translate(-50%, -50%) scale(1) "
                let backHome = document.getElementById("back")
                backHome.addEventListener('click', (e) => {
                    window.location.href = '/'
                })

            }
            ball.rotation.x += 0.1
        }
        renderer.render(scene, camera);
    }
}