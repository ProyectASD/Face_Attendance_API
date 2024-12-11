import app from "./server.js"
import connection from "./database.js"
import { loadModels } from "./service/funciones_reconocimiento.js"

app.listen(app.get("port"),() =>{
    console.log(`Servidor iniciado en el puerto ${app.get("port")}`)
})

connection()

// Inicializar los modelos al cargar el módulo
loadModels().catch(error => console.error('Error al cargar los modelos:', error))