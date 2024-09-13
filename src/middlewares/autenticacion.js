import  jwt  from "jsonwebtoken"
import Docentes from "../models/docentes.js"
import Estudiantes from "../models/estudiantes.js"

const autenticar = async(req, res, next)=>{

    const token = req.headers.authorization
    if(!token) return res.status(404).json({msg: "Lo sentimos primero debe proporcionar un token"})

    const {authorization} = req.headers
    try {
        const {id, rol} = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET)
        if(rol === "docente"){
            req.docente = await Docentes.findById(id).lean()
            next()
        } else if(rol === "estudiante"){
            req.estudiante = await Estudiantes.findById(id).lean()
            next()
        }
    } catch (error) {
        const e = new Error("Error al confirmar token")
        return res.status(401).json({msg: e.message})
    }
}

export default autenticar