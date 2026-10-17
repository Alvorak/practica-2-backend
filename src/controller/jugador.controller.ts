import type { Request, Response } from "express";
import { changeEquipo, equipos } from "../data/equipo.data.js";


export const getJugadoresEquipo = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const equipo = equipos.find(x => x.id === id);

    if (!equipo) {
        res.status(404).json({
            message: "Equipo no encontrado"
        });
        return;
    }

    res.json(equipo.jugadores);
}


export const postJugadorEquipo = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const equipo = equipos.find(x => x.id === id);

    if (!equipo) {
        res.status(404).json({
            message: "Equipo no encontrado"
        });
        return;
    }

    const nombre = req.body.nombre;
    const goles = Number(req.body.goles);

    if (!nombre?.trim?.() ||
        req.body.goles === undefined ||
        req.body.goles === null ||
        req.body.goles === "" ||
        goles < 0 || goles % 1 !== 0) {
        res.status(400).json({
            message: "Datos del jugador incorrectos"
        });
        return;
    }

    const jugadores = equipos.flatMap(x => x.jugadores);

    const nuevoJugador = {
        id: Math.random(),
        nombre,
        goles
    };

    changeEquipo(equipos.map(x =>
        x.id === id
            ? { ...x, jugadores: [...x.jugadores, nuevoJugador] }
            : x
    ));

    res.status(201).json({
        message: "Jugador creado correctamente",
        jugador: nuevoJugador
    });
}


export const deleteJugadorEquipo = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const jugadorId = Number(req.params.jugadorId);

    const equipo = equipos.find(x => x.id === id);

    if (!equipo) {
        res.status(404).json({
            message: "Equipo no encontrado"
        });
        return;
    }

    const jugador = equipo.jugadores.find(x => x.id === jugadorId);

    if (!jugador) {
        res.status(404).json({
            message: "Jugador no encontrado en este equipo"
        });
        return;
    }

    changeEquipo(equipos.map(x =>
        x.id === id
            ? { ...x, jugadores: x.jugadores.filter(j => j.id !== jugadorId) }
            : x
    ));

    res.json({
        message: `Jugador con id: ${jugadorId} eliminado`
    });
}


export const moverJugadorEquipos = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const jugadorId = Number(req.params.jugadorId);
    const equipoDestinoId = Number(req.body.equipoDestinoId);

    const equipo = equipos.find(x => x.id === id);

    if (!equipo) {
        res.status(404).json({
            message: "Equipo de origen no encontrado"
        });
        return;
    }

    const jugador = equipo.jugadores.find(x => x.id === jugadorId);

    if (!jugador) {
        res.status(404).json({
            message: "Jugador no encontrado en este equipo"
        });
        return;
    }

    if (!equipoDestinoId) {
        res.status(400).json({
            message: "ID del equipo de destino incorrecto"
        });
        return;
    }

    if (id === equipoDestinoId) {
        res.status(400).json({
            message: "El jugador ya pertenece a este equipo"
        });
        return;
    }

    const equipoDestino = equipos.find(x => x.id === equipoDestinoId);

    if (!equipoDestino) {
        res.status(404).json({
            message: "Equipo de destino no encontrado"
        });
        return;
    }

    changeEquipo(equipos.map(x =>
        x.id === id
            ? { ...x, jugadores: x.jugadores.filter(j => j.id !== jugadorId) }
            : x.id === equipoDestinoId
                ? { ...x, jugadores: [...x.jugadores, jugador] }
                : x
    ));

    res.json({
        message: `Jugador con id: ${jugadorId} movido correctamente`,
        jugador: jugador
    });
}