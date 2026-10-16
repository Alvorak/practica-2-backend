import type { JugadorT } from "../models/jugaddor.model.js";

export let jugadores: JugadorT[] = [
    {
        id: 1,
        nombre: "Thrall",
        goles: 30
    },
    {
        id: 2,
        nombre: "Gul'dan",
        goles: 35
    },
    {
        id: 3,
        nombre: "Garrosh",
        goles: 25
    },
    {
        id: 4,
        nombre: "Arthas",
        goles: 40
    },
    {
        id: 5,
        nombre: "Varian",
        goles: 28
    },
    {
        id: 6,
        nombre: "Jaina",
        goles: 22
    }
];


export const changeJugador = (jugadorIn: JugadorT[]) => {
    jugadores = jugadorIn;
}