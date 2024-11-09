import mongoose from "mongoose"
import { enviarCorreoEstudiante, enviarCorreoRecuperarPasswordEstudiante } from "../config/nodemailer.js"
import crearToken from "../helpers/crearJWT.js"
import Estudiantes from "../models/estudiantes.js"
import Cursos from "../models/cursos.js"
import Asistencias from "../models/asistencias.js"
import Actuaciones from "../models/actuaciones.js"
import cloudinary from "../config/cloudinary.js"

//Registrarse
const registroEstudiante = async(req,res)=>{
    const {email, password} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(404).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        // if(!email.includes("epn.edu.ec")) return res.status(404).json({msg: "Lo sentimos pero el correo ingresado debe ser institucional"})
        
        const emailEncontrado = await Estudiantes.findOne({email})
        if(emailEncontrado) return res.status(404).json({msg: "Lo sentimos, pero este email ya se encuentra registrado"})
     
        const nuevoEstudiante = new Estudiantes(req.body)
        nuevoEstudiante.password = await nuevoEstudiante.encryptPassword(password)
        const token = await nuevoEstudiante?.createToken()
        nuevoEstudiante.token = token
        try {
            await nuevoEstudiante?.save()
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "Recuerde el número de cedula es único. Por favor, ingreselo nuevamente." });
            }
        }
        
        enviarCorreoEstudiante(nuevoEstudiante.email, token)

        //Subir imagen a cloudinary
        cloudinary.uploader.upload_stream({public_id: nuevoEstudiante?._id}, async(err, resultado)=>{
            if(err) return res.status(500).send(`Hubo un problema al subir la imagen ${err.message}`)       
            
            const actualizarImgEstudiante = await Estudiantes.findByIdAndUpdate(nuevoEstudiante?._id,{fotografia: resultado.secure_url})
            if(!actualizarImgEstudiante) return res.status(404).json({msg: "Lo sentimos, pero el estudiante no se encuentra registrado"})
            await actualizarImgEstudiante.save()

            //res.status(200).json({ message: 'Imagen subida y asociada correctamente', imageUrl: actualizarImgEstudiante?.fotografia })
            res.status(200).json({msg: "Revise su correo para verificar su cuenta"})
        }).end(req.file.buffer)

    } catch (error) {
       res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)       
    }
}


