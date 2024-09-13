import { Router } from "express"
const router = Router()

import { 
    actualizarCurso,
    crearCurso, 
    eliminarCurso, 
    visualizarCursoDocente, 
    visualizarCursosDocente } from "../controllers/curso_controller.js"

import autenticarDocente from "../middlewares/autenticacionDocente.js"

router.post("/registro", autenticarDocente,  crearCurso)
router.get("/visualizar", autenticarDocente, visualizarCursosDocente)
router.get("/visualizar/:id", autenticarDocente,  visualizarCursoDocente)
router.put("/actualizar/:id", autenticarDocente, actualizarCurso)
router.delete("/eliminar/:id",autenticarDocente, eliminarCurso)


export default router