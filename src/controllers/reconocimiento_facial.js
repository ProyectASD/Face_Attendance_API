// import cv from "opencv.js"
// import axios from "axios"
// import path, { dirname } from "path"
// import fs from "fs"
// import faceapi from "face-api.js"
// import canvas from "canvas"
// // const tf = require('@tensorflow/tfjs-node');
// import {fileURLToPath} from "url"
// import Estudiante from "../models/estudiantes.js"



// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename) 

// const reconocimientoFacial = async(req, res) =>{

// // Cargar los modelos de Face API
// const MODELS_PATH = path.join(__dirname, 'models');
// const { Canvas, Image, ImageData } = canvas;
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// // Cargar los modelos de Face API
// async function loadModels() {
//     await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH); // Para la detección de caras
//     await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH); // Para el reconocimiento facial
//     await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH); // Para detectar puntos faciales
// }

// loadModels()

// try {
//     const imageBase64 = req.body.image;

//     // Convertir base64 a Buffer y luego cargarlo como imagen para Face API
//     const imgBuffer = Buffer.from(imageBase64.split(',')[1], 'base64');
//     const img = await canvas.loadImage(imgBuffer);

//     // Detectar caras y reconocerlas
//     const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

//     if (detections) {
//         const estudiantes = await obtenerDescriptoresEstudiantes(); // Obtén los descriptores de Cloudinary
//         const faceMatcher = new faceapi.FaceMatcher(estudiantes, 0.6);  // Umbral de similitud
//         const bestMatch = faceMatcher.findBestMatch(detections.descriptor);

//         if (bestMatch.label !== 'unknown') {
//             res.json({ success: true, message: `Estudiante identificado: ${bestMatch.toString()}` });
//         } else {
//             res.json({ success: false, message: 'Estudiante no identificado' });
//         }
//     } else {
//         res.json({ success: false, message: 'No se detectó ninguna cara' });
//     }
// } catch (error) {
//     console.error('Error al procesar la imagen:', error);
//     res.status(500).json({ success: false, message: 'Error en el procesamiento' });
// }



// // Descargar imágenes desde Cloudinary
// async function downloadStudentImages(estudiantes) {
//     const imagePaths = await Promise.all(estudiantes.map(async (estudiante) => {
//         const imageUrl = estudiante.imagenUrl;
//         const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//         const imagePath = path.join(__dirname, 'temp', `${estudiante._id}.jpg`);
//         fs.writeFileSync(imagePath, Buffer.from(response.data));
//         return { id: estudiante._id, nombre: estudiante.nombre, path: imagePath };
//     }));
//     return imagePaths;
// }



// // Cargar y calcular descriptores faciales
// async function calcularDescriptores(estudiantes) {
//     return Promise.all(estudiantes.map(async(estudiante) => {
//         const img = await canvas.loadImage(estudiante.path);
//         const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
//         if (detections) {
//             return { id: estudiante.id, nombre: estudiante.nombre, descriptor: detections.descriptor };
//         }
//         return null;
//     }));
// }



// // Lógica principal
// async function main() {
//     await loadModels();
//     const estudiantes = await Estudiante.find({ curso: 'Curso1' });
//     const imagePaths = await downloadStudentImages(estudiantes);
//     return await calcularDescriptores(imagePaths);

// }

// main().catch(console.error);
// }

// export default reconocimientoFacial