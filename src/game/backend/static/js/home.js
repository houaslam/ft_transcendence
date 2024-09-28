import * as INVITE from './game.js'
import * as MULTI from './multiPlayer.js'

let vs = document.getElementById('VS')
let multi = document.getElementById('MULTI')

vs.addEventListener('click', (e) =>{
	e.preventDefault()
	vs.remove()
	
	INVITE.start()
})


vs.addEventListener('click', (e) =>{
	e.preventDefault()
	vs.remove()
	
	MULTI.start()
})