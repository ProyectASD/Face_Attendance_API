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
        // text: "Por favor verifica tu cuenta", 
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificación de cuenta</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table align="center" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; margin: 20px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Encabezado -->
                <tr>
                    <td align="center" style="padding: 20px; background-color: #5FA8D3;"> <!-- Color Celeste -->
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Verificación de Cuenta</h1>
                        <img src="cid:logoCorreo" alt="Logo" width="100" style="margin-top: 15px; border-radius: 50%;">
                    </td>
                </tr>

                <!-- Cuerpo del Mensaje -->
                <tr>
                    <td style="padding: 20px; text-align: center; color: #333333;">
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                            Estimado/a usuario/a,<br><br>
                            Por favor verifica tu cuenta utilizando el siguiente token:
                        </p>
                        <p style="margin: 20px 0; font-size: 20px; font-weight: bold; color: #5FA8D3;">
                            <a href="${process.env.URL_FRONTEND}/confirmar/${encodeURIComponent(token)}">Click aqui</a>
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #666666;">
                            Si no solicitaste este proceso, por favor ignora este correo.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
        attachments: [{
            filename: 'logo.webp',
            path: './src/public/images/logo.webp',
            cid: 'logoCorreo' 
        }]
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
        // text: "Recuperación de contraseña", 
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperación de contraseña</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table align="center" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; margin: 20px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Encabezado -->
                <tr>
                    <td align="center" style="padding: 20px; background-color: #5FA8D3;"> <!-- Color Celeste -->
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Recuperación de contraseña</h1>
                        <img src="cid:logoCorreo" alt="Logo" width="100" style="margin-top: 15px; border-radius: 50%;">
                    </td>
                </tr>

                <!-- Cuerpo del Mensaje -->
                <tr>
                    <td style="padding: 20px; text-align: center; color: #333333;">
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                            Estimado/a usuario/a,<br><br>
                            Por favor recupera tu contraseña utilizando el siguiente token:
                        </p>
                        <p style="margin: 20px 0; font-size: 20px; font-weight: bold; color: #5FA8D3;">
                            <a href="${process.env.URL_FRONTEND}/recuperar-password/${token}">Click aqui</a>
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #666666;">
                            Si no solicitaste este proceso, por favor ignora este correo.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
        attachments: [{
            filename: 'logo.webp',
            path: './src/public/images/logo.webp',
            cid: 'logoCorreo' 
        }]
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
        // text: "Por favor verifica tu cuenta", 
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificación de cuenta</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table align="center" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; margin: 20px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Encabezado -->
                <tr>
                    <td align="center" style="padding: 20px; background-color: #5FA8D3;"> <!-- Color Celeste -->
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Verificación de Cuenta</h1>
                        <img src="cid:logoCorreo" alt="Logo" width="100" style="margin-top: 15px; border-radius: 50%;">
                    </td>
                </tr>

                <!-- Cuerpo del Mensaje -->
                <tr>
                    <td style="padding: 20px; text-align: center; color: #333333;">
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                            Estimado/a usuario/a,<br><br>
                            Por favor verifica tu cuenta utilizando el siguiente token:
                        </p>
                        <p style="margin: 20px 0; font-size: 20px; font-weight: bold; color: #5FA8D3;">
                            ${encodeURIComponent(token)}
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #666666;">
                            Si no solicitaste este proceso, por favor ignora este correo.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
        attachments: [{
            filename: 'logo.webp',
            path: './src/public/images/logo.webp',
            cid: 'logoCorreo' 
        }]
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
        // text: "Recuperación de contraseña", 
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperación de contraseña</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table align="center" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; margin: 20px auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <!-- Encabezado -->
                <tr>
                    <td align="center" style="padding: 20px; background-color: #5FA8D3;"> <!-- Color Celeste -->
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Recuperación de contraseña</h1>
                        <img src="cid:logoCorreo" alt="Logo" width="100" style="margin-top: 15px; border-radius: 50%;">
                    </td>
                </tr>

                <!-- Cuerpo del Mensaje -->
                <tr>
                    <td style="padding: 20px; text-align: center; color: #333333;">
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                            Estimado/a usuario/a,<br><br>
                            Por favor recupera tu contraseña utilizando el siguiente token:
                        </p>
                        <p style="margin: 20px 0; font-size: 20px; font-weight: bold; color: #5FA8D3;">
                            ${encodeURIComponent(token)}
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #666666;">
                            Si no solicitaste este proceso, por favor ignora este correo.
                        </p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `,
        attachments: [{
            filename: 'logo.webp',
            path: './src/public/images/logo.webp',
            cid: 'logoCorreo' 
        }]
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
