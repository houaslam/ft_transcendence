import {start} from './game.js'




let vs = document.getElementById('VS')

vs.addEventListener('click', (e) =>{
	e.preventDefault()
	vs.remove()
	start()
})