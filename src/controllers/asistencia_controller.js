import Asistencia from "../models/asistencias.js"
import mongoose from "mongoose"
//Gestionar asistencias

//Crear asistencia
const crearAsistencia = async(req, res)=>{
    const {estudiante} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        const asistenciaEncontrada = await Asistencia.findOne({estudiante})
        if(asistenciaEncontrada) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})


        res.status(200).json({msg: "crear sistencia"})
        
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Visualizar asistencias
const visualizarAsistencias = async(req, res)=>{
    try {
        res.status(200).json({msg: "visualizar asistencias"})
        
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Visualizar asistencia
const visualizarAsistencia = async(req, res)=>{
    try {
        res.status(200).json({msg: "visualizar una asistencia"})
        
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Actualizar asistencia
const actualizarAsistencia = async(req, res)=>{
    try {
        res.status(200).json({msg: "actualizar asistencia"})
        
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Eliminar asistencia
const eliminarAsistencia = async(req, res)=>{
    try {
        res.status(200).json({msg: "eliminar asistencia"})
        
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}


// //Gestionar cursos
//     //Crear curso
//     const crearAsistencia = async(req, res) =>{
//         const {codigo} = req.body
//         try {
//             if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
//             const cursoEncontrado = await Cursos.findOne({codigo})
//             if(cursoEncontrado) return res.status(404).json({msg: "Lo sentimos pero la asistencia ya se encuentra registrada"})
    
//             const nuevoCurso = new Cursos(req.body)
//             await nuevoCurso.save()
    
//             res.status(200).json({msg: "Asistencia creada con éxito"})
//         } catch (error) {
//             res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
//         }
//     }
    
//         //Visualizar cursos
    
//     const visualizarAsistenciasDocente = async(req, res) =>{
//         try {
//             const cursosEncontrado = await Cursos.find()
//             if(cursosEncontrado.length === 0) return res.status(400).json({msg: "Lo sentimos pero no se encuentraron cursos registrados"})
//             res.status(200).json(cursosEncontrado)
//         } catch (error) {
//             res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
//         }
//     }
    
//         //Visualizar curso
    
//     const visualizarAsistenciaDocente = async(req, res) =>{
//         const {id} = req.params
//         try {
//             if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos pero el id no es válido"})
//             const cursoEncontrado = await Cursos.findById(id)
//             if(!cursoEncontrado) return res.status(400).json({msg: "Lo sentimos pero el curso no se encuentra registrado"})
//             res.status(200).json(cursoEncontrado)
//         } catch (error) {
//             res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
//         }
//     }
    
//         //Actualizar curso
    
//     const actualizarAsistencia = async(req, res) =>{
//         const {id} = req.params
//         try {
//             if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos pero el id no es válido"})
//             if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
    
//             const cursoEncontrado = await Cursos.findByIdAndUpdate(id, req.body)
//             if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos pero el curso no se encuentra registrado"})
//             await cursoEncontrado.save()
//             res.status(200).json({msg: "Curso actualizado con éxito"})
//         } catch (error) {
//             res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
//         }
//     }
    
//         //Eliminar curso
//     const eliminarAsistencia = async(req, res) =>{
//         const {id} = req.params
//         try {
//             if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos pero el id no es válido"})
//             const cursoEncontrado = await Cursos.findByIdAndDelete(id)
//             if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos pero el curso no se encuentra registrado"})
//             res.status(200).json({msg: "Curso eliminado con éxito"})
//         } catch (error) {
//             res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
//         }
//     }
    
// export {
//     crearCurso,
//     visualizarCursoDocente,
//     visualizarCursosDocente,
//     actualizarCurso,
//     eliminarCurso
// }

