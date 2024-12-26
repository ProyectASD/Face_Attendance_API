import {
    registroDocente, 
    loginDocente, 
    modificarPerfilDocente, 
    recuperarPasswordDocente, 
    nuevaPasswordDocente,
    visualizarEstudiantes, 
    actualizarEstudiante,
    visualizarEstudiante,
    eliminarEstudiante,
} from "../src/controllers/docente_controller.js"
import Docentes from "../src/models/docentes.js"
import Cursos from "../src/models/cursos.js"
import Estudiantes from "../src/models/estudiantes.js"
import crearToken from "../src/helpers/crearJWT.js"
import mongoose from "mongoose"

import Actuaciones from "../src/models/actuaciones.js"
import Asistencias from "../src/models/asistencias.js"


jest.mock("../src/config/cloudinary")
jest.mock("../src/models/docentes")
jest.mock("../src/models/estudiantes")
jest.mock("../src/models/cursos")

jest.mock("../src/models/actuaciones.js")
jest.mock("../src/models/asistencias.js")

jest.mock("../src/config/nodemailer")
jest.mock("../src/helpers/crearJWT.js")


jest.setTimeout(10000);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe("Pruebas Unitarias - Usuarios - Docentes", ()=>{
    let  req, res,mockEnviarCorreo, mockDocentes
    beforeEach(()=>{

        req = {
            body : {
                id: "123",
                nombre : "datos-prueba",
                apellido: "datos-prueba",
                ciudad: "datos-prueba",
                direccion: "datos-prueba",
                email: "docente@epn.edu.ec",
                password: "12345",
                confirmEmail: true, // Suponemos que el docente ha confirmado su correo
                confirmarPassword: "12345",
                matchPassword: jest.fn().mockResolvedValue(true), // Simulamos que la contraseña es correcta
                createToken: jest.fn().mockReturnValue("token_recuperar_simulado"),
                encryptPassword: jest.fn().mockReturnValue("password_encriptada"),
                save: jest.fn() //Guardar
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

        mockDocentes = {
            findOne: jest.fn().mockReturnThis(),
            save: jest.fn(),
            confirmEmail: jest.fn(),
            findByIdAndUpdate: jest.fn(),
        }


        mockCloudinary = jest.fn()

        mockEnviarCorreo = jest.fn()
        
    })

    afterEach(()=>{
        jest.clearAllMocks();
    })
        
    test("Deberia registrar un nuevo docente", async()=>{
        Docentes.findOne.mockResolvedValue(null)
        
        const registroDocenteHandler = (req, res) => registroDocente(req, res, {enviarCorreo: mockEnviarCorreo });
        await registroDocenteHandler(req, res);
                
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({msg: "Revise su correo para verificar su cuenta"})
    })


    test("Deberia iniciar sesión - docente", async()=>{
          // Mock de la función `findOne` para que devuelva el docente simulado
          Docentes.findOne.mockResolvedValue(req.body);
          // Mock de la función `crearToken` para generar un token simulado
          crearToken.mockReturnValue("token_simulado");
          // Llamamos al controlador `loginDocente`
          await loginDocente(req, res);  
          // Verificamos que la respuesta `status` haya sido 200 (éxito)
          expect(res.status).toHaveBeenCalledWith(200);
      
          // Verificamos que el método `json` haya sido llamado con los datos correctos
          expect(res.json).toHaveBeenCalledWith({
            id: "123",
            nombre: "datos-prueba",
            apellido: "datos-prueba",
            ciudad: "datos-prueba",
            direccion: "datos-prueba",
            email: "docente@epn.edu.ec",
            token: "token_simulado", // El token que hemos simulado
          });
      
          expect(Docentes.findOne).toHaveBeenCalledWith({ email: "docente@epn.edu.ec" });
          expect(req.body.matchPassword).toHaveBeenCalledWith("12345");
    })


    test("Deberia modificar perfil - docente", async()=>{
        Docentes.findByIdAndUpdate.mockResolvedValue({
            _id: req.body.id,
            save: req.body.save
        })
        await modificarPerfilDocente(req, res);  

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ msg: 'Perfil modificado con éxito' })
    })


    test("Deberia recuperar contraseña - docente", async()=>{
        Docentes.findOne.mockResolvedValue(req.body)
        await recuperarPasswordDocente(req, res);  

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ msg: 'Se ha enviado un correo para restablecer su contraseña' })
    })


    test("Debería actualizar la contraseña del docente", async () => {
        Docentes.findOne.mockResolvedValue({
            _id: "id-docente-prueba",
            password: "antiguaContraseña",
            encryptPassword: req.body.encryptPassword,
            save: jest.fn()
        });

        await nuevaPasswordDocente(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: "Contraseña actualizada con éxito"
        });
    });
    


})



