
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { customizeFrom} from './settings.js'
import { endgame,  score, updateScore} from './elements.js';

function socketSetup() {
	let url = `ws://${window.location.host}/ws/game/`
	const gameSocket = new WebSocket(url)
	
	gameSocket.onopen = (e)=> {
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

export function start() {
	console.log("AGAIN");
	
	let canva = document.getElementById("canva");

	const gameSocket = socketSetup()

	let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer();
	renderer.setAnimationLoop(animation);
	const scene = new THREE.Scene();
	gameSetup(scene, camera, renderer)
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
	let scorePanel = score(0, 0)
	canva.append(scorePanel)
	function animation() {
		gameSocket.onmessage = (e) => {

			let dataJson = JSON.parse(e.data)
			let dataType = dataJson['type']

			switch (dataType) 
			{
				case "coordinates":
					console.log("COOR", canva.innerHTML);
					
					let coordinates = dataJson['data']
					ball.position.fromArray(coordinates.ball.position)
					player.position.fromArray(coordinates.player.position)
					otherPlayer.position.fromArray(coordinates.otherPlayer.position)
					updateScore(scorePanel,coordinates.player.score, coordinates.otherPlayer.score)
					break;
				
				case "endGame" :
					console.log("END", canva.innerHTML);
					let pop = endgame(dataJson['state'], dataJson['by']);
					canva.append(pop)

					pop.style.transform = " translate(-50%, -50%) scale(1) "
					let backHome = document.getElementById("back")
					backHome.addEventListener('click', (e) => {
						window.location.href = '/'
					})

				case 'gameInfo':
					console.log("FORM", canva.innerHTML);
					let form = customizeFrom(gameSocket)
					canva.append(form)

				default:
					break;
			}
			ball.rotation.x += 0.1
		}
		renderer.render(scene, camera);
	}


}