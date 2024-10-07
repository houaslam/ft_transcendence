function create_form() {
    form = document.createElement('form')
    form.setAttribute('id', 'tournam-regist')

    form.innerHTML = `
        <div class="player-set">

            <input name="player1" class="player-name">
            <p>VS</p>
            <input name="player2" class="player-name">
        </div>
        <div class="player-set">
            <input name="player3" class="player-name">
            <p>VS</p>
            <input name="player4" class="player-name">
        </div>

        <button id="start" type="submit">Start</button>

    `
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        let data = new FormData(form);
        let gameOptions = Object.fromEntries(data)
        form.remove()
        start(gameOptions)
    })

}

function start(gameOptions) {
    let players = []
    players.fromArray(gameOptions)
    console.log('')
}