describe("Pruebas Unitarias - Gestionamiento de estudiantes - Docentes",()=>{
    let req, res
    beforeEach(()=>{
        req = {
            body : {
                id: "777",
                codigo: "codigo-123curso",
                paralelo: "GR-prueba",
                materia: "materia de prueba",
                semestre: "2024-prueba",
                estudiantes: [new mongoose.Types.ObjectId().toString()],
                save: jest.fn()
            },
            params: {
                id: new mongoose.Types.ObjectId().toString()
            },
            query: {
                cid: new mongoose.Types.ObjectId().toString()
            }
    }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        }        
    })

    afterEach(()=>{
        jest.clearAllMocks();
    })
    
    test("Debería visualizar un estudiante", async () => {
        Estudiantes.findById.mockImplementation(()=>({
            select: jest.fn().mockResolvedValue({
                _id: req.params.id,
                nombre: "Juan",
                apellido: "Pérez",
                cedula: "1234567890",
                ciudad: "Quito",
                direccion: "Av. Siempre Viva",
                email: "juan.perez@epn.edu.ec",
                fotografia: "imagen.jpg"
            })
        }));
    
        await visualizarEstudiante(req, res);
        console.log(res.send.mock);
    
        expect(Estudiantes.findById).toHaveBeenCalledWith(req.params.id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            _id: req.params.id,
            nombre: "Juan",
            apellido: "Pérez",
            cedula: "1234567890",
            ciudad: "Quito",
            direccion: "Av. Siempre Viva",
            email: "juan.perez@epn.edu.ec",
            fotografia: "imagen.jpg"
        });
    });
    



    test("Deberia visualizar estudiantes", async()=>{
        Cursos.findOne.mockResolvedValue({
            paralelo: "GR-prueba",
            materia: "materia de prueba",
            semestre: "2024-prueba", 
            estudiantes: req.body.estudiantes
        })

        let id_simulado = new mongoose.Types.ObjectId().toString()

        Estudiantes.find.mockImplementation(()=>({
            select: jest.fn().mockResolvedValue([{
                _id: id_simulado,
                nombre : "datos-prueba",
                apellido: "datos-prueba",
                cedula : "1234567890",
                ciudad: "datos-prueba",
                direccion: "datos-prueba",
                email: "estudiantes@hotmail.com",
                password: "12345",
                fotografia: "imagen.jpg"
                },
                {
                    _id: id_simulado,
                    nombre : "datos-prueba2",
                    apellido: "datos-prueba2",
                    cedula : "1234567891",
                    ciudad: "datos-prueba2",
                    direccion: "datos-prueba2",
                    email: "estudiantes2@hotmail.com",
                    password: "12345",
                    fotografia: "imagen2.jpg"
                }
            ])
        }))

        await visualizarEstudiantes(req, res)
        console.log(res.send.mock);

        expect(res.status).toHaveBeenCalledWith(200)        
        expect(res.json).toHaveBeenCalledWith([{
                _id: id_simulado,
                nombre : "datos-prueba",
                apellido: "datos-prueba",
                cedula : "1234567890",
                ciudad: "datos-prueba",
                direccion: "datos-prueba",
                email: "estudiantes@hotmail.com",
                password: "12345",
                fotografia: "imagen.jpg"
            },
            {
                _id: id_simulado,
                nombre : "datos-prueba2",
                apellido: "datos-prueba2",
                cedula : "1234567891",
                ciudad: "datos-prueba2",
                direccion: "datos-prueba2",
                email: "estudiantes2@hotmail.com",
                password: "12345",
                fotografia: "imagen2.jpg"
            }   
        ]);
    })


    test("Deberia actualizar datos personales del estudiante", async()=>{
        Estudiantes.findByIdAndUpdate.mockResolvedValue({
            _id: req.body.id,
            ciudad: "datos-prueba2",
            direccion: "datos-prueba2",
            telefono: "0912345678",
            save: req.body.save
        })
        await actualizarEstudiante(req, res)

        expect(res.status).toHaveBeenCalledWith(200)  
        expect(res.json).toHaveBeenCalledWith({msg: "Estudiante actualizado con éxito"})        
    })

    test("Debería eliminar un estudiante", async () => {
        const estudianteId = new mongoose.Types.ObjectId();
        req.params = { id: estudianteId };

        Estudiantes.findById.mockResolvedValue({
            _id: estudianteId,
            nombre: "Juan",
            apellido: "Pérez"
        });
    
        Cursos.findById.mockResolvedValue({
            _id: req.query.cid,
            estudiantes: [estudianteId],
            save: jest.fn()
        });
    
        Asistencias.findOne.mockResolvedValue(null);
        Actuaciones.findOne.mockResolvedValue(null);
    
        await eliminarEstudiante(req, res);
            
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: "Estudiante eliminado con éxito" });

    });

    
})



