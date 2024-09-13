import { Router } from "express"
const router = Router()

import { 
    confirmarEmailEstudiante, 
    confirmarRecuperarPassword, 
    loginEstudiante, 
    modificarPerfilEstudiante, 
    nuevaPasswordEstudiante, 
    recuperarPasswordEstudiante, 
    registroEstudiante } from "../controllers/estudiante_controller.js"
import autenticar from "../middlewares/autenticacion.js"


//Rutas publicas
router.post("/registro-estudiante", registroEstudiante)
router.get("/confirmar/:token", confirmarEmailEstudiante)
router.post("/login", loginEstudiante)
router.post("/recuperar-password", recuperarPasswordEstudiante)
router.get("/recuperar-password/:token", confirmarRecuperarPassword)
router.post("/nueva-password/:token", nuevaPasswordEstudiante)


//Rutas privadas
router.put("/modificar-perfil/:id", autenticar, modificarPerfilEstudiante)


export default router