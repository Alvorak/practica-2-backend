import { Router } from "express";
import { deleteEquipo, getEquipos, getEquipoWithId, postEquipo, putEquipo } from "../controller/equipo.controller.js";

const router = Router();

router.get("/", getEquipos);

router.get("/:id", getEquipoWithId);

router.post("/", postEquipo);

router.put("/:id", putEquipo);

router.delete("/:id", deleteEquipo);

export default router;