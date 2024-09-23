import {start} from './game.js'
import {settings} from './settings.js'




let vs = document.getElementById('VS')

vs.addEventListener('click', (e) =>{
	e.preventDefault()
	vs.remove()
	
	settings()
})