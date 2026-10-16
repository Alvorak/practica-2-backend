import type { EquipoT } from "../models/equipo.model.js";

export let equipos: EquipoT[] = [
    {
        id: 1,
        nombre: "La Horda",
        division: "Azeroth",
        jugadoresE: [
            { id: 1, nombre: "Thrall", goles: 30 },
            { id: 2, nombre: "Gul'dan", goles: 35 },
            { id: 3, nombre: "Garrosh", goles: 25 }
        ]
    },
    {
        id: 2,
        nombre: "La Alianza",
        division: "Azeroth",
        jugadoresE: [
            { id: 4, nombre: "Arthas", goles: 40 },
            { id: 5, nombre: "Varian", goles: 28 },
            { id: 6, nombre: "Jaina", goles: 22 }
        ]
    }
];

export const changeEquipo = (newEquipos: EquipoT[]) => {
    equipos = newEquipos;
}