import * as INVITE from './game.js'
import * as MULTI from './multiPlayer.js'

let vs = document.getElementById('VS')
let multi = document.getElementById('MULTI')

vs.addEventListener('click', (e) =>{
	e.preventDefault()
	vs.remove()
	multi.remove()
	
	INVITE.start()
})


multi.addEventListener('click', (e) =>{
	e.preventDefault()
	multi.remove()
	vs.remove()
	
	MULTI.start()
})