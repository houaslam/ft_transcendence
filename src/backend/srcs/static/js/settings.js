import {start} from './game.js'


export let gameOptions = {}

export function customizeFrom(){
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
	<label for="rounds" class="label">select count</label>
	<select name="rounds">
	<option value="">select </option>
	<option>10</option>
	<option>15</option>
	<option>20</option>
	<option>25</option>
	<option>30</option>
	</select>
	
	<button id="play" type="submit">PLAY</button>
	`
	
	form.addEventListener('submit', (e) =>{
		e.preventDefault()
		let data = new FormData(form);
		gameOptions = Object.fromEntries(data)
		history.pushState(null, null, '/ws/game');
		form.remove()
        start()
	})
	
	return form
}

export function settings(){
    let settings = customizeFrom()
    let canva = document.getElementById('canva')
    canva.append(settings)
}