import { 
    registroEstudiante, 
    loginEstudiante, 
    modificarPerfilEstudiante, 
    recuperarPasswordEstudiante, 
    visualizarCurso, 
    visualizarActuaciones, 
    visualizarAsistencias, 
    ingresarCodigo,
    nuevaPasswordEstudiante
} from "../src/controllers/estudiante_controller.js"
import cloudinary from "../src/config/cloudinary.js"
import Estudiantes from "../src/models/estudiantes.js"
import crearToken from "../src/helpers/crearJWT.js"
import mongoose from "mongoose"
import Cursos from "../src/models/cursos.js"

import Actuaciones from "../src/models/actuaciones.js"
import Asistencias from "../src/models/asistencias.js"
import * as funcionesReconocimiento  from "../src/service/funciones_reconocimiento.js"
import {generarDescriptorFacial} from "../src/service/funciones_reconocimiento.js"

jest.mock("../src/config/cloudinary")
jest.mock("../src/config/nodemailer")
jest.mock("../src/models/estudiantes")
jest.mock("../src/helpers/crearJWT.js")
jest.mock("../src/models/cursos.js")
jest.mock("../src/models/actuaciones.js")
jest.mock("../src/models/asistencias.js")
jest.mock("../src/service/funciones_reconocimiento.js")


// Mock de las dependencias de módulos

jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: 'mock-data' }),
}))

jest.mock('url', () => ({
    ...jest.requireActual('url'),
    fileURLToPath: jest.fn().mockReturnValue('/fake/path/to/file.js'), 
  }))
  
  jest.mock('path', () => ({
    ...jest.requireActual('path'),
    dirname: jest.fn().mockReturnValue('/fake/directory'), 
  }))
  
  jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: jest.fn().mockReturnValue(true), 
    readFileSync: jest.fn().mockReturnValue(JSON.stringify([])), 
    writeFileSync: jest.fn((path, data) => {
        console.log(`Mock write to: ${path}`);
      }),
  }))
  
  jest.mock('canvas', () => ({
    loadImage: jest.fn().mockResolvedValue({}), 
    Image: jest.fn(), 
    ImageData: jest.fn(), 
  }))
  
  jest.mock('face-api.js', () => ({
    env: {
      monkeyPatch: jest.fn(), 
    },
    nets: {
      ssdMobilenetv1: {
        loadFromDisk: jest.fn().mockResolvedValue(), 
      },
      faceLandmark68Net: {
        loadFromDisk: jest.fn().mockResolvedValue(), 
      },
      faceRecognitionNet: {
        loadFromDisk: jest.fn().mockResolvedValue(), 
      },
    },
    detectSingleFace: jest.fn(() => ({
        withFaceLandmarks: jest.fn(() => ({
            withFaceDescriptor: jest.fn(() => ({
                descriptor: new Float32Array([0.1, 0.2, 0.3, 0.4]),
                landmarks: {},
            })),
        })),
    })),
  }))
  
  jest.spyOn(funcionesReconocimiento , 'generarDescriptorFacial').mockResolvedValue([0.1, 0.2, 0.3, 0.4])
  
  
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
jest.setTimeout(10000);
describe("Pruebas Unitarias - Usuarios - Estudiantes", ()=>{
    let  req, res,mockEnviarCorreo,mockEstudiantes
beforeEach(()=>{
    req = {
        body : {
            id: "123",
            nombre : "datos-prueba",
            apellido: "datos-prueba",
            ciudad: "datos-prueba",
            direccion: "datos-prueba",
            email: "estudiante@epn.edu.ec",
            password: "12345",
            descriptor: [0.1, 0.2, 0.3, 0.4],
            confirmEmail: true, 
            confirmarPassword: "12345",   
            matchPassword: jest.fn().mockResolvedValue(true), 
            createToken: jest.fn().mockReturnValue("token_recuperar_simulado"),
            encryptPassword: jest.fn().mockReturnValue("password_encriptada"),

            save: jest.fn() 
        },
        file: {
            buffer: Buffer.from("Contenido del archivo")
        },
        params: {
            id: new mongoose.Types.ObjectId().toString()
        }
    }
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
    }

mockEstudiantes = {
    findOne: jest.fn(),
    save: jest.fn(),
    findByIdAndUpdate: jest.fn()
}

    mockCloudinary = jest.fn()

    mockEnviarCorreo = jest.fn()

})

afterEach(()=>{
    jest.clearAllMocks();
})

test("Debería registrar un estudiante", async () => {
    Estudiantes.findOne.mockResolvedValue(null)
    Estudiantes.findByIdAndUpdate.mockResolvedValue({
        _id: "id-mock",
        descriptor: [0.1, 0.2, 0.3, 0.4],
        save: jest.fn().mockResolvedValue({})
    })

    // Simular la carga de una imagen en Cloudinary con un retraso de 5 segundos.
    cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        return new Promise((resolve)=>{
            setTimeout(() => {
                // Simula que Cloudinary devuelve la URL de la imagen después de 5 segundos.
                callback(null, { secure_url: 'https://cloudinary.com/testimage.jpg' ,

                });
                resolve()
            }); 
            return { end: jest.fn() }
        })
    });
    await sleep(5000)
    await generarDescriptorFacial.mockResolvedValue([0.1, 0.2, 0.3, 0.4]);


    const registroEstudianteHandler = (req, res) => 
        registroEstudiante(req, res, { Estudiantes: mockEstudiantes, enviarCorreoEstudiante: mockEnviarCorreo });
    
    await registroEstudianteHandler(req, res);
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
});


