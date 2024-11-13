import Cursos from "../models/cursos.js"
import mongoose from "mongoose"

//Gestionar cursos
    //Crear curso
    const crearCurso = async(req, res) =>{
        const {codigo} = req.body
        try {
            if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
            const cursoEncontrado = await Cursos.findOne({codigo})
            if(cursoEncontrado) return res.status(404).json({msg: "Lo sentimos, pero el curso ya se encuentra registrado"})
    
            const nuevoCurso = new Cursos(req.body)
            nuevoCurso.docente = req.docente._id
            await nuevoCurso.save()
    
            res.status(200).json({msg: "Curso creado con éxito", codigo: codigo})
        } catch (error) {
            res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
        }
    }
    
        //Visualizar cursos
    
    const visualizarCursosDocente = async(req, res) =>{
        const {docenteId} = req.body
        try {
            const cursosEncontrado = await Cursos.find({docente: docenteId}).select("-createdAt -updatedAt -__v")
            if(cursosEncontrado.length === 0) return res.status(400).json({msg: "Lo sentimos, pero no se encuentraron cursos registrados"})
            res.status(200).json(cursosEncontrado)
        } catch (error) {
            res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
        }
    }
    
        //Visualizar curso
    
    const visualizarCursoDocente = async(req, res) =>{
        const {id} = req.params
        try {
            if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos, pero el id no es válido"})
            const cursoEncontrado = await Cursos.findById(id)
            if(!cursoEncontrado) return res.status(400).json({msg: "Lo sentimos, pero el curso no se encuentra registrado"})
            res.status(200).json(cursoEncontrado)
        } catch (error) {
            res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
        }
    }
    
        //Actualizar curso
    
    const actualizarCurso = async(req, res) =>{
        const {id} = req.params
        try {
            if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos, pero el id no es válido"})
            if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
            const cursoEncontrado = await Cursos.findByIdAndUpdate(id, req.body)
            if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos, pero el curso no se encuentra registrado"})
            await cursoEncontrado.save()
            res.status(200).json({msg: "Curso actualizado con éxito"})
        } catch (error) {
            res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
        }
    }
    
        //Eliminar curso
    const eliminarCurso = async(req, res) =>{
        const {id} = req.params
        try {
            if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos, pero el id no es válido"})
            const cursoEncontrado = await Cursos.findByIdAndDelete(id)
            if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos, pero el curso no se encuentra registrado"})
            res.status(200).json({msg: "Curso eliminado con éxito"})
        } catch (error) {
            res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
        }
    }
    
export {
    crearCurso,
    visualizarCursoDocente,
    visualizarCursosDocente,
    actualizarCurso,
    eliminarCurso
}