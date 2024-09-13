import mongoose from "mongoose"
import { enviarCorreoEstudiante, enviarCorreoRecuperarPasswordEstudiante } from "../config/nodemailer.js"
import crearToken from "../helpers/crearJWT.js"
import Estudiantes from "../models/estudiantes.js"



//Registrarse
const registroEstudiante = async(req,res)=>{
    const {email, password} = req.body
    try {
        if(Object.values(req.body).includes("")) return res.status(404).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        // if(!email.includes("epn.edu.ec")) return res.status(404).json({msg: "Lo sentimos pero el correo ingresado debe ser institucional"})
        
        const emailEncontrado = await Estudiantes.findOne({email})
        if(emailEncontrado) return res.status(404).json({msg: "Lo sentimos pero este email ya se encuentra registrado"})
     
        const nuevoEstudiante = new Estudiantes(req.body)
        nuevoEstudiante.password = await nuevoEstudiante.encryptPassword(password)
        const token = await nuevoEstudiante?.createToken()
        nuevoEstudiante.token = token
    
        enviarCorreoEstudiante(nuevoEstudiante.email, token)
        await nuevoEstudiante?.save()

        res.status(200).json({msg: "Revise su correo para verificar su cuenta"})
    } catch (error) {
       res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)       
    }
}


//Confirmar correo
const confirmarEmailEstudiante = async(req,res)=>{
    try {
        if(!(req.params.token)) return res.status(404).json({msg: "Lo sentimos no se pudo verificar la cuenta"})
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
        if(estudianteEncontrado?.confirmEmail == false) return res.status(404).json({msg: "Lo sentimos pero la cuenta no ha sido verificada"})
        if(!estudianteEncontrado) return res.status(404).json({msg: "Lo sentimos pero el estudiante no se encuentra registrado"})

        const confirmarPassword = await estudianteEncontrado.matchPassword(password)
        if(!confirmarPassword) return res.status(404).json({msg: "Lo sentimos pero la contraseña es incorrecta"})

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
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({msg: "Lo sentimos pero el id no es válido"})
        if(Object.values(req.body).includes("")) return res.status(400).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        const estudiantePerfil = await Estudiantes.findByIdAndUpdate(id, req.body)
        if(!estudiantePerfil) return res.status(404).json({msg: "Lo sentimos pero el estudiante no se encuentra registrado"})
        await estudiantePerfil.save()
        res.status(200).json({msg: "Perfil modificado con éxito"})
    } catch (error) {
        res.status(500).send(`Hubo un problema con el servidor - Error ${error.message}`)   
    }
}

//Recuperar password
const recuperarPasswordEstudiante = async(req,res)=>{
    const {email} = req.body
    try {
        if(Object.values(req.body).includes("") || email === undefined) return res.status(404).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        const estudianteEncontrado = await Estudiantes.findOne({email})
        if(!estudianteEncontrado) return res.status(404).json({msg: "Lo sentimos pero el estudiante no se encuentra registrado"})

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
        if(!(req.params.token)) return res.status(404).json({msg: "Lo sentimos no se pudo verificar la recuperación de la contraseña"})
        const estudianteEncontrado = await Estudiantes.findOne({token: req.params.token})
        if(estudianteEncontrado?.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos no se pudo validar la cuenta"})
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
        if(Object.values(req.body).includes("") || password === undefined || confirmarPassword === undefined) return res.status(404).json({msg: "Lo sentimos todos los campos deben de estar llenos"})
        if(password !== confirmarPassword) return res.status(404).json({msg: "Lo sentimos pero las contraseñas no coinciden"})
        
        const estudianteEncontrado = await Estudiantes.findOne({token: req.params.token})
        if(estudianteEncontrado?.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos no se pudo validar la cuenta"})
        
        estudianteEncontrado.token = null
        estudianteEncontrado.password = await estudianteEncontrado.encryptPassword(password)
        await estudianteEncontrado.save()

        res.status(200).json({msg: "Contraseña actualizada con exito"})
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
    confirmarRecuperarPassword
}