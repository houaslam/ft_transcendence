// export let gameOptions = {}

export function customizeFrom(gameSocket){
	let form = document.createElement("form")
	form.setAttribute('id', 'custom-form')
	form.innerHTML = `
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
	<label for="counts" class="label">select count</label>
	<select name="counts">
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
		let gameOptions = Object.fromEntries(data)
		// history.pushState(null, null, '/ws/game')
		gameSocket.send(JSON.stringify({
			'type' : 'gameSettings',
			'data': gameOptions
		}))
		form.remove()
	})
	
	return form
}
