// import {gameOptions} from './game.js'

export function customizeFrom(gameSocket){
	let form = document.createElement("form")
	form.setAttribute('id', 'custom-form')
	form.innerHTML = `
	<div id="gameOut">
	<p class="label">choose game Out</p>
	<div>
	<input type="radio" name="gameout" value="time" checked>
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
	<option>10 </option>
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
	document.getElementById('canva').append(form)
	
	return form
}


export function endgame(data) {
    let pop = document.createElement('div')
    pop.setAttribute('id', 'popup')

    let real_state = ""
    if (data.state == "W")
        real_state = "WON"
    else
        real_state = "LOST"
    pop.innerHTML = `
            <h4>YOU ${real_state}</h4>
            <p>by ${data.by}</p>
            <button id="back">BACK HOME</button>
        `
    return pop
}

export function score(firstScore, secondScore) {
    let score = document.createElement('div')
    score.setAttribute('id', 'players')
    const imageSrc = "{% static 'images/image.png' %}"
    score.innerHTML = `
        <div class="player-info">
            <div class="player">
            <img src="${imageUrl}" alt="Player Image" class='profile-pic'>
                <p>hajar Ouaslam</p>
            </div>
            <h1>${firstScore}</h1>
        </div>

        <h1>VS</h1>

        <div class="player-info">
            <img src="${imageUrl}" alt="Player Image" class='profile-pic'>
            <div class="player">
                <p>kaouthar kouaz</p>
            </div>
            <h1>${secondScore}</h1>
        </div>
	`
    return score
}


export function time(elapsedTime) {
    let time = document.createElement('div')
    time.setAttribute('id', 'timePanel')
    time.innerHTML = `
        <div class="container">
            <div class="circular-progress">
                <span class="progress-value">0 second</span>
            </div>
        </div>
	`
    return time
}

// ALL UPDATES SHOULD BE INDEPENDANT 

export function updateTime(elapsedTime) {
    let circularProgress = document.querySelector(".circular-progress"),
        progressValue = document.querySelector(".progress-value");
    let progressStartValue = elapsedTime,
        progressEndValue = 10
    let progressPercentage = (progressStartValue / progressEndValue) * 100;
    progressValue.textContent = `${progressStartValue} s`;
    if (progressStartValue > progressEndValue)
        circularProgress.style.background = `conic-gradient(red ${progressPercentage * 3.6}deg, black 0deg)`;
    else
        circularProgress.style.background = `conic-gradient(#7d2ae8 ${progressPercentage * 3.6}deg, black 0deg)`;

}


export function updateScore( gameObjects, data, mode) {
    const imageSrc = "{% static 'images/image.png' %}"
    let html = document.getElementById('players')
	html.style.display = 'flex'
    if (mode == 'game'){
        html.innerHTML = `
            <div class="player-info">
                <div class="player">
                    <p>hajar Ouaslam</p>
                </div>
                <h1>${data.player.score}</h1>
            </div>

            <h1>VS</h1>

            <div class="player-info">
                <div class="player">
                    <p>kaouthar kouaz</p>
                </div>
                <h1>${data.otherPlayer.score}</h1>
            </div>
        `
    }
    else if (mode == 'multi'){
        html.innerHTML = `
        <div class="player-info">
            <div class="player">
                <p>hajar Ouaslam</p>
            </div>
            <h1>${data.player1.score}</h1>
        </div>


        <div class="player-info">
            <div class="player">
                <p>kaouthar kouaz</p>
            </div>
            <h1>${data.player2.score}</h1>
        </div>

        <div class="player-info">
            <div class="player">
                <p>ferdaous adermouch</p>
            </div>
            <h1>${data.player3.score}</h1>
        </div>

        <div class="player-info">
            <div class="player">
                <p>houda obenabad</p>
            </div>
            <h1>${data.player4.score}</h1>
        </div>
    `
    }

}


export function updateEndGame(data){
    let endGame = endgame(data);
    document.getElementById('canva').append(endGame)
    endGame.style.transform = " translate(-50%, -50%) scale(1) "
	let backHome = document.getElementById("back")
    backHome.addEventListener('click', (e) => {
        window.location.href = '/'
    })
}