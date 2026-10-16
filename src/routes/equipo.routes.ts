import { Router } from "express";
import { deleteEquipo, getEquipos, getEquipoWithId, patchEquipo, postEquipo, putEquipo } from "../controller/equipo.controller.js";

const router = Router();

router.get("/", getEquipos);
router.get("/:id", getEquipoWithId);
router.post("/", postEquipo);
router.put("/:id", putEquipo);
router.patch("/:id", patchEquipo); //este extra no pedido
router.delete("/:id", deleteEquipo);

export default router;