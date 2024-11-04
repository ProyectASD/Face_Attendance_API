import { Router } from "express"
const router = Router()

import { 
    // crearActuacion,
    visualizarActuacion,
    visualizarActuaciones,
    actualizarActuacion,
    actualizarActuaciones,
    eliminarActuacion,
    estudiantesPresentes,
    visualizarReporte
 } from "../controllers/actuacion_controller.js"
import autenticarDocente from "../middlewares/autenticacionDocente.js"

//autenticacion para docente 
//listar-estudiantes y registrar son para estudiante

//router.post("/registro", crearActuacion)
router.post("/visualizar",autenticarDocente, visualizarActuaciones)
router.post("/listar-estudiantes", autenticarDocente ,estudiantesPresentes)

router.get("/visualizar/:id", autenticarDocente, visualizarActuacion)
router.put("/actualizar", autenticarDocente,  actualizarActuaciones)
router.put("/actualizar/:id",autenticarDocente,   actualizarActuacion)
router.delete("/eliminar/:id", autenticarDocente, eliminarActuacion)

router.post("/reporte", autenticarDocente,  visualizarReporte)


export default router
