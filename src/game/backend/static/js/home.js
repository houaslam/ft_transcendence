import * as INVITE from './game.js'
import * as MULTI from './multiPlayer.js'
import * as TOURN from './tournament.js'
import * as LOCAL from './local.js'
import * as RPS from './rps.js'

let vs = document.getElementById('VS')
let multi = document.getElementById('MULTI')
let local = document.getElementById('LOCAL')
let tour = document.getElementById('TOURN')
let rps = document.getElementById('RPS')

vs.addEventListener('click', (e) => {
    e.preventDefault()
    vs.remove()
    multi.remove()
    local.remove()
    tour.remove()
    rps.remove()

    INVITE.start()
})


multi.addEventListener('click', (e) => {
    e.preventDefault()
    vs.remove()
    multi.remove()
    local.remove()
    tour.remove()
    rps.remove()

    MULTI.start()
})


tour.addEventListener('click', (e) => {
    e.preventDefault()
    vs.remove()
    multi.remove()
    local.remove()
    tour.remove()
    rps.remove()

    TOUR.start()
})

rps.addEventListener('click', (e) => {
    e.preventDefault()
    vs.remove()
    multi.remove()
    local.remove()
    tour.remove()
    rps.remove()

    RPS.start()
})

local.addEventListener('click', (e) => {
    e.preventDefault()
    vs.remove()
    multi.remove()
    local.remove()
    tour.remove()
    rps.remove()

    LOCAL.start()
})