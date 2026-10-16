import type { EquipoT } from "../models/equipo.model.js";

export let equipos: EquipoT[] = [];

export const changeEquipo = (newEquipos: EquipoT[]) => {
    equipos = newEquipos;
}