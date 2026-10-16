import type { JugadorT } from "./jugaddor.model.js"


export type EquipoT = {
    id: number,
    nombre: string,
    division: string,
    jugadores: JugadorT[]
}
