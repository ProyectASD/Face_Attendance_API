import app from "./server.js"
import connection from "./database.js"

app.listen(app.get("port"),() =>{
    console.log(`Servidor iniciado en el puerto ${app.get("port")}`)
})


connection()
