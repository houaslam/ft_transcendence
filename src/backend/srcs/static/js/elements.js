export function endgame(message) {
    pop = document.createElement('div')
    pop.setAttribute('id', 'popup')
    pop.innerHTML = `
        <h4>YOU WON</h4>
        <p>by score</p>
        <button id="back">${message}</button>
    `
    return pop
}