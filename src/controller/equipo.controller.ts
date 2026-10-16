import type { Request, Response } from "express";
import { changeEquipo, equipos } from "../data/equipo.data.js";

export const getEquipos = (
    req: Request,
    res: Response
) => {
    res.json(equipos);
}

const findEquipo = (id: number, res: Response) => {

    const equipo = equipos.find(x => x.id === id);

    if (!equipo) {
        res.status(404).json({
            message: "Equipo no encontrado"
        });
        return;
    }

    return equipo;
}

export const getEquipoWithId = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const equipo = findEquipo(id, res);

    if (!equipo) return; // asi return con res de find

    res.json(equipo);
}

export const deleteEquipo = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const equipo = findEquipo(id, res);

    if (!equipo) return; // asi return con res de find

    changeEquipo(equipos.filter(x => x.id !== id));

    res.json({
        message: `Equipo con id: ${id} eliminado`
    });
}


export const putEquipo = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const equipo = findEquipo(id, res);

    if (!equipo) return; // asi return con res de find // asi return con res de find

    const { nombre, division } = req.body;

    if (typeof nombre !== "string" || !nombre.trim() ||
        typeof division !== "string" || !division.trim()) {
        res.status(400).json({
            message: "Nombre o división incorrectos"
        });
        return;
    }

    const updatedEquipo = {
        ...equipo,
        nombre,
        division
    };

    changeEquipo(equipos.map(x => x.id === id ? updatedEquipo : x));

    res.json({
        message: `Equipo con id: ${id} actualizado`,
        equipo: updatedEquipo
    });
}


//puede venir equipo con jugadores dentro?
export const postEquipo = (
    req: Request,
    res: Response
) => {
    const { nombre, division } = req.body;

    if (typeof nombre !== "string" || !nombre.trim() ||
        typeof division !== "string" || !division.trim()) {
        res.status(400).json({
            message: "Nombre o división incorrectos"
        });
        return;
    }

    const nuevoEquipo = {
        id: Math.random(),
        nombre,
        division,
        jugadoresE: []
    };

    changeEquipo([...equipos, nuevoEquipo]);

    res.status(201).json({
        message: "Equipo creado correctamente",
        equipo: nuevoEquipo
    });
}

export const patchEquipo = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const equipo = findEquipo(id, res);

    if (!equipo) return; //asi con return con res de find

    const { nombre, division } = req.body;

    if ((nombre !== undefined && (typeof nombre !== "string" || !nombre.trim())) ||
        (division !== undefined && (typeof division !== "string" || !division.trim()))) {
        res.status(400).json({
            message: "Nombre o división incorrectos"
        });
        return;
    }

    const updatedEquipo = {
        ...equipo,
        nombre: nombre ?? equipo.nombre,
        division: division ?? equipo.division
    };

    changeEquipo(equipos.map(x => x.id === id ? updatedEquipo : x));

    res.json({
        message: `Equipo con id: ${id} actualizado`,
        equipo: updatedEquipo
    });
}