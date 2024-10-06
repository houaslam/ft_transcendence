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


export function updateScore(html, firstScore, secondScore) {
    const imageSrc = "{% static 'images/image.png' %}"
    html.innerHTML = `
        <div class="player-info">
            <div class="player">
                <p>hajar Ouaslam</p>
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
	`
}