import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { customizeFrom, endgame, score, updateScore, time, updateTime, updateEndGame } from './elements.js';


const PLAYER_GEO = new THREE.BoxGeometry(1, .3, .3)
const BALL_GEO = new THREE.SphereGeometry(.2, 32, 15)

function socketSetup(mode) {
    let url = `ws://${window.location.host}/ws/${mode}/`
    const gameSocket = new WebSocket(url)

    gameSocket.onopen = (e) => {
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

function gameSetup(scene, camera, renderer) {
    camera.position.z = 5;
    camera.rotation.y = -Math.PI


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

function setup_canva() {
    let canva = document.getElementById("canva");
    let scorePanel = score(0, 0)
    let timePanel = time(0)
    canva.append(scorePanel)
    canva.append(timePanel)
    timePanel.style.display = 'none'
    scorePanel.style.display = 'none'


}

function update_coordinates(gameObjects, coordinates, mode) {
    const { ball } = gameObjects;
    ball.position.fromArray(coordinates.ball.position);

    if (mode === 'game') {
        const { player, otherPlayer } = gameObjects;
        player.position.fromArray(coordinates.player.position);
        otherPlayer.position.fromArray(coordinates.otherPlayer.position)
    } else if (mode === 'multi') {
        const { player1, player2, player3, player4 } = gameObjects;
        player1.position.fromArray(coordinates.player1.position);
        player2.position.fromArray(coordinates.player2.position);
        player3.position.fromArray(coordinates.player3.position);
        player4.position.fromArray(coordinates.player4.position);
    }
}

function create_objects_vs(scene) {
    let ball, player, otherPlayer, plane;

    //PLANE
    plane = new THREE.Mesh(new THREE.BoxGeometry(3, .2, 5), new THREE.MeshLambertMaterial({ color: 0x5F1584 }))

    // 	BALL
    ball = new THREE.Mesh(BALL_GEO, new THREE.MeshLambertMaterial({ color: 0xD43ADF }))
    ball.position.set(0, .8, 0)

    // PLAYER
    player = new THREE.Mesh(PLAYER_GEO, new THREE.MeshLambertMaterial({ color: 0x8C96ED }))
    player.position.set(0, .4, 2.7)


    //OTHERPLAYER
    otherPlayer = new THREE.Mesh(PLAYER_GEO, new THREE.MeshLambertMaterial({ color: 0xE4E6FB }))
    otherPlayer.position.set(0, .4, -2.7)

    scene.add(plane);
    scene.add(player);
    scene.add(otherPlayer);
    scene.add(ball);
    return { ball, player, otherPlayer, plane }
}

function create_objects_multi(scene) {

    //PLANE
    let plane = new THREE.Mesh(new THREE.BoxGeometry(5, .2, 5), new THREE.MeshLambertMaterial({ color: 0x005599 }))

    // 	BALL
    let ball = new THREE.Mesh(new THREE.SphereGeometry(.2, 32, 15), new THREE.MeshLambertMaterial({ color: 0xffffff }))

    // PLAYER
    let player1 = new THREE.Mesh(new THREE.BoxGeometry(1, .3, .3), new THREE.MeshLambertMaterial({ color: 0xff99ff }))

    let player2 = new THREE.Mesh(new THREE.BoxGeometry(1, .3, .3), new THREE.MeshLambertMaterial({ color: 0xffff88 }))

    let player3 = new THREE.Mesh(new THREE.BoxGeometry(1, .3, .3), new THREE.MeshLambertMaterial({ color: 0x22ffff }))

    let player4 = new THREE.Mesh(new THREE.BoxGeometry(1, .3, .3), new THREE.MeshLambertMaterial({ color: 0xff9900 }))


    scene.add(player1);
    scene.add(player2);
    scene.add(player3);
    scene.add(player4);
    scene.add(plane);
    scene.add(ball);
    return { ball, player1, player2, player3, player4, plane }
}

export function start(mode) {
    const gameSocket = socketSetup(mode)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();

    gameSetup(scene, camera, renderer)
    let gameObjects
    if (mode == 'game')
        gameObjects = create_objects_vs(scene)
    else if (mode == 'multi')
        gameObjects = create_objects_multi(scene)
    renderer.setAnimationLoop(animation);
    setup_canva()

    function animation() {
        gameSocket.onmessage = (e) => {
            const { type, data } = JSON.parse(e.data)
            switch (type) {
                case "coordinates":
                    update_coordinates(gameObjects, data, mode)
                    updateScore(gameObjects, data, mode)
                    break;

                case "endGame":
                    updateEndGame(data)
                    break;

                case 'gameInfo':
                    customizeFrom(gameSocket)
                    break;

                case 'time':
                    timePanel.style.display = 'flex'
                    updateTime(data)
                    break;
                default:
                    break;
            }
            gameObjects.ball.rotation.x += 0.1
        }
        renderer.render(scene, camera);
    }


}