import axios from "axios";
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";
import { agregarDescriptorAlArchivo } from "./funciones_reconocimiento.js";
//Directorio temporal


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const directorioExiste = (dir)=>{
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive: true})
    }
}


//Proceso para descargar la imagen
const descargarImgCloudinary = async(url, nombreArchivo)=>{
    const response = await axios({
        url, 
        method: "GET",
        responseType: "stream"
    })
    
    const writer = fs.createWriteStream(nombreArchivo)
    response.data.pipe(writer)

    return new Promise((resolve, reject)=>{
      writer.on("finish", ()=> resolve(nombreArchivo))
      writer.on("error", reject)
    })
}



//Descargar las imagenes del estudiantes
const descargarImgsEstudiantes = async(estudiantesURL, curso)=>{
    
    const directorioDescarga = path.join(__dirname, "../uploads", curso)
    
    
    directorioExiste(directorioDescarga)

    let imagen, descriptor 
    const descargarPromesa = estudiantesURL.map(async(url)=>{
        const nombreArchivo = path.join(directorioDescarga,`estudiante_${url.nombres}.jpg`)
        imagen = url.nombres
        descriptor = url.descriptor
        descargarImgCloudinary(url.imagen, nombreArchivo)
        // Ruta al archivo JSON que almacena los descriptores faciales
        const rutaDescriptores = path.join(__dirname, `../uploads/${curso}/descriptoresEstudiantes.json`)
        await agregarDescriptorAlArchivo(imagen, descriptor, rutaDescriptores) 
    })

    await Promise.all(descargarPromesa)    
    return directorioDescarga
}

// console.log("las imagenes descargadas afuera ",almacenarCurso);


//Eliminar carpeta y su contenido
const eliminarCarpetaTemporal = async(curso)=>{
    // await fs.promises.rm(carpetaTemporal, { recursive: true, force: true})
    
    const carpetaTemporal = path.join(__dirname, "../uploads", curso)

    if(fs.existsSync(carpetaTemporal)){
        fs.rmSync(carpetaTemporal, {recursive: true, force: true})
    }
}

  

export {descargarImgsEstudiantes, eliminarCarpetaTemporal}