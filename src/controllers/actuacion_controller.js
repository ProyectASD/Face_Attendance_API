import Actuaciones from "../models/actuaciones.js"
import mongoose from "mongoose"
import Cursos from "../models/cursos.js"
import Asistencias from "../models/asistencias.js"

//Gestionar Actuaciones

//Visualizar estudiantes presentes
const estudiantesPresentes = async(req, res)=>{
    const {materia, paralelo} = req.body
    try {
        if(Object.values(req.body).includes("") || materia === undefined) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        const cursoEncontrado = await Cursos.findOne({materia: materia, paralelo: paralelo})
        if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos pero no se ha podido encontrar el curso"})

        const asistenciaEstudiantes = await Asistencias.find({curso: cursoEncontrado?._id})
        if(!asistenciaEstudiantes) return res.status(404).json({msg: "Lo sentimos pero no se ha podido encontrar la asistencia del estudiante"})
        console.log(asistenciaEstudiantes)

        //Obtener ultimo elemento del arreglo estado de asistencias


        const estudiantesPresentesIds = asistenciaEstudiantes.filter((asistencia) =>{
            let ultimoElemento = asistencia.estado_asistencias[asistencia.estado_asistencias.length - 1]
            console.log(ultimoElemento)
            return ultimoElemento === "presente"
        }).map((asistencia) => asistencia.estudiante)

        //Listar solo los que estudiantes que estan presentes
        const actuacionesEncontradas = await Actuaciones.find({curso: cursoEncontrado?._id, estudiante: { $in: estudiantesPresentesIds}})
        if(actuacionesEncontradas.length === 0) return res.status(400).json({msg: "Lo sentimos pero no existen actuaciones registradas con esa materia o paralelo"})      
        
        if(!actuacionesEncontradas) return res.status(400).json({msg: "Lo sentimos pero esta actuación no existe"})      
        
        const informacionActuaciones = actuacionesEncontradas.map((actuacion) =>{
            const{estudiante,cantidad_actuaciones} = actuacion
            return {estudiante, cantidad_actuaciones}
        })



        res.status(200).json(informacionActuaciones)
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}



//Visualizar una actuacion
const visualizarActuacion = async(req, res) =>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos pero el id no es válido"})
        const actuacionEncontrada = await Actuaciones.findById(id)
        if(!actuacionEncontrada) return res.status(400).json({msg: "Lo sentimos pero la actuación no se encuentra registrada"})
        res.status(200).json(actuacionEncontrada)      
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Visualizar varias actuaciones
const visualizarActuaciones = async(req, res) =>{
    const {materia, paralelo} = req.body
    try {
        if(Object.values(req.body).includes("") || materia === undefined) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        const cursoEncontrado = await Cursos.findOne({materia: materia, paralelo: paralelo})
        if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos pero no se ha podido encontrar el curso"})

        const actuacionesEncontradas = await Actuaciones.find({curso: cursoEncontrado?._id})
        if(actuacionesEncontradas.length === 0) return res.status(400).json({msg: "Lo sentimos pero no existen actuaciones registradas con esa materia o paralelo"})      
        
        if(!actuacionesEncontradas) return res.status(400).json({msg: "Lo sentimos pero esta actuación no existe"})      
        res.status(200).json(actuacionesEncontradas)
        
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}


//Actualizar una actuacion 
const actualizarActuacion = async(req, res) =>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos pero el id no es válido"})
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        
        const actuacionEncontrada = await Actuaciones.findByIdAndUpdate(id, req.body)
        if(!actuacionEncontrada) return res.status(404).json({msg: "Lo sentimos pero la actuacion no se encuentra registrada"})
        await actuacionEncontrada.save()

        res.status(200).json(actuacionEncontrada)
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Actualizar varios actuaciones
const actualizarActuaciones = async(req, res) =>{
    try {
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        
        const actuacionesEncontradas = await Actuaciones.find().updateMany()
        if(actuacionesEncontradas.length === 0) return res.status(400).json({msg: "Lo sentimos pero no se encuentraron actuaciones registradas"})      
        await actuacionesEncontradas.save()
        
        res.status(200).json(actuacionesEncontradas)    
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Eliminar actuacion
const eliminarActuacion = async(req, res) =>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos pero el id no es válido"})
        const actuacionEncontrada = await Actuaciones.findByIdAndDelete(id)
        if(!actuacionEncontrada) return res.status(404).json({msg: "Lo sentimos pero la asistencia no se encuentra registrado"})
        res.status(200).json(actuacionEncontrada)
        
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Visualizar reporte de actuaciones

const visualizarReporte = async(req, res)=>{
    const {materia, paralelo} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
    
        const cursoEncontrado = await Cursos.findOne({materia: materia, paralelo: paralelo})
        if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos pero no se ha podido encontrar el curso"})
        
        const actuacionesEncontradas = await Actuaciones.findOne({curso: cursoEncontrado?._id})
        if(!actuacionesEncontradas.length === 0) return res.status(400).json({msg: "Lo sentimos pero no se encuentraron actuaciones registradas"})      
        //AQUI FILTRO POR FECHA SI ES QUE SE DESEA
        
        res.status(200).json(actuacionesEncontradas)

    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}


// const visualizarReporte = async(req, res) =>{
//     const {fecha, materia, paralelo} = req.body
//     try {
//         if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})

//         const cursoEncontrado = await Cursos.findOne({materia: materia, paralelo: paralelo})
//         if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos pero no se ha podido encontrar el curso"})

//         const asistenciaEncontradas = await Asistencia.find({curso: cursoEncontrado?._id})
//         console.log(asistenciaEncontradas?.fecha_asistencias)
//         if(asistenciaEncontradas.length === 0) return res.status(400).json({msg: "Lo sentimos pero no se encuentraron asistencias registradas"})      
                
//         let estadoAsistencia = "";
//         if(fecha?.length != 0 && fecha !== undefined) {
//             for(let i = 0; i < asistenciaEncontradas.fecha_asistencias.length; i++){
//                     if(fecha == asistenciaEncontradas.fecha_asistencias[i]){
//                     estadoAsistencia = asistenciaEncontradas.estado_asistencias[i]
//                     console.log("FECHAS: ",asistenciaEncontradas.fecha_asistencias)
//                     console.log(`Indice: ${i}`)
//                     const {estudiante} = asistenciaEncontradas         
//                     return res.status(200).json({
//                         estudiante,
//                         estadoAsistencia,
//                         fecha
//                     })
//                 }
//             }
//             if(estadoAsistencia.length === 0){
//                     return res.status(404).json({msg: "Lo sentimos pero esa fecha no se encuentra registrada"})
//             }
//         }

//         res.status(200).json(asistenciaEncontradas)
//     } catch (error) {
//         res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)           
//     }
// }





export {
    // crearActuacion,
    estudiantesPresentes,
    visualizarActuacion,
    visualizarActuaciones,
    actualizarActuacion,
    actualizarActuaciones,
    eliminarActuacion
}
