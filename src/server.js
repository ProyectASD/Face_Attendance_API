import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import routerDocente from "./routes/docente_routes.js"
import routerEstudiante from "./routes/estudiante_routes.js"
import routerCurso from "./routes/curso_routes.js"
import routerAsistencia from "./routes/asistencia_routes.js"
import routerActuacion from "./routes/actuacion_routes.js"

//Inicializaciones
const app = express()
dotenv.config()

//Configuraciones
app.use(cors())
app.set("port", process.env.PORT || 3000)

//Middlewares
app.use(express.json())

//Rutas
app.get("/", (req, res)=>{
  res.send("Server On")
})
app.use("/api/docente", routerDocente)
app.use("/api/estudiante", routerEstudiante)
app.use("/api/curso", routerCurso)
app.use("/api/asistencia", routerAsistencia)
app.use("/api/actuacion", routerActuacion)

//Ruta no encontrada
app.use((req,res)=>{res.status(404).send("Endpoint no encontrado - 404")})


export default app
