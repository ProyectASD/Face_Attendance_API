import axios from "axios";
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url";

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

    const descargarPromesa = estudiantesURL.map((url, index)=>{
        const nombreArchivo = path.join(directorioDescarga,`estudiante_${index}.jpg`)
       
        descargarImgCloudinary(url, nombreArchivo)
    })

    await Promise.all(descargarPromesa)
    return directorioDescarga
}


//Eliminar carpeta y su contenido
const eliminarCarpetaTemporal = async(curso)=>{
    // await fs.promises.rm(carpetaTemporal, { recursive: true, force: true})
    
    const carpetaTemporal = path.join(__dirname, "../uploads", curso)

    if(fs.existsSync(carpetaTemporal)){
        fs.rmSync(carpetaTemporal, {recursive: true, force: true})
    }
}

  

export {descargarImgsEstudiantes, eliminarCarpetaTemporal}