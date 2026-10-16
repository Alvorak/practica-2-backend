import type { JugadorT } from "../models/jugaddor.model.js";

export let jugadores: JugadorT[] = [];


export const changeJugador = (jugadorIn: JugadorT[]) => {
    jugadores = jugadorIn;
}