import mongoose from "mongoose"


const connection = async()=>{
   try {
        const {connection} = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database conectado en ${connection.host} - ${connection.port}`)
        
    
   } catch (error) {
        console.log("Error - No se ha podido conectar a la base de datos")
   }
}


export default connection