import { Router } from "express";
import { getJugadoresEquipo, postJugadorEquipo, deleteJugadorEquipo, moverJugadorEquipos } from "../controller/jugador.controller.js";

const router = Router();

router.get("/:id/jugadores", getJugadoresEquipo);
router.post("/:id/jugadores", postJugadorEquipo);
router.delete("/:id/jugadores/:jugadorId", deleteJugadorEquipo);
router.patch("/:id/jugadores/:jugadorId/mover", moverJugadorEquipos);

export default router;