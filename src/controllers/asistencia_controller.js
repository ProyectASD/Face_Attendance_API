import Asistencia from "../models/asistencias.js"
import mongoose from "mongoose"
import Estudiantes from "../models/estudiantes.js"
import Cursos from "../models/cursos.js"
//import reconocimientoFacial from "./reconocimiento_facial.js"
//import Actuaciones from "../models/actuaciones.js"
//Gestionar asistencias


//Crear asistencia
//Esto es para la IA
// const crearAsistencia = async(req, res)=>{
//     const {estudiante} = req.body
//     try {
//         if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
//         const asistenciaEncontrada = await Asistencia.findOne({estudiante})
//         if(asistenciaEncontrada) return res.status(404).json({msg: "Lo sentimos pero esta asistencia ya esta registrada"})
//         const estudianteEncontrado = await Estudiantes.findById(estudiante)
//         if(!estudianteEncontrado) return res.status(404).json({msg: "No se a podido crear la asistencia, ya que el estudiante no existe"})
        
//         const asistenciaNueva = new Asistencia(req.body)
//         await asistenciaNueva.save()

//         res.status(200).json({msg: "Asistencia creada con éxito"})
        
//     } catch (error) {
//         res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
//     }
// }

//Visualizar asistencias
const visualizarAsistencias = async(req, res)=>{
    const {materia, paralelo} = req.body
    try {
        if(Object.values(req.body).includes("") || materia === undefined) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        const cursoEncontrado = await Cursos.findOne({materia: materia, paralelo: paralelo})
        if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos pero no se ha podido encontra el curso"})

        const asistenciasEncontradas = await Asistencia.find({curso: cursoEncontrado?._id})
        console.log(asistenciasEncontradas)
        if(asistenciasEncontradas.length === 0) return res.status(400).json({msg: "Lo sentimos pero no se encuentraron asistencias registradas con esa materia o paralelo"})
        if(!asistenciasEncontradas) return res.status(400).json({msg: "Lo sentimos pero esta asistencia no existe"})      
        
        res.status(200).json(asistenciasEncontradas)
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Visualizar asistencia
const visualizarAsistencia = async(req, res)=>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos pero el id no es válido"})
        const asistenciaEncontrada = await Asistencia.findById(id)
        if(!asistenciaEncontrada) return res.status(400).json({msg: "Lo sentimos pero la asistencia no se encuentra registrada"})
        res.status(200).json(asistenciaEncontrada)
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Actualizar asistencia - SE SUPONE QUE AQUI VA LA IA
const actualizarAsistencia = async(req, res)=>{
    const {materia, paralelo} = req.body
    try {
        //if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos pero el id no es válido"})
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        
        //Implementación de la IA
        ///await reconocimientoFacial(materia, paralelo)
        //await reconocimientoFacial()
        //EN CONSTRUCCION

        const asistenciaEncontrada = await Asistencia.findAndUpdate(id, req.body)
        if(!asistenciaEncontrada) return res.status(404).json({msg: "Lo sentimos pero la asistencia no se encuentra registrada"})
        
        await asistenciaEncontrada.save()



        res.status(200).json({msg: "Asistencia registrada con éxito"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Eliminar asistencia
const eliminarAsistencia = async(req, res)=>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos pero el id no es válido"})
        const asistenciaEncontrada = await Asistencia.findByIdAndDelete(id)
        if(!asistenciaEncontrada) return res.status(404).json({msg: "Lo sentimos pero la asistencia no se encuentra registrado"})
        res.status(200).json({msg: "Asistencia eliminada con éxito"})        
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Visualizar reporte de asistencias
const visualizarReporte = async(req, res) =>{
    const {fecha, materia, paralelo} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})

        const cursoEncontrado = await Cursos.findOne({materia: materia, paralelo: paralelo})
        if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos pero no se ha podido encontra el curso"})

        const asistenciaEncontradas = await Asistencia.find({curso: cursoEncontrado?._id})
        console.log(asistenciaEncontradas?.fecha_asistencias)
        if(asistenciaEncontradas.length === 0) return res.status(400).json({msg: "Lo sentimos pero no se encuentraron asistencias registradas"})      
                
        let estadoAsistencia = "";
        if(fecha?.length != 0 && fecha !== undefined) {
            for(let i = 0; i < asistenciaEncontradas.fecha_asistencias.length; i++){
                    if(fecha == asistenciaEncontradas.fecha_asistencias[i]){
                    estadoAsistencia = asistenciaEncontradas.estado_asistencias[i]
                    console.log("FECHAS: ",asistenciaEncontradas.fecha_asistencias)
                    console.log(`Indice: ${i}`)
                    const {estudiante} = asistenciaEncontradas         
                    return res.status(200).json({
                        estudiante,
                        estadoAsistencia,
                        fecha
                    })
                }
            }
            if(estadoAsistencia.length === 0){
                    return res.status(404).json({msg: "Lo sentimos pero esa fecha no se encuentra registrada"})
            }
        }

        res.status(200).json(asistenciaEncontradas)
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)           
    }
}


export{
    // crearAsistencia,
    visualizarAsistencias,
    visualizarAsistencia,
    actualizarAsistencia,
    eliminarAsistencia,
    visualizarReporte
}