test("Debería iniciar sesión - estudiante", async () => {
    Estudiantes.findOne.mockResolvedValue(req.body)
    crearToken.mockReturnValue("token_simulado");
    await loginEstudiante(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
        nombre: "datos-prueba",
        apellido: "datos-prueba",
        ciudad: "datos-prueba",
        direccion: "datos-prueba",
        email: "estudiante@epn.edu.ec",
        token: "token_simulado", 
      });

      expect(Estudiantes.findOne).toHaveBeenCalledWith({ email: "estudiante@epn.edu.ec" });
      expect(req.body.matchPassword).toHaveBeenCalledWith("12345");
});


test("Deberia modificar perfil - estudiante", async()=>{
    Estudiantes.findByIdAndUpdate.mockResolvedValue({
        _id: req.body.id,
        fotografia: "https://example.com/image.jpg", 
        descriptor: [0.1, 0.2, 0.3, 0.4],
        save: req.body.save
    })

    cloudinary.uploader.destroy.mockImplementation((options, callback) => {
        callback(null, { result: "ok"});
    })

    cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
        return {
            end: jest.fn(() => {
                callback(null, { secure_url: "https://cloudinary.com/newimage.jpg" });
            }),
        };
    });
    await sleep(5000)

    await modificarPerfilEstudiante(req, res);  
    console.log("Esto es en modificar perfil", res.json.mock);
    
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Perfil modificado con éxito' })
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();

})



test("Deberia recuperar contraseña - estudiante", async()=>{
    Estudiantes.findOne.mockResolvedValue(req.body)
    await recuperarPasswordEstudiante(req, res);  

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ msg: 'Se envio un correo para restablecer su contraseña' })
})


test('Deberia actualizar la contraseña de un estudiante', async () => {
     Estudiantes.findOne.mockResolvedValue({
        _id: 'id-estudiante-prueba',
        password: "antiguaContraseña",
        encryptPassword: req.body.encryptPassword,
        save: jest.fn()
      })

      await nuevaPasswordEstudiante(req, res)
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({msg: 'Contraseña actualizada con éxito'})
    })
})