//Confirmar correo
const confirmarEmailEstudiante = async(req,res)=>{
    try {
        if(!(req.params.token)) return res.status(404).json({msg: "Lo sentimos, no se pudo verificar la cuenta"})
        const usuarioConfirmado = await Estudiantes.findOne({token: req.params.token})
        if(!usuarioConfirmado?.token) return res.status(404).json({msg: "La cuenta ya ha sido confirmada"})
        usuarioConfirmado.token = null
        usuarioConfirmado.confirmEmail = true
        await usuarioConfirmado.save()
        res.status(200).json({msg: "Cuenta verificada con exito"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)       
    }
}

//Loguearse
const loginEstudiante = async(req, res)=>{    
    const {email, password} = req.body
    try {
        if(Object.values(req.body).includes("") || email === undefined || password === undefined) return res.status(404).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        const estudianteEncontrado = await Estudiantes.findOne({email})
        if(estudianteEncontrado?.confirmEmail == false) return res.status(404).json({msg: "Lo sentimos, pero la cuenta no ha sido verificada"})
        if(!estudianteEncontrado) return res.status(404).json({msg: "Lo sentimos, pero el estudiante no se encuentra registrado"})

        const confirmarPassword = await estudianteEncontrado.matchPassword(password)
        if(!confirmarPassword) return res.status(404).json({msg: "Lo sentimos, pero la contraseña es incorrecta"})

        const token = crearToken(estudianteEncontrado.id, "estudiante")
        const {nombre, apellido, ciudad, direccion} = estudianteEncontrado
        await estudianteEncontrado.save()
        res.status(200).json({
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
const modificarPerfilEstudiante = async(req, res) =>{
    const {id} = req.params
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos, pero el id no es válido"})
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        
        let estudiantePerfil = await Estudiantes.findByIdAndUpdate(id, req.body)
        if(!estudiantePerfil) return res.status(404).json({msg: "Lo sentimos, pero el estudiante no se encuentra registrado"})
        
        console.log(req.body)

        if(req.file){
        //Eliminar imagen existente de cloudinary
            await cloudinary.uploader.destroy(estudiantePerfil?._id,(err, resultado)=>{
                if(err) console.log("Error al eliminar la imagen", err)
                else console.log("Imagen eliminada", resultado)
            })
        //Actualizar la nueva imagen a cloudinary
            cloudinary.uploader.upload_stream({public_id: estudiantePerfil?._id}, async(err, resultado)=>{
                if(err) return res.status(500).send(`Hubo un problema al subir la imagen ${err.message}`)       
                
                estudiantePerfil = await Estudiantes.findByIdAndUpdate(estudiantePerfil?._id,{fotografia: resultado.secure_url})
                if(!estudiantePerfil) return res.status(404).json({msg: "Lo sentimos, pero el estudiante no se encuentra registrado"})

            }).end(req.file.buffer)
        }
        await estudiantePerfil.save()
        res.status(200).json({msg: "Perfil modificado con éxito"})

    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Visualizar perfil
const visualizarPerfilEstudiante = async (req, res) =>{
    delete req.estudiante.createdAt
    delete req.estudiante.updatedAt
    delete req.estudiante.confirmEmail
    delete req.estudiante.token
    delete req.estudiante.status
    delete req.estudiante.__v
    //delete req.estudiante._id
    //delete req.estudiante.password

    res.status(200).json(req.estudiante)
}

//Recuperar password
const recuperarPasswordEstudiante = async(req,res)=>{
    const {email} = req.body
    try {
        if(Object.values(req.body).includes("") || email === undefined) return res.status(404).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        const estudianteEncontrado = await Estudiantes.findOne({email})
        if(!estudianteEncontrado) return res.status(404).json({msg: "Lo sentimos, pero el estudiante no se encuentra registrado"})

        const token = await estudianteEncontrado?.createToken()
        estudianteEncontrado.token = token
        enviarCorreoRecuperarPasswordEstudiante(email, token)
        await estudianteEncontrado.save()

        res.status(200).json({msg: "Se envio un correo para restablecer su contraseña"})
    } catch (error) {
       res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)       
    }
}

//Confirmar recuperacion password
const confirmarRecuperarPassword = async(req, res) =>{
    try {
        if(!(req.params.token)) return res.status(404).json({msg: "Lo sentimos, no se pudo verificar la recuperación de la contraseña"})
        const estudianteEncontrado = await Estudiantes.findOne({token: req.params.token})
        if(estudianteEncontrado?.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos, no se pudo validar la cuenta"})
        await estudianteEncontrado.save()
        res.status(200).json({msg: "Token confirmado ahora puede cambiar su contraseña"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)      
    }
}


//Setear una nueva password
const nuevaPasswordEstudiante = async(req,res) =>{
    const {password, confirmarPassword} = req.body
    try {
        if(Object.values(req.body).includes("") || password === undefined || confirmarPassword === undefined) return res.status(404).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        if(password !== confirmarPassword) return res.status(404).json({msg: "Lo sentimos, pero las contraseñas no coinciden"})
        
        const estudianteEncontrado = await Estudiantes.findOne({token: req.params.token})
        if(estudianteEncontrado?.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos, no se pudo validar la cuenta"})
        
        estudianteEncontrado.token = null
        estudianteEncontrado.password = await estudianteEncontrado.encryptPassword(password)
        await estudianteEncontrado.save()

        res.status(200).json({msg: "Contraseña actualizada con éxito"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//ESTUDIANTE DEBE INGRESAR UN CODIGO PARA REGISTRARASE A UN CURSO

const ingresarCodigo = async(req, res)=>{
    const {codigo} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(404).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        const cursoEncontrado = await Cursos.findOne({codigo: codigo})
        if(cursoEncontrado?.codigo !== codigo) return res.status(404).json({msg: "Lo sentimos, pero el código ingresado no es correcto"})
       
        //VALIDAR QUE YA INGRESE AL CURSO        
        const estudianteEncontrado = cursoEncontrado?.estudiantes.some((estudiante) =>
            estudiante._id.toString() === req.estudiante._id.toString()  
        )

        if(estudianteEncontrado) return res.status(404).json({msg: "Lo sentimos, pero ya te encuentras registrado en este curso"})
        await cursoEncontrado?.estudiantes.push(req.estudiante._id) 
        await cursoEncontrado.save()

        //Crear asistencia para el estudiante
        const asistenciaNueva = new Asistencias({estudiante: req.estudiante._id, curso: cursoEncontrado._id})
        await asistenciaNueva.save()
        
        //Crear actuacion para el estudiante
        const actuacionNueva = new Actuaciones({estudiante: req.estudiante._id, curso: cursoEncontrado._id})
        await actuacionNueva.save()

        res.status(200).json({msg: "Curso asignado con éxito"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}


//Visualizar cursos asignados del estudiante
const visualizarCurso = async(req, res) =>{
    try {
        const cursosEncontrado = await Cursos.find({estudiantes: req.estudiante._id}).populate("docente", "nombre apellido -_id")
        if(!cursosEncontrado || cursosEncontrado.length === 0) return res.status(404).json({msg: "No se encontraron cursos"})

        const informacionCursos = cursosEncontrado.map(curso =>{
            const {codigo, paralelo, materia, semestre, docente} = curso
            return {codigo, paralelo, materia, semestre, docente}
        })
        
        res.status(200).json({
            informacionCursos
        })
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Visualizar  asistencias del estudiante
const visualizarAsistencias = async(req, res)=>{
    const {materia, paralelo, semestre} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(404).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        const cursoEncontrado = await Cursos.findOne({
            estudiantes: req.estudiante._id, 
            materia: materia, 
            paralelo: paralelo, 
            semestre: semestre
        })

        if(!cursoEncontrado || cursoEncontrado.length === 0) return res.status(404).json({msg: "Lo sentimos, pero el curso no ha sido encontrado"})
        
        const asistenciasEncontradas = await Asistencias.findOne({estudiante: req.estudiante._id, curso: cursoEncontrado._id})
        if(!asistenciasEncontradas) return res.status(404).json({msg: "Lo sentimos, pero no se han encontrado asistencias asociadas a este estudiante"})
        const { fecha_asistencias, estado_asistencias} = asistenciasEncontradas
        res.status(200).json({
            fecha_asistencias, 
            estado_asistencias
        })
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Visualizar del actuaciones estudiante
const visualizarActuaciones = async(req, res) =>{
    const {materia, paralelo, semestre} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(404).json({msg: "Lo sentimos, todos los campos deben de estar llenos"})
        
        const cursoEncontrado = await Cursos.findOne({
            estudiantes: req.estudiante._id, 
            materia: materia, 
            paralelo: paralelo, 
            semestre: semestre
        })

        if(!cursoEncontrado || cursoEncontrado.length === 0) return res.status(404).json({msg: "Lo sentimos, pero el curso no ha sido encontrado"})
        
        const actuacionesRegistradas = await Actuaciones.findOne({estudiante: req.estudiante._id, curso: cursoEncontrado._id})
        if(!actuacionesRegistradas) return res.status(404).json({msg: "Lo sentimos, pero no se han encontrado actuaciones asociadas a este estudiante"})
        
        const {cantidad_actuaciones, descripciones, fecha_actuaciones} = actuacionesRegistradas
        res.status(200).json({
            cantidad_actuaciones, 
            descripciones,
            fecha_actuaciones
        })
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}


export { 
    registroEstudiante,
    loginEstudiante,
    modificarPerfilEstudiante,
    recuperarPasswordEstudiante,
    confirmarEmailEstudiante,
    nuevaPasswordEstudiante,
    confirmarRecuperarPassword,
    visualizarPerfilEstudiante,
    ingresarCodigo,
    visualizarCurso,
    visualizarAsistencias,
    visualizarActuaciones
}