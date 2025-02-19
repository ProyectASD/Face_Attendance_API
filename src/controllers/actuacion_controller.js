import Actuaciones from "../models/actuaciones.js"
import mongoose from "mongoose"
import Cursos from "../models/cursos.js"
import Asistencias from "../models/asistencias.js"
import actuaciones from "../models/actuaciones.js"

//Gestionar Actuaciones

//Visualizar estudiantes presentes
    const estudiantesPresentes = async(req, res)=>{
        const {materia, paralelo, semestre} = req.body
        try {
            if(Object.values(req.body).includes("") || materia === undefined) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
            const cursoEncontrado = await Cursos.findOne({materia: materia, paralelo: paralelo, semestre: semestre})
            if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos, pero no se ha podido encontrar el curso"})

            const asistenciaEstudiantes = await Asistencias.find({curso: cursoEncontrado?._id})
            if(!asistenciaEstudiantes) return res.status(404).json({msg: "Lo sentimos, pero no se ha podido encontrar la asistencia del estudiante"})
            console.log(asistenciaEstudiantes)

            //Obtener ultimo elemento del arreglo estado de asistencias

            const estudiantesPresentes = asistenciaEstudiantes.filter((asistencia) =>{
                let ultimoElemento = asistencia.estado_asistencias[asistencia.estado_asistencias.length - 1]
                console.log(ultimoElemento)
                return ultimoElemento === "presente"
            }).map((asistencia) => ({
                estudianteId: asistencia.estudiante,
                fecha: asistencia.fecha_asistencias[asistencia.fecha_asistencias.length - 1]
            }))

            const estudiantesPresentesIds =  estudiantesPresentes.map((id)=> id.estudianteId)
            

            //Listar solo los que estudiantes que estan presentes
            const actuacionesEncontradas = await Actuaciones.find({curso: cursoEncontrado?._id, estudiante: { $in: estudiantesPresentesIds}}).populate("estudiante", "nombre apellido")
            if(actuacionesEncontradas.length === 0) return res.status(400).json({msg: "Lo sentimos, pero no existen estudiantes presentes"})      
            
            if(!actuacionesEncontradas) return res.status(400).json({msg: "Lo sentimos, pero esta actuación no existe"})      
            
            const informacionActuaciones = actuacionesEncontradas.map((actuacion) =>{
                
                const fechaEstudiante = estudiantesPresentes.find(
                    (estudiante)=> estudiante.estudianteId.toString() === actuacion.estudiante._id.toString())?.fecha
                console.log("ultimafecha: ", fechaEstudiante);                
                const{estudiante,cantidad_actuaciones} = actuacion
                return {estudiante, cantidad_actuaciones, fecha: fechaEstudiante}
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
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos, pero el id no es válido"})
        const actuacionEncontrada = await Actuaciones.findById(id).select("-createdAt -updatedAt -__v ")
        if(!actuacionEncontrada) return res.status(400).json({msg: "Lo sentimos, pero la actuación no se encuentra registrada"})
        res.status(200).json(actuacionEncontrada)      
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Visualizar varias actuaciones
const visualizarActuaciones = async(req, res) =>{
    const {materia, paralelo, semestre} = req.body
    try {
        if(Object.values(req.body).includes("") || materia === undefined) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        const cursoEncontrado = await Cursos.findOne({materia: materia, paralelo: paralelo, semestre: semestre})
        if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos, pero no se ha podido encontrar el curso"})

        const actuacionesEncontradas = await Actuaciones.find({curso: cursoEncontrado?._id}).select("-createdAt -updatedAt -__v")
        if(actuacionesEncontradas.length === 0) return res.status(400).json({msg: "Lo sentimos, pero no existen actuaciones registradas con esa materia o paralelo"})      
        
        if(!actuacionesEncontradas) return res.status(400).json({msg: "Lo sentimos, pero esta actuación no existe"})      
        res.status(200).json(actuacionesEncontradas)
        
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}


//Actualizar una actuacion 
const actualizarActuacion = async(req, res) =>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos, pero el id no es válido"})
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        
        const actuacionEncontrada = await Actuaciones.findById(id).select("-createdAt -updatedAt -__v")
        if(!actuacionEncontrada) return res.status(404).json({msg: "Lo sentimos, pero la actuacion no se encuentra registrada"})
            
        const cantidadActuaciones = Number(req.body.cantidad_actuaciones)
        if(isNaN(cantidadActuaciones)) return res.status(400).json({ msg: "La cantidad de actuaciones debe ser un número válido" });

        actuacionEncontrada.cantidad_actuaciones += cantidadActuaciones
        console.log(actuacionEncontrada.cantidad_actuaciones)

        actuacionEncontrada.fecha_actuaciones.push(req.body.fecha_actuaciones)
        actuacionEncontrada.descripciones.push(req.body.descripciones)

        await actuacionEncontrada.save()

        res.status(200).json(actuacionEncontrada)
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Actualizar varios actuaciones
const actualizarActuaciones = async(req, res) =>{
    const {materia, paralelo, semestre, fecha, actuaciones} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        
        const cursoEncontrado = await Cursos.findOne({materia: materia, paralelo: paralelo, semestre: semestre})
        if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos, pero no se ha podido encontrar el curso"})

        const actuacionesActualizadas = await Promise.all(
            actuaciones.map(async(actuacion)=>{
                if(!mongoose.isValidObjectId(actuacion?.id)) return {
                    code: 400,
                    msg: "El formato del ID no es válido"}
        

                const actuacionEncontrada = await Actuaciones.findOne({curso: cursoEncontrado?._id, _id: actuacion?.id }).select("-createdAt -updatedAt -__v")
                if(!actuacionEncontrada) return {
                    code: 400,
                    msg: `Lo sentimos, la actuación con ID ${actuacion?.id} no se encuentra registrada`
                } 
                
                
                const cantidadActuaciones = Number(actuacion.cantidad_actuaciones)
                if(isNaN(cantidadActuaciones)) return {
                    code: 400,
                    msg: "La cantidad de actuaciones debe ser un número válido"
                }
        
                actuacionEncontrada.cantidad_actuaciones += cantidadActuaciones
        
                actuacionEncontrada.fecha_actuaciones.push(fecha)
                actuacionEncontrada.descripciones.push(actuacion.descripciones)
            
                await actuacionEncontrada.save()
                return actuacionEncontrada
            })
        )        

        const actualizadas = actuacionesActualizadas.filter(act => !act.code)
        const errores = actuacionesActualizadas.filter(act => act.code)

        if(actuaciones.length === 1 && errores.length  === 1 ){
            return res.status(errores[0].code).json({msg: errores[0].msg})
        }

        if(errores.length > 0){
            return res.status(200).json({
                msg: "Algunas actuaciones se han actualizado con éxito", 
                actuaciones: {
                    actualizadas,
                    errores
                }
            })    
        }

        res.status(200).json({msg: "Actuaciones actualizadas con éxito", actuaciones: actuacionesActualizadas})    
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Eliminar actuacion
const eliminarActuacion = async(req, res) =>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos, pero el id no es válido"})
        const actuacionEncontrada = await Actuaciones.findByIdAndDelete(id)
        if(!actuacionEncontrada) return res.status(404).json({msg: "Lo sentimos, pero la asistencia no se encuentra registrada"})
        res.status(200).json({msg: "Actuación eliminada correctamente"})
        
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Visualizar reporte de actuaciones

const visualizarReporte = async(req, res)=>{
    const {materia, paralelo, semestre} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
    
        const cursoEncontrado = await Cursos.findOne({materia: materia, paralelo: paralelo, semestre: semestre})
        if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos, pero no se ha podido encontrar el curso"})
        
        const actuacionesEncontradas = await Actuaciones.find({curso: cursoEncontrado?._id}).select("-updatedAt -createdAt -__v").populate("estudiante", "nombre apellido -_id").populate("curso", "materia paralelo")
        if(!actuacionesEncontradas.length === 0) return res.status(400).json({msg: "Lo sentimos, pero no se encuentraron actuaciones registradas"})      
        
        res.status(200).json(actuacionesEncontradas)

    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

export {
    estudiantesPresentes,
    visualizarActuacion,
    visualizarActuaciones,
    actualizarActuacion,
    actualizarActuaciones,
    eliminarActuacion,
    visualizarReporte
}
