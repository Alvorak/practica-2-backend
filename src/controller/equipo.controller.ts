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

    if (!equipo) return;

    res.json(equipo);
}

export const deleteEquipo = (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const equipo = findEquipo(id, res);

    if (!equipo) return;

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

    if (!equipo) return;

    const updatedEquipo = { ...req.body, id };

    changeEquipo(equipos.map(x => x.id === id ? updatedEquipo : x));

    res.json({
        message: `Equipo con id: ${id} actualizado`,
        equipo: updatedEquipo
    });
}

export const postEquipo = (
    req: Request,
    res: Response
) => {
    const nuevoEquipo = {
        ...req.body,
        id: Math.random()
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

    if (!equipo) return;

    const updatedEquipo = { ...equipo, ...req.body, id };

    changeEquipo(equipos.map(x => x.id === id ? updatedEquipo : x));

    res.json({
        message: `Equipo con id: ${id} actualizado`,
        equipo: updatedEquipo
    });
}