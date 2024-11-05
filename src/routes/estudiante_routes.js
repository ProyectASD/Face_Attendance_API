import { Router } from "express"
const router = Router()

import { 
    confirmarEmailEstudiante, 
    confirmarRecuperarPassword, 
    ingresarCodigo, 
    loginEstudiante, 
    modificarPerfilEstudiante, 
    nuevaPasswordEstudiante, 
    recuperarPasswordEstudiante, 
    registroEstudiante, 
    visualizarActuaciones, 
    visualizarAsistencias, 
    visualizarCurso, 
    visualizarPerfilEstudiante} from "../controllers/estudiante_controller.js"
import autenticarEstudiante from "../middlewares/autenticacionEstudiante.js"

import multer from "multer"
const upload = multer()
       


//Rutas publicas
router.post("/registro-estudiante",upload.single("image"), registroEstudiante) //variable image del formulario 
router.get("/confirmar/:token", confirmarEmailEstudiante)
router.post("/login", loginEstudiante)
router.post("/recuperar-password", recuperarPasswordEstudiante)
router.get("/recuperar-password/:token", confirmarRecuperarPassword)
router.post("/nueva-password/:token", nuevaPasswordEstudiante)


//Rutas privadas
router.put("/modificar-perfil/:id", upload.single("image"), autenticarEstudiante, modificarPerfilEstudiante)
//aqui va el de visualizar peril
router.get("/perfil", autenticarEstudiante, visualizarPerfilEstudiante)
router.post("/ingresar-codigo", autenticarEstudiante, ingresarCodigo)
router.get("/visualizar-cursos",autenticarEstudiante,  visualizarCurso)
router.post("/visualizar-asistencias",autenticarEstudiante,  visualizarAsistencias)
router.post("/visualizar-actuaciones", autenticarEstudiante, visualizarActuaciones)



export default router