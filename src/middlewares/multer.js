import multer from "multer"
import path from "path"

//Configuracion de multer para almacenar en una carpeta temporal 
const almacenar = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './src/uploads/')
    },
    filename: (req,file, cb)=>{
        cb(null, `image_${Date.now()}${path.extname(file.originalname)}`)
    }
})


// //Solo se aceptan imagenes
// const fileFilter = (req,file,cb)=>{
//     const filetypes = /jpeg|jpg|png/
//     const minetype = filetypes.test(file.minetype)
//     if(minetype){
//         return cb(null, true)
//     } else{
//         cb(new Error("El archivo no es una imagen valida"))
//     }
// }


const upload = multer({ 
    storage: almacenar,
    // fileFilter: fileFilter
})

export default upload