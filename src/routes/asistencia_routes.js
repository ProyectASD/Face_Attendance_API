import { Router } from "express"
const router = Router()

import { 
    // crearAsistencia,
    visualizarAsistencias,
    visualizarAsistencia,
    actualizarAsistencia,
    eliminarAsistencia,
    visualizarReporte
 } from "../controllers/asistencia_controller.js"
import autenticarDocente from "../middlewares/autenticacionDocente.js"
import reconocimientoFacial from "../controllers/reconocimiento_facial.js"
import upload from "../middlewares/multer.js"


// router.post("/registro", autenticarDocente, crearAsistencia)
router.post("/visualizar", autenticarDocente, visualizarAsistencias)
router.get("/visualizar/:id", autenticarDocente, visualizarAsistencia)
router.put("/actualizar", autenticarDocente, actualizarAsistencia) 
router.delete("/eliminar/:id", autenticarDocente, eliminarAsistencia)
router.post("/reporte", autenticarDocente, visualizarReporte)

//IA
router.post("/reconocimiento-facial", upload.single("image"), reconocimientoFacial)

export default router