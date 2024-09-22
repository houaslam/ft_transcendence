
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// import {gameOptions} from './home.js'


let gameOptions = {}

export function customizeFrom(gameSocket){
	let form = document.createElement("form")
	form.setAttribute('id', 'custom-form')
	form.innerHTML = `
	<div id="gameType">
	<p class="label">choose game Type</p>
	<div>
	<input type="radio" name="type" value="remote">
	<label for="remote">remote</label>
	</div>
	<div>
	<input type="radio" name="type" value="local">
	<label for="local">local</label>
	</div>
	</div>
	
	<div id="gameOut">
	<p class="label">choose game Out</p>
	<div>
	<input type="radio" name="gameout" value="time">
	<label for="time">time</label>
	</div>
	<div>
	<input type="radio" name="gameout" value="score">
	<label for="local">score</label>
	</div>
	</div>
	
	<div>
	<label for="rounds" class="label">select round count</label>
	<select name="rounds">
	<option value="">select round</option>
	<option>1</option>
	<option>2</option>
	<option>3</option>
	<option>4</option>
	<option>5</option>
	</select>
	
	<button id="play" type="submit">PLAY</button>
	`
	
	form.addEventListener('submit', (e) =>{
		e.preventDefault()
		let data = new FormData(form);
		gameOptions = Object.fromEntries(data)
		history.pushState(null, null, '/ws/game');
		form.remove()
		gameSocket.send(JSON.stringify({
			'type': 'gameInfo',
			'data': gameOptions
		}))
	})
	
	return form
}

export function endgame(state, by) {
	let pop = document.createElement('div')
	pop.setAttribute('id', 'popup')
	
	let real_state = ""
	if (state == "W")
		real_state = "WON"
	else 
		real_state = "LOST"
	pop.innerHTML = `
		<h4>YOU ${real_state}</h4>
		<p>by ${by}</p>
		<button id="back">BACK HOME</button>
	`
	return pop
}

function socketSetup() {
	let url = `ws://${window.location.host}/ws/game/`
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

function setup(scene, camera, renderer) {
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

export function start() {
	let canva = document.getElementById("canva");
	const gameSocket = socketSetup()

	let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer();
	renderer.setAnimationLoop(animation);
	const scene = new THREE.Scene();
	setup(scene, camera, renderer)
	let ball, player, otherPlayer, plane;

	//PLANE
	plane = new THREE.Mesh(new THREE.BoxGeometry(3, .2, 5), new THREE.MeshLambertMaterial({ color: 0x5F1584 }))

	// 	BALL
	ball = new THREE.Mesh(new THREE.SphereGeometry(.2, 32, 15), new THREE.MeshLambertMaterial({ color: 0xD43ADF }))
	ball.position.set(0, .8, 0)

	// PLAYER
	player = new THREE.Mesh(new THREE.BoxGeometry(1, .3, .3), new THREE.MeshLambertMaterial({ color: 0x8C96ED }))
	player.position.set(0, .4, 2.7)


	//OTHERPLAYER
	otherPlayer = new THREE.Mesh(new THREE.BoxGeometry(1, .3, .3), new THREE.MeshLambertMaterial({ color: 0xE4E6FB }))
	otherPlayer.position.set(0, .4, -2.7)


	// SCENE
	scene.add(plane);
	scene.add(player);
	scene.add(otherPlayer);
	scene.add(ball);

	// ANIMATION 
	function animation() {
		gameSocket.onmessage = function(e) {

			let dataJson = JSON.parse(e.data)

			if (dataJson['type'] == "coordinates") {

				let coordinates = dataJson['data']
				ball.position.fromArray(coordinates.ball.position)
				player.position.fromArray(coordinates.player.position)
				otherPlayer.position.fromArray(coordinates.otherPlayer.position)

			} else if (dataJson['type'] == "endGame") {
				let pop = endgame(dataJson['state'], dataJson['by']);
				canva.append(pop)

				pop.style.transform = " translate(-50%, -50%) scale(1) "
				let backHome = document.getElementById("back")
				backHome.addEventListener('click', (e) => {
					window.location.href = '/'
				})
			}
			else if (dataJson['type'] == 'gameInfo'){
				let form = customizeFrom(gameSocket)
				canva.append(form)
			}
			ball.rotation.x += 0.1

		}
		renderer.render(scene, camera);
	}
}