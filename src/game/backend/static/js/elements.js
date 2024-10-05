// import {gameOptions} from './game.js'

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

export function score(firstScore, secondScore) {
    let score = document.createElement('div')
    score.setAttribute('id', 'scorePanel')
    const imageSrc = "{% static 'images/image.png' %}"
    score.innerHTML = `
    <header id="canva">

        <div class="players">

            <div class="player-info">
                <div class="player">
                    <img src=${imageSrc} alt="player-profile" class="profile-pic">
                    <p>hajar Ouaslam</p>
                </div>
                <h1>${firstScore}</h1>
            </div>

            <h1>VS</h1>

            <div class="player-info">
                <div class="player">
                    <img src=${imageSrc} alt="player-profile" class="profile-pic">
                    <p>kaouthar kouaz</p>
                </div>
                <h1>${secondScore}</h1>
            </div>

    </header>
	`
    return score
}


export function time(elapsedTime) {
    let time = document.createElement('div')
    time.setAttribute('id', 'timePanel')
    time.innerHTML = `
		<h1>TIME</h1>
		<p> ${elapsedTime} second</p>
	`
    return time
}

export function updateTime(html, elapsedTime) {
    html.innerHTML = `
		<h1>TIME</h1>
		<p> ${elapsedTime} second</p>
	`
        // return time
}


export function updateScore(html, firstScore, secondScore) {
    const imageSrc = "{% static 'images/image.png' %}"
    html.innerHTML = `
    <header id="canva">

        <div class="players">

            <div class="player-info">
                <div class="player">
                    <p>hajar ouaslam</p>
                </div>
                <h1>${firstScore}</h1>
            </div>

            <h1>VS</h1>

            <div class="player-info">
                <div class="player">
                    <p>kaouthar kouaz</p>
                </div>
                <h1>${secondScore}</h1>
            </div>

    </header>
	`
}