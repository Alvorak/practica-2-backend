import type { Request, Response } from "express";
import { changeJugador, jugadores } from "../data/jugador.data.js";

export const getJugadores = (
    req: Request,
    res: Response
) => {
    res.json(jugadores);
}

const findJugador = (id: number, res: Response) => {
    const jugador = jugadores.find(x => x.id === id);

    if (!jugador) {
        res.status(404).json({
            message: "Jugador no encontrado"
        });
        return;
    }

    return jugador;
}

export const getJugadorWithId = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const jugador = findJugador(id, res);

    if (!jugador) return;

    res.json(jugador);
}

export const deleteJugador = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const jugador = findJugador(id, res);

    if (!jugador) return;

    changeJugador(jugadores.filter(x => x.id !== id));

    res.json({
        message: `Jugador con id: ${id} eliminado`
    });
}

export const putJugador = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const jugador = findJugador(id, res);

    if (!jugador) return;

    const updatedJugador = { ...req.body, id };

    changeJugador(jugadores.map(x => x.id === id ? updatedJugador : x));

    res.json({
        message: `Jugador con id: ${id} actualizado`,
        jugador: updatedJugador
    });
}

export const postJugador = (
    req: Request,
    res: Response
) => {
    const nuevoJugador = {
        ...req.body,
        id: Math.random()
    };

    changeJugador([...jugadores, nuevoJugador]);

    res.status(201).json({
        message: "Jugador creado correctamente",
        jugador: nuevoJugador
    });
}

export const patchJugador = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const jugador = findJugador(id, res);

    if (!jugador) return;

    const updatedJugador = { ...jugador, ...req.body, id };

    changeJugador(jugadores.map(x => x.id === id ? updatedJugador : x));

    res.json({
        message: `Jugador con id: ${id} actualizado`,
        jugador: updatedJugador
    });
}