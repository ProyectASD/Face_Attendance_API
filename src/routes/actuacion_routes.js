import { Router } from "express"
const router = Router()

import { 
    // crearActuacion,
    visualizarActuacion,
    visualizarActuaciones,
    actualizarActuacion,
    actualizarActuaciones,
    eliminarActuacion,
    estudiantesPresentes
 } from "../controllers/actuacion_controller.js"

//autenticacion para docente 
//listar-estudiantes y registrar son para estudiante

//router.post("/registro", crearActuacion)
router.post("/visualizar", visualizarActuaciones)
router.post("/listar-estudiantes", estudiantesPresentes)

router.get("/visualizar/:id", visualizarActuacion)
router.put("/actualizar", actualizarActuaciones)
router.put("/actualizar/:id", actualizarActuacion)
router.delete("/eliminar/:id", eliminarActuacion)

export default router
