import faceapi from 'face-api.js'
import canvas from 'canvas'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'

const testEnvironment = process.env.NODE_ENV === "test"

// Obtener el directorio actual del archivo
const __filename = testEnvironment ? 'fake-path/to/file.js' :  fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurar el entorno de face-api.js con canvas
const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

// Ruta a los modelos de face-api.js
const MODEL_URL = path.join(__dirname, '../models/modelosIA') // Asegúrate de que esta ruta sea correcta

// Cargar los modelos de face-api.js
const loadModels = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL)
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL)
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL)
    console.log('Modelos cargados')
}

// Función para cargar la imagen
// const cargarImagen = async (imagePath) => {
//     try {
//         console.log(imagePath)
//         const response = await axios.get(imagePath, {responseType: "arraybuffer"})
//         const buffer = Buffer.from(response.data)
//         const img = await canvas.loadImage(buffer);
//         return img;
//     } catch (error) {
//         console.error("Error cargando la imagen:", error.message);
//         throw error;
//     }
// }


// Función para generar el descriptor facial de una imagen
const generarDescriptorFacial = async (buffer) => {
    const img = new Image()
    img.src = buffer

    const deteccion = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

    if (!deteccion) {
        throw new Error('No se detectó ningún rostro en la imagen.')
    }
    const descriptor = Array.from(deteccion.descriptor)
    console.log('Descriptor facial generado:', descriptor)
    return descriptor
}

// Función para leer los descriptores desde el archivo JSON
const leerDescriptores = (rutaDescriptores) => {
    // const rutaDescriptores = getRutaDescriptores()
    if (fs.existsSync(rutaDescriptores)) {
        const data = fs.readFileSync(rutaDescriptores, 'utf-8');
        return JSON.parse(data);
    } else {
        return []; // Si el archivo no existe, retornamos un arreglo vacío
    }
}

// Función para guardar los descriptores en el archivo JSON
const guardarDescriptores = (descriptores, rutaDescriptores) => {
    // const rutaDescriptores = getRutaDescriptores()
    fs.writeFileSync(rutaDescriptores, JSON.stringify(descriptores, null, 2));
}

// Función para agregar un nuevo descriptor al archivo JSON
const agregarDescriptorAlArchivo = async (archivo, descriptor, curso) => {
    try {            
        // Leer los descriptores existentes
        const descriptores = leerDescriptores(curso)
        // Agregar el nuevo descriptor a la lista de descriptores
        descriptores.push({ archivo, descriptor })
        // Guardar los descriptores actualizados en el archivo JSON
        guardarDescriptores(descriptores, curso)

        console.log('Descriptor agregado y guardado con éxito')
    } catch (error) {
        console.error('Error generando el descriptor facial:', error.message)
    }
}

export {loadModels, leerDescriptores, generarDescriptorFacial, agregarDescriptorAlArchivo}