describe("Pruebas Unitarias - Visualización de Cursos - Estudiante", () => {
    let req, res
    beforeEach(() => {
        req = {
            body: {
                id: "777",
                codigo: "codigo-123curso",
                paralelo: "GR-prueba",
                materia: "materia de prueba",
                semestre: "2024-prueba",
                estudiantes: [new mongoose.Types.ObjectId().toString()],
                save: jest.fn()
            },
            docente: {
                id: new mongoose.Types.ObjectId().toString(),
            },
            estudiante: {
                id: new mongoose.Types.ObjectId().toString(),
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        }
    })

    afterEach(() => {
        jest.clearAllMocks();
    })


    test("Deberia visualizar los cursos en los que esta registrado el estudiante", async () => {
        Cursos.find.mockImplementation(() => ({
            populate: jest.fn().mockResolvedValue([
                {
                    codigo: "codigo-123curso",
                    paralelo: "GR-prueba",
                    materia: "materia de prueba",
                    semestre: "2024-prueba",
                    docente: {
                        nombre: "Carlos",
                        apellido: "García"
                    }
                },
                {
                    codigo: "codigo-456curso",
                    paralelo: "GR-secundario",
                    materia: "materia secundaria",
                    semestre: "2025-prueba",
                    docente: {
                        nombre: "María",
                        apellido: "López"
                    }
                }
            
            ])
        }))

        await visualizarCurso(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            {
                informacionCursos: [
                    {
                        codigo: "codigo-123curso",
                        paralelo: "GR-prueba",
                        materia: "materia de prueba",
                        semestre: "2024-prueba",
                        docente: {
                            nombre: "Carlos",
                            apellido: "García"
                        }
                    },
                    {
                        codigo: "codigo-456curso",
                        paralelo: "GR-secundario",
                        materia: "materia secundaria",
                        semestre: "2025-prueba",
                        docente: {
                            nombre: "María",
                            apellido: "López"
                        }
                    }
                ]

            }
        )
    })

    test("Deberia ingresar el codigo del curso en el que se va a registrar", async()=>{
        Cursos.findOne.mockResolvedValue({
            codigo: "codigo-123curso",
            paralelo: "GR-prueba",
            materia: "materia de prueba",
            semestre: "2024-prueba",
            estudiantes: [],
            save: jest.fn()
        })

        Asistencias.mockImplementation(()=>({save: jest.fn()}))
        Actuaciones.mockImplementation(()=>({save: jest.fn()}))

        await ingresarCodigo(req, res)
        
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({msg: "Curso asignado con éxito"})
        expect(Cursos.findOne).toHaveBeenCalledWith({ codigo: "codigo-123curso" });
    })
})



describe("Pruebas Unitarias - Visualización de Actuaciones - Estudiante", () => {
    let req, res
    beforeEach(() => {
        req = {
            body: {
                id: "777",
                codigo: "codigo-123curso",
                paralelo: "GR-prueba",
                materia: "materia de prueba",
                semestre: "2024-prueba",
                estudiantes: [new mongoose.Types.ObjectId().toString()],
                save: jest.fn()
            },
            docente: {
                id: new mongoose.Types.ObjectId().toString(),
            },
            estudiante: {
                id: new mongoose.Types.ObjectId().toString(),
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        }
    })

    afterEach(() => {
        jest.clearAllMocks();
    })


    test("Deberia visualizar el reporte de actuaciones del estudiante", async () => {
        Cursos.findOne.mockResolvedValue({
            codigo: "codigo-123curso",
            paralelo: "GR-prueba",
            materia: "materia de prueba",
            semestre: "2024-prueba",
            estudiantes: req.estudiante
        })

        Actuaciones.findOne.mockResolvedValue({ 
            cantidad_actuaciones: 12,
            descripciones: [["Come en clase", "todo bien Fernando"], ["Muy bien fernando"]],
            fecha_actuaciones: ["19/11/2024", "20/11/2024"]
        })


        await visualizarActuaciones(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            {
                cantidad_actuaciones: 12,
                descripciones: [["Come en clase", "todo bien Fernando"], ["Muy bien fernando"]],
                fecha_actuaciones: ["19/11/2024", "20/11/2024"]
            }
        )
    })

})



describe("Pruebas Unitarias - Visualización de Asistencias - Estudiante", () => {
    let req, res
    beforeEach(() => {
        req = {
            body: {
                id: "777",
                codigo: "codigo-123curso",
                paralelo: "GR-prueba",
                materia: "materia de prueba",
                semestre: "2024-prueba",
                estudiantes: [new mongoose.Types.ObjectId().toString()],
                save: jest.fn()
            },
            docente: {
                id: new mongoose.Types.ObjectId().toString(),
            },
            estudiante: {
                id: new mongoose.Types.ObjectId().toString(),
            }
        }

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        }
    })

    afterEach(() => {
        jest.clearAllMocks();
    })


    test("Deberia visualizar el reporte de asistencias del estudiante", async () => {
        Cursos.findOne.mockResolvedValue({
            codigo: "codigo-123curso",
            paralelo: "GR-prueba",
            materia: "materia de prueba",
            semestre: "2024-prueba",
            estudiantes: req.estudiante
        })

        Asistencias.findOne.mockResolvedValue({ 
            fecha_asistencias: ["19/11/2024", "20/11/2024", "23/11/2024", "27/11/2024"],
            estado_asistencias: ["presente", "presente", "presente", "presente"],
        })


        await visualizarAsistencias(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(
            {
                fecha_asistencias: ["19/11/2024", "20/11/2024", "23/11/2024", "27/11/2024"],
                estado_asistencias: ["presente", "presente", "presente", "presente"],
            }
        )
    })






})

