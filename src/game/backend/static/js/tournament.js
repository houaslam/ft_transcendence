import { gameSetup, create_objects_vs, setup_canva } from './game.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// import { score, time, updateScore, updateTime } from './element.js'

let BALLVELO = {
    x: 0,
    y: 0.01,
    z: 0.01
}

let BALLSPEED = 0.01

export function create_form() {
    let form = document.createElement('form')
    form.setAttribute('id', 'tournam-regist')

    form.innerHTML = `
        <div class="player-set">

            <input name="player1" class="player-name" required>
            <p>VS</p>
            <input name="player2" class="player-name" required>
        </div>
        <div class="player-set">
            <input name="player3" class="player-name" required>
            <p>VS</p>
            <input name="player4" class="player-name" required>
        </div>

        <button id="start" type="submit">Start</button>

    `
    document.getElementById('canva').appendChild(form)
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        let data = new FormData(form);
        let gameOptions = Object.fromEntries(data)
        form.remove()
        start(gameOptions)
    })

}


function start(gameOptions) {
    let players = Object.values(gameOptions)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const scene = new THREE.Scene();

    gameSetup(scene, camera, renderer)
    setup_canva()

    let firstWinner = game(players[0], players[1], scene, renderer, camera)
        // let secondWinner = game(players[2], players[3], scene, renderer)

    // let Winner = game(firstWinner, secondWinner, scene, renderer, camera)

}

function check_gravity(gameObjects) {
    let pvelocity = 0.01
    const p1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    p1.setFromObject(gameObjects.player)

    const p2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    p2.setFromObject(gameObjects.otherPlayer)

    const ball = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    ball.setFromObject(gameObjects.ball)


    const plane = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    plane.setFromObject(gameObjects.plane)

    if (!p1.intersectsBox(plane)) {

        gameObjects.player.position.y -= pvelocity
        gameObjects.otherPlayer.position.y -= pvelocity
    }
    if (!ball.intersectsBox(plane))
        gameObjects.ball.position.y -= BALLVELO.y
}

function is_out_bound(gameObjects) {

    if (gameObjects.ball.position.z > 2.5 || gameObjects.ball.position.z < -2.5) {
        BALLVELO.y = 0
        gameObjects.ball.position.set(0, .8, 0)
        return true
    }
    return false
}

function check_collision(gameObjects) {
    const p1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    p1.setFromObject(gameObjects.player)

    const p2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    p2.setFromObject(gameObjects.otherPlayer)

    const ball = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3())
    ball.setFromObject(gameObjects.ball)


    if (ball.intersectsBox(p1) || ball.intersectsBox(p2)) {

        let hitpont = (gameObjects.ball.position.x - gameObjects.player.position.x)
        BALLVELO.x = hitpont * 0.05
            // BALLVELO.z += 0.001
        BALLSPEED *= -1
    }
    gameObjects.ball.position.z += BALLVELO.z
    gameObjects.ball.position.x += BALLVELO.x

}

function move_players(gameObjects) {
    document.addEventListener('keydown', (event) => {
        if (event.keyCode == 37 && gameObjects.player.position.x - 0.001 > -1.5)
            gameObjects.player.position.x -= 0.001
        if (event.keyCode == 39 && gameObjects.player.position.x + 0.001 < 1.5)
            gameObjects.player.position.x += 0.001
        if (event.keyCode == 65 && gameObjects.otherPlayer.position.x + 0.001 > -1.5)
            gameObjects.otherPlayer.position.x -= 0.001
        if (event.keyCode == 68 && gameObjects.otherPlayer.position.x + 0.001 < 1.5)
            gameObjects.otherPlayer.position.x += 0.001
    });
}

function game(player1, player2, scene, renderer, camera) {
    let gameObjects = create_objects_vs(scene)

    renderer.setAnimationLoop(animation);


    function animation() {
        move_players(gameObjects)
        check_gravity(gameObjects)
        if (!is_out_bound(gameObjects))
            check_collision(gameObjects)
            // BALLVELO.z += 0.01
        BALLVELO.y += 0.01
            // BALLVELO.x += 0.01
        renderer.render(scene, camera);
    }
    // return winner
}