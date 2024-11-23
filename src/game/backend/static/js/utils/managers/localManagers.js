import { MODE, WORLD } from "../../constants/engine.js"
import Logic from "../../utils/logic.js"
import physicsManager from "../../utils/managers/pysicsManage.js"
import inputManager from "../../utils/managers/inputManager.js"
import stateManager from '../../utils/managers/stateManage.js'
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.167.0/three.module.js'



export default class Local extends Logic {
	constructor( options ) {
        super( MODE.LOCAL, options )
		this.physics = new physicsManager( this.components )
		this.input = new inputManager( this.components )
		this.state = new stateManager( options )
		this.animationProgress = 0
	}

	setup(  ){
        super.setup(  )
		this.physics.setupBallCollisionEvent(  )
		this.cameraTarget = new THREE.Vector3(
			0,
			5,
			0
		);
		this.cameraInitial = new THREE.Vector3().copy(this.engine.camera.position);
	
	}

	update(  ){
		this.input.movePlayers(   )
		this.physics.checkWallCollision(  )
		this.physics.checkBallPositionForScore(  )
		this.physics.updateBallPosition(  )	
		super.update(  )
	}

	isGameover(  ){
		return this.state.isGameover( this.physics.score )
	}

	clean(){
		this.engine.clean(  )
	}

	animate(  resolve  ){
		let id = requestAnimationFrame( (  )=>this.animate( resolve ) )
		this.engine.world.step( WORLD.TIMESTAMP )
		
		if (this.animationProgress < 1){
			this.animationProgress += 0.01;
			this.engine.camera.position.lerpVectors(this.cameraInitial, this.cameraTarget, WORLD.TIMESTAMP)
			// this.engine.camera.position.z -= 0.1
			// this.engine.camera.position.x += 0.01
			// this.engine.camera.position.y +=0.005
			// this.engine.camera.rotation.y +=0.002
			// this.engine.camera.lookAt(0,0,0);
		}
		else{

			this.update(  )
			if (  this.isGameover(   )  ){
				cancelAnimationFrame( id )
				resolve(  )
			}
		}

		this.engine.renderer.render(  this.engine.scene, this.engine.camera  );
	}

	initialAnimation(){

	}
}