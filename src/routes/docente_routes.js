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
    eliminarEstudiante
} from "../controllers/docente_controller.js"
import autenticar from "../middlewares/autenticacion.js"
//import autenticarDocente from "../middlewares/autenticacionDocente.js"

//Rutas publicas
router.post("/registro-docente", registroDocente)
router.get("/confirmar/:token", confirmarEmailDocente)
router.post("/login", loginDocente)
router.post("/recuperar-password", recuperarPasswordDocente)
router.get("/recuperar-password/:token", confirmarRecuperarPassword)
router.post("/nueva-password/:token", nuevaPasswordDocente)


//Rutas privadas
router.put("/modificar-perfil/:id", autenticar, modificarPerfilDocente)

router.post("/crear/estudiante", autenticar , crearEstudiante)
router.get("/visualizar/estudiantes", autenticar , visualizarEstudiantes)
router.get("/visualizar/estudiante/:id", autenticar, visualizarEstudiante)
router.put("/actualizar/estudiante/:id", autenticar, actualizarEstudiante)
router.delete("/eliminar/estudiante/:id", autenticar, eliminarEstudiante)



export default router