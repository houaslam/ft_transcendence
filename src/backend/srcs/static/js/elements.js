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

export function score(firstScore , secondScore){
	let score = document.createElement('div')
	score.setAttribute('id', 'scorePanel')
	score.innerHTML = `
		<h1>SCORE</h1>
		<p>first Player : ${firstScore}</p>
		<p>second Player : ${secondScore}</p>
	`
	return score
}