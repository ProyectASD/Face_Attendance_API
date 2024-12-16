import mongoose from "mongoose"
import { enviarCorreo,enviarCorreoRecuperarPassword } from "../config/nodemailer.js"
import crearToken from "../helpers/crearJWT.js"
import Docentes from "../models/docentes.js"
import Estudiantes from "../models/estudiantes.js"
import Cursos from "../models/cursos.js"
import Asistencias from "../models/asistencias.js"
import Actuaciones from "../models/actuaciones.js"

//Registrarse
const registroDocente = async(req,res)=>{
    const {email, password} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        
        if(!email.includes("epn.edu.ec")) return res.status(400).json({msg: "Lo sentimos, pero el correo ingresado debe ser institucional"})
        
        const emailEncontrado = await Docentes.findOne({email})
        if(emailEncontrado) return res.status(409).json({msg: "Lo sentimos, pero este email ya se encuentra registrado"})

        const nuevoDocente = new Docentes(req.body)
        nuevoDocente.password = await nuevoDocente?.encryptPassword(password)
        const token = await nuevoDocente?.createToken()
        nuevoDocente.token = token
        enviarCorreo(nuevoDocente.email, token)
        await nuevoDocente?.save()
        
        res.status(201).json({msg: "Revise su correo para verificar su cuenta"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}


//Confirmar correo
const confirmarEmailDocente = async(req,res)=>{
    try {
        if(!(req.params.token)) return res.status(404).json({msg: "Lo sentimos, no se pudo verificar la cuenta"})
        const usuarioConfirmado = await Docentes.findOne({token: req.params.token})
        if(!usuarioConfirmado?.token) return res.status(404).json({msg: "La cuenta ya ha sido confirmada"})
        usuarioConfirmado.token = null
        usuarioConfirmado.confirmEmail = true
        await usuarioConfirmado.save()
        res.status(200).json({msg: "Cuenta verificada con éxito"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Loguearse
const loginDocente = async(req, res)=>{
    const {email, password} = req.body
    try {
        if(Object.values(req.body).includes("") || email === undefined || password === undefined) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
         
        const docenteEncontrado = await Docentes.findOne({email})
        if(docenteEncontrado?.confirmEmail == false) return res.status(403).json({msg: "Lo sentimos, pero la cuenta no ha sido verificada"})
        if(!docenteEncontrado) return res.status(404).json({msg: "Lo sentimos, pero el docente no se encuentra registrado"})
        
        const confirmarPassword = await docenteEncontrado.matchPassword(password)
        if(!confirmarPassword) return res.status(401).json({msg: "Lo sentimos, pero la contraseña es incorrecta"})

        const token = crearToken(docenteEncontrado.id, "docente")
        const {id, nombre, apellido, ciudad, direccion} = docenteEncontrado

        await docenteEncontrado.save()
        res.status(200).json({
            id,
            nombre,
            apellido, 
            ciudad, 
            direccion, 
            email, 
            token
        })

    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Modificar perfil
const modificarPerfilDocente = async(req, res) =>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos, pero el id no es válido"})
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        const docentePerfil = await Docentes.findByIdAndUpdate(id, req.body)
        if(!docentePerfil) return res.status(404).json({msg: "Lo sentimos, pero el docente no se encuentra registrado"})
        await docentePerfil.save()

        res.status(200).json({msg: "Perfil modificado con éxito"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }

}

//Recuperar password
const recuperarPasswordDocente = async(req,res)=>{
    const {email} = req.body
    try {
        if(Object.values(req.body).includes("") || email === undefined) return res.status(404).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})

        const docenteEncontrado = await Docentes.findOne({email})
        if(!docenteEncontrado) return res.status(404).json({msg: "Lo sentimos, pero el docente no se encuentra registrado"})
        
        const token = await docenteEncontrado?.createToken()
        docenteEncontrado.token = token
        enviarCorreoRecuperarPassword(email, token)
        await docenteEncontrado.save()

        res.status(200).json({msg: "Se ha enviado un correo para restablecer su contraseña"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Confirmar recuperacion password
const confirmarRecuperarPassword = async(req, res) =>{
    try {
        if(!(req.params.token)) return res.status(404).json({msg: "Lo sentimos, no se pudo verificar la recuperación de la contraseña"})
        const docenteEncontrado = await Docentes.findOne({token: req.params.token})
        if(docenteEncontrado?.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos, no se pudo validar la cuenta"})
        await docenteEncontrado.save()
        res.status(200).json({msg: "Token confirmado ahora puede cambiar su contraseña"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}


//Setear una nueva password
const nuevaPasswordDocente = async(req,res) =>{
    const {password, confirmarPassword} = req.body
    try {
        if(Object.values(req.body).includes("") || password === undefined || confirmarPassword === undefined) return res.status(404).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        if(password !== confirmarPassword) return res.status(404).json({msg: "Lo sentimos, pero las contraseñas no coinciden"})

        const docenteEncontrado = await Docentes.findOne({token: req.params.token})
        if(docenteEncontrado?.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos, no se pudo validar la cuenta"})

        docenteEncontrado.token = null
        docenteEncontrado.password = await docenteEncontrado.encryptPassword(password)
        await docenteEncontrado.save()
        
        res.status(200).json({msg: "Contraseña actualizada con éxito"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}



//Gestionar estudiantes

//Crear estudiante
const crearEstudiante = async(req, res) =>{
    const {email} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        const estudianteEncontrado = await Estudiantes.findOne({email})
        if(estudianteEncontrado) return res.status(404).json({msg: "Lo sentimos, pero el estudiante ya se encuentra registrado"})

        const nuevoEstudiante = new Cursos(req.body)
        await nuevoEstudiante.save()

        res.status(200).json({msg: "Estudiante creado con éxito"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

    //Visualizar estudiantes

const visualizarEstudiantes = async(req, res) =>{
    const {materia, paralelo, semestre} = req.body
    try {
        if(Object.values(req.body).includes("") || materia === undefined) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})

        const cursoEncontrado = await Cursos.findOne({materia: materia, paralelo: paralelo, semestre: semestre})
        if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos, pero no se ha podido encontrar el curso"})
        
        const estudiantesEncontrado = await Estudiantes.find({_id: {$in: cursoEncontrado?.estudiantes}}).select("-createdAt -updatedAt -__v -descriptor")
        if(estudiantesEncontrado.length === 0 || !estudiantesEncontrado) return res.status(400).json({msg: "Lo sentimos, pero no se encuentraron estudiantes registrados"})
        res.status(200).json(estudiantesEncontrado)
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

    //Visualizar estudiante

const visualizarEstudiante = async(req, res) =>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos, pero el id no es válido"})
        const estudianteEncontrado = await Estudiantes.findById(id).select("-createdAt -updatedAt -__v -descriptor")
        if(!estudianteEncontrado) return res.status(400).json({msg: "Lo sentimos, pero el estudiante no se encuentra registrado"})
        res.status(200).json(estudianteEncontrado)
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

    //Actualizar estudiante
const actualizarEstudiante = async(req, res) =>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos, pero el id no es válido"})
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})

        const estudianteEncontrado = await Estudiantes.findByIdAndUpdate(id, req.body)
        if(!estudianteEncontrado) return res.status(404).json({msg: "Lo sentimos, pero el estudiante no se encuentra registrado"})
        await estudianteEncontrado.save()
        res.status(200).json({msg: "Estudiante actualizado con éxito"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

    //Eliminar estudiante
const eliminarEstudiante = async(req, res) =>{
    const {id} = req.params
    const {cid} = req.query
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos, pero el id no es válido"})
        const estudianteEncontrado = await Estudiantes.findById(id)
        if(!estudianteEncontrado) return res.status(404).json({msg: "Lo sentimos, pero el estudiante no se encuentra registrado"})

        if(!mongoose.Types.ObjectId.isValid(cid)) return res.status(404).json({msg: "Lo sentimos, pero el id del curso no es válido"})
        const cursoEncontrado = await Cursos.findById(cid)
        if(!cursoEncontrado) return res.status(404).json({msg: "Lo sentimos, pero no se ha podido encontrar el curso"})


        if(!cursoEncontrado.estudiantes.some(estudiante => estudiante.equals(id))) return res.status(400).json({msg: "Lo sentimos, pero el estudiante no esta registrado en este curso"})


        cursoEncontrado.estudiantes = cursoEncontrado.estudiantes.filter(estudiante => 
            !estudiante.equals(id)
        )    

        const asistenciaEncontrada = await Asistencias.findOne({estudiante: id, curso: cid})
        const actuacionEncontrada = await Actuaciones.findOne({estudiante: id, curso: cid})
        
        console.log(asistenciaEncontrada);
        console.log(asistenciaEncontrada?.estado_asistencias);
        console.log(asistenciaEncontrada?.fecha_asistencias);

        
        if(asistenciaEncontrada && (
            asistenciaEncontrada?.cantidad_asistencias !== 0 ||
            asistenciaEncontrada?.cantidad_presentes !== 0 ||
            asistenciaEncontrada?.cantidad_ausencias !== 0 ||
            asistenciaEncontrada?.fecha_asistencias?.length > 0 || 
            asistenciaEncontrada?.estado_asistencias?.length > 0 )
        ){ return res.status(404).json({msg: "Lo sentimos, pero no se ha podido eliminar el estudiante, ya que contiene información en asistencias"})}

        console.log(actuacionEncontrada);
        
        if(actuacionEncontrada && (
            actuacionEncontrada?.cantidad_actuaciones !== 0 ||
            actuacionEncontrada?.descripciones?.length > 0 || 
            actuacionEncontrada?.fecha_actuaciones?.length > 0) 
        ){ return res.status(404).json({msg: "Lo sentimos, pero no se ha podido eliminar el estudiante, ya que contiene información en actuaciones"})}

        if(asistenciaEncontrada) await asistenciaEncontrada.deleteOne()
        if(actuacionEncontrada) await actuacionEncontrada.deleteOne()
        
        await cursoEncontrado.save()

        res.status(200).json({msg: "Estudiante eliminado con éxito"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}



export { 
    registroDocente, 
    loginDocente, 
    modificarPerfilDocente, 
    recuperarPasswordDocente,
    confirmarEmailDocente,
    nuevaPasswordDocente,
    confirmarRecuperarPassword,
    crearEstudiante,
    visualizarEstudiante,
    visualizarEstudiantes,
    actualizarEstudiante,
    eliminarEstudiante,
}