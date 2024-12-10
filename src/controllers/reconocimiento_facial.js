import faceapi from 'face-api.js'
import canvas from 'canvas'
import fs from 'fs'
import {leerDescriptores} from '../service/funciones_reconocimiento.js'
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Función para procesar la imagen de la persona frente a la cámara
const reconocimientoFacial = async (req, res) => {
    try {
        const imagePath = req.file.path; // Obtener la imagen cargada desde el frontend
        const img = await canvas.loadImage(imagePath); // Cargar la imagen

        // Detectar el rostro en la imagen
        const detecciones = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

        if (!detecciones) {
            return res.status(404).json({ msg: 'No se detectó ningún rostro' });
        }

        const curso =  `${req.body?.materia}-${req.body?.paralelo}-${req.body?.semestre}`
        
        const rutaDescriptores = path.join(__dirname, `../uploads/${curso}/descriptoresEstudiantes.json`)
        // Leer los descriptores faciales guardados en el archivo JSON
        const descriptores = leerDescriptores(rutaDescriptores);

        if (descriptores.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron descriptores faciales guardados' });
        }

        // Crear un arreglo de descriptores etiquetados para usar con FaceMatcher
        const descriptoresGuardados = descriptores.map(descriptorData => {
            // Verificar que el descriptor tenga la longitud correcta (128 elementos)
            const descriptorArray = Object.values(descriptorData.descriptor);
            if (descriptorArray.length !== 128) {
                console.error(`Descriptor para ${descriptorData.archivo} tiene longitud incorrecta.`);
                return null;
            }
            
            // Asegurarse de que descriptorData.descriptor sea un arreglo de 128 números flotantes
            const faceDescriptor = new Float32Array(descriptorArray);
            console.log("nombre del archivo json", descriptorData.archivo)
            // return { label: descriptorData.archivo, descriptor: faceDescriptor , ejemplo: descriptorData.archivo.toString()};
            return new faceapi.LabeledFaceDescriptors(descriptorData.archivo, [faceDescriptor])
        }).filter(Boolean);  // Eliminar los descriptores nulos si hay errores en los datos


        if (descriptoresGuardados.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron descriptores válidos para comparación' });
        }

        // Crear un FaceMatcher con los descriptores guardados y el umbral de coincidencia
        const faceMatcher = new faceapi.FaceMatcher(descriptoresGuardados, 0.5); // Umbral ajustable
        console.log("perro veneco: ",faceMatcher);
        
        const coincidencia = faceMatcher.findBestMatch(detecciones.descriptor);
        
        // Eliminar la imagen temporal después del reconocimiento
        fs.unlinkSync(imagePath);

        if (coincidencia.label !== 'unknown' && coincidencia.distance <= 0.5) {
            console.log("Si se reconoció la imagen", coincidencia);
            return res.status(200).json({ msg: 'Persona reconocida', coincidencia: coincidencia.toString()});
        } else {
            return res.status(404).json({ msg: 'Rostro no reconocido' });
        }

    } catch (error) {
        res.status(500).json({ msg: `Hubo un problema en el servidor: ${error.message}` });
    }
}

export default reconocimientoFacial