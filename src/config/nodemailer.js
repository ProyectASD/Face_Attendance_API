import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()


let transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.HOST_MAIL,
    port: process.env.PORT_MAIL,
    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL
  }  
})

//DOCENTES

let enviarCorreo = (userMail, token) =>{
   
    let options = {
        from: process.env.USER_MAIL,
        to: userMail,
        subject: "Verificación de cuenta", 
        text: "Por favor verifica tu cuenta", 
        html: `<a href="${process.env.URL_BACKEND}/docente/confirmar/${encodeURIComponent(token)}">Click aqui</a>` 
    }

    transporter.sendMail(options, (err, info)=>{
        if(err){
            console.log(`No se ha podido enviar el correo - Error: ${err}`)
        } else {
            console.log(`Correo enviado con exito ${info.response}`)
        }
    })
}


let enviarCorreoRecuperarPassword = (userMail, token) =>{
   
    let options = {
        from: process.env.USER_MAIL,
        to: userMail,
        subject: "Recuperación de contraseña", 
        text: "Recuperación de contraseña", 
        html: `<a href="${process.env.URL_BACKEND}/docente/recuperar-password/${encodeURIComponent(token)}">Click aqui</a>` 
    }
    transporter.sendMail(options, (err, info)=>{
        if(err){
            console.log(`No se ha podido enviar el correo - Error: ${err}`)
        } else {
            console.log(`Correo enviado con exito ${info.response}`)
        }
    })
}


//ESTUDIANTES



let enviarCorreoEstudiante = (userMail, token) =>{
   
    let options = {
        from: process.env.USER_MAIL,
        to: userMail,
        subject: "Verificación de cuenta", 
        text: "Por favor verifica tu cuenta", 
        html: `<a href="${process.env.URL_BACKEND}/estudiante/confirmar/${encodeURIComponent(token)}">Click aqui</a>` 
    }

    transporter.sendMail(options, (err, info)=>{
        if(err){
            console.log(`No se ha podido enviar el correo - Error: ${err}`)
        } else {
            console.log(`Correo enviado con exito ${info.response}`)
        }
    })
}


let enviarCorreoRecuperarPasswordEstudiante = (userMail, token) =>{
   
    let options = {
        from: process.env.USER_MAIL,
        to: userMail,
        subject: "Recuperación de contraseña", 
        text: "Recuperación de contraseña", 
        html: `<a href="${process.env.URL_BACKEND}/estudiante/recuperar-password/${encodeURIComponent(token)}">Click aqui</a>` 
    }
    transporter.sendMail(options, (err, info)=>{
        if(err){
            console.log(`No se ha podido enviar el correo - Error: ${err}`)
        } else {
            console.log(`Correo enviado con exito ${info.response}`)
        }
    })
}


export {
    enviarCorreo,
    enviarCorreoRecuperarPassword,
    enviarCorreoEstudiante,
    enviarCorreoRecuperarPasswordEstudiante
}
