// // src/controllers/faceRecognitionController.js
// import faceapi from 'face-api.js';
// import canvas from 'canvas';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Obtener el directorio actual del archivo
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configurar el entorno de face-api.js con canvas
// const { Canvas, Image, ImageData } = canvas;
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// // Ruta a los modelos de face-api.js
// const MODEL_URL = path.join(__dirname, '../models/modelosIA'); // Asegúrate de que esta ruta sea correcta

// // Cargar los modelos de face-api.js
// const loadModels = async () => {
//     await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
//     await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
//     await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
//     console.log('Modelos cargados');
// };

// // Función para cargar la imagen
// const cargarImagen = async (imagePath) => {
//     const imageBuffer = fs.readFileSync(imagePath);
//     const img = await canvas.loadImage(imageBuffer);
//     return img;
// };

// // Función para procesar la imagen de la persona frente a la cámara
// const reconocimientoFacial = async (req, res) => {
//     try {
//         const imagePath = req.file.path; // Obtener la imagen cargada desde el frontend
//         const img = await canvas.loadImage(imagePath); // Cargar la imagen

//         // Dibujar la imagen en el canvas
//         const canvasElement = canvas.createCanvas(img.width, img.height);
//         const ctx = canvasElement.getContext('2d');
//         ctx.drawImage(img, 0, 0);

//         // Detectar el rostro en la imagen
//         const detecciones = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

//         if (!detecciones) {
//             return res.status(404).json({ msg: 'No se detectó ningún rostro' });
//         }

//         // Cargar la imagen de referencia desde la carpeta "uploads"
//         const imagenReferencia = await cargarImagen(path.join(__dirname, '../uploads/imageMIA.jpg'));
//         const deteccionReferencia = await faceapi.detectSingleFace(imagenReferencia).withFaceLandmarks().withFaceDescriptor();

//         if (!deteccionReferencia) {
//             return res.status(404).json({ msg: 'No se encontró la imagen de referencia' });
//         }

//         console.log("Deteccion referencia",deteccionReferencia)

//         // Comparar los descriptores faciales
//         const faceMatcher = new faceapi.FaceMatcher(deteccionReferencia);
//         const mejorCoincidencia = faceMatcher.findBestMatch(detecciones.descriptor);
//         console.log("mejor coincidencia: ", mejorCoincidencia)
//         // Enviar la respuesta al frontend
//         if (mejorCoincidencia.label === 'unknown') {
//             res.status(200).json({ msg: 'Desconocido' });
//         } 
        
//         res.status(200).json({ msg: 'Persona reconocida', coincidencia: mejorCoincidencia?.toString() });
//         console.log("si se reconocio la imagen")
//         // Eliminar la imagen temporal después del reconocimiento
//         fs.unlinkSync(imagePath);
//     } catch (error) {
//         res.status(500).json({ msg: `Hubo un problema en el servidor: ${error.message}` });
//     }
// };

// // Inicializar los modelos al cargar el módulo
// loadModels().catch(error => console.error('Error al cargar los modelos:', error));

// export default reconocimientoFacial;




// src/controllers/faceRecognitionController.js
import faceapi from 'face-api.js';
import canvas from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar el entorno de face-api.js con canvas
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Ruta a los modelos de face-api.js
const MODEL_URL = path.join(__dirname, '../models/modelosIA'); // Asegúrate de que esta ruta sea correcta

// Cargar los modelos de face-api.js
const loadModels = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
    console.log('Modelos cargados');
};

// Función para cargar la imagen
const cargarImagen = async (imagePath) => {
    const imageBuffer = fs.readFileSync(imagePath);
    const img = await canvas.loadImage(imageBuffer);
    return img;
};

// Función para procesar la imagen de la persona frente a la cámara
const reconocimientoFacial = async (req, res) => {
    try {
        const imagePath = req.file.path; // Obtener la imagen cargada desde el frontend
        const img = await canvas.loadImage(imagePath); // Cargar la imagen

        // Dibujar la imagen en el canvas
        const canvasElement = canvas.createCanvas(img.width, img.height);
        const ctx = canvasElement.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Detectar el rostro en la imagen
        const detecciones = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

        if (!detecciones) {
            return res.status(404).json({ msg: 'No se detectó ningún rostro' });
        }

        //Validación de carpeta temporal
        const carpetaTemporal = path.join(__dirname, "../uploads")
        if(!fs.existsSync(carpetaTemporal)){
            return res.status(500).json({ msg: 'Error: La carpeta temporal no existe. Verifica la configuración del sistema.' });
        }
        
        
        //Iterar sobre las imágenes en la carpeta temporal
        const archivos = fs.readFileSync(carpetaTemporal)
        let mejorCoincidencia = null
        
        for(const archivo of archivos){
            const rutaImagenEstudiante = path.join(carpetaTemporal, archivo)
            const imagenEstudiante = await cargarImagen(rutaImagenEstudiante);
            const deteccionEstudiante = await faceapi.detectSingleFace(imagenEstudiante).withFaceLandmarks().withFaceDescriptor();
            
            if (deteccionEstudiante) {
        
                console.log("Deteccion referencia",deteccionEstudiante)
                const faceMatcher = new faceapi.FaceMatcher(detecciones);
                // Comparar los descriptores faciales
                const coincidencia = faceMatcher.findBestMatch(deteccionEstudiante.descriptor);
                console.log("mejor coincidencia: ", coincidencia)
                // Enviar la respuesta al frontend
                if (coincidencia.label !== 'unknown') {
                    mejorCoincidencia = coincidencia 
                    fs.unlinkSync(rutaImagenEstudiante) //Eliminar la imagen reconocida   
                    break              
                } 
            }
        }

        if(mejorCoincidencia){
            console.log("si se reconocio la imagen")
            // Eliminar la imagen temporal después del reconocimiento
            fs.unlinkSync(imagePath);
            return res.status(200).json({ msg: 'Persona reconocida', coincidencia: mejorCoincidencia?.toString() });
        }else {
            return res.status(404).json({ msg: 'Rostro no reconocido'});
        }
        
    } catch (error) {
        res.status(500).json({ msg: `Hubo un problema en el servidor: ${error.message}` });
    } 
};

// Inicializar los modelos al cargar el módulo
loadModels().catch(error => console.error('Error al cargar los modelos:', error));

export default reconocimientoFacial;


