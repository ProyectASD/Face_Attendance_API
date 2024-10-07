import { Router } from "express"
const router = Router()

import { 
    registroDocente,
    loginDocente,
    modificarPerfilDocente,
    recuperarPasswordDocente,
    confirmarEmailDocente,
    nuevaPasswordDocente,
    confirmarRecuperarPassword,
    crearEstudiante,
    visualizarEstudiantes,
    visualizarEstudiante,
    actualizarEstudiante,
    eliminarEstudiante,
    actualizarDatosPersonalesEst
} from "../controllers/docente_controller.js"
import autenticarDocente from "../middlewares/autenticacionDocente.js"

//Rutas publicas
router.post("/registro-docente", registroDocente)
router.get("/confirmar/:token", confirmarEmailDocente)
router.post("/login", loginDocente)
router.post("/recuperar-password", recuperarPasswordDocente)
router.get("/recuperar-password/:token", confirmarRecuperarPassword)
router.post("/nueva-password/:token", nuevaPasswordDocente)


//Rutas privadas
router.put("/modificar-perfil/:id", autenticarDocente, modificarPerfilDocente)

router.post("/crear/estudiante", autenticarDocente , crearEstudiante)
router.post("/visualizar/estudiantes", autenticarDocente , visualizarEstudiantes)
router.get("/visualizar/estudiante/:id", autenticarDocente, visualizarEstudiante)
router.put("/actualizar/estudiante/:id", autenticarDocente, actualizarEstudiante)
router.delete("/eliminar/estudiante/:id", autenticarDocente, eliminarEstudiante)
router.patch("/actualizar-datos-personales/estudiante/:id", autenticarDocente, actualizarDatosPersonalesEst)


export default router