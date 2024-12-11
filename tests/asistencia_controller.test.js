import {
    visualizarAsistencias, 
    visualizarReporte,
    visualizarAsistencia,
    actualizarAsistencia,
    eliminarAsistencia,
} from "../src/controllers/asistencia_controller.js"
import Cursos from "../src/models/cursos.js"
import Asistencias from "../src/models/asistencias.js"
import Estudiantes from "../src/models/estudiantes.js"
import mongoose from "mongoose"
import { descargarImgsEstudiantes, eliminarCarpetaTemporal } from '../src/service/imgs_cloudinary.js';


jest.mock("../src/models/asistencias.js")
jest.mock("../src/models/estudiantes.js")
jest.mock("../src/models/cursos.js")
jest.mock('../src/service/imgs_cloudinary.js', () => ({
    descargarImgsEstudiantes: jest.fn(),
    eliminarCarpetaTemporal: jest.fn(),
  }));


describe("Pruebas Unitarias - Gestionamiento de asistencias - Docentes",()=>{
    let req, res
    beforeEach(()=>{
        req = {
            body : {
                id: "777",
                codigo: "codigo-123curso",
                paralelo: "GR-prueba",
                materia: "materia de prueba",
                semestre: "2024-prueba",
                fecha: "01/12/2024",
                estudiantes: [new mongoose.Types.ObjectId().toString()],
                save: jest.fn()
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
    })

    afterEach(()=>{
        jest.clearAllMocks();
    })
    

    test("Deberia visualizar asistencias", async()=>{
        Cursos.findOne.mockResolvedValue({
            paralelo: "GR-prueba",
            materia: "materia de prueba",
            semestre: "2024-prueba", 
            estudiantes: req.body.estudiantes
        })


        let id_simulado, id_curso_simulado = new mongoose.Types.ObjectId().toString()

        Asistencias.find.mockImplementation(() => ({
            select: jest.fn(()=>({
                populate: jest.fn().mockResolvedValue([
                    {
                        _id: id_simulado,
                        cantidad_asistencias: 4,
                        estudiante: mongoose.Types.ObjectId.toString(),
                        fecha_asistencias: ["19/11/2024", "20/11/2024", "23/11/2024", "27/11/2024"],
                        estado_asistencias: ["presente", "presente", "presente", "presente"],
                        curso: id_curso_simulado,
                        cantidad_presentes: 4,
                        cantidad_ausencias: 0,
                    },
                    {
                        _id: id_simulado,
                        cantidad_asistencias: 1,
                        estudiante: mongoose.Types.ObjectId.toString(),
                        fecha_asistencias: ["19/11/2024"],
                        estado_asistencias: ["ausente"],
                        curso: id_curso_simulado,
                        cantidad_presentes: 0,
                        cantidad_ausencias: 1,
                    }
                ])
            }))
        }));

        Estudiantes.findById.mockResolvedValueOnce({
            _id: req.body.estudiantes[0],
            nombre: "datos-prueba",
            apellido: "datos-prueba",
            cedula: "1234567890",
            ciudad: "datos-prueba",
            direccion: "datos-prueba",
            email: "estudiantes@hotmail.com",
            password: "12345",
            fotografia: "imagen.jpg",
          });

        descargarImgsEstudiantes.mockResolvedValueOnce()
        await visualizarAsistencias(req, res)

          

        expect(res.status).toHaveBeenCalledWith(200)        
        expect(res.json).toHaveBeenCalledWith([{
            _id: id_simulado,
            cantidad_asistencias: 4,
            estudiante: mongoose.Types.ObjectId.toString(),
            fecha_asistencias: ["19/11/2024", "20/11/2024", "23/11/2024", "27/11/2024"],
            estado_asistencias: ["presente", "presente", "presente", "presente"],
            curso: id_curso_simulado,
            cantidad_presentes: 4,
            cantidad_ausencias: 0,
        },
        {
            _id: id_simulado,
            cantidad_asistencias: 1,
            estudiante: mongoose.Types.ObjectId.toString(),
            fecha_asistencias: ["19/11/2024"],
            estado_asistencias: ["ausente"],
            curso: id_curso_simulado,
            cantidad_presentes: 0,
            cantidad_ausencias: 1,
        }  
        ]);
    })


    test("Deberia visualizar reporte de asistencias", async()=>{
        Cursos.findOne.mockResolvedValue({
            paralelo: "GR-prueba",
            materia: "materia de prueba",
            semestre: "2024-prueba", 
            estudiantes: req.body.estudiantes
        })

        let id_simulado, id_curso_simulado = new mongoose.Types.ObjectId().toString()

        
    
        Asistencias.find.mockImplementation(() => ({
                populate: jest.fn().mockResolvedValue([
                    {
                        _id: id_simulado,
                        cantidad_asistencias: 1,
                        estudiante: mongoose.Types.ObjectId.toString(),
                        fecha_asistencias: ["19/11/2024", "01/12/2024"],
                        estado_asistencias: ["ausente", "presente"],
                        curso: id_curso_simulado,
                        cantidad_presentes: 0,
                        cantidad_ausencias: 1,
                    }
                ])
        }));

        await visualizarReporte(req, res)
        
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith([
            {
                estudiante: mongoose.Types.ObjectId.toString(),
                estadoAsistencia: "presente",
                fecha: "01/12/2024",
            }
        ])
    })

    test("Debería visualizar una asistencia", async () => {
        const id_simulado = new mongoose.Types.ObjectId().toString();
        const id_curso_simulado = new mongoose.Types.ObjectId().toString();
        Asistencias.findById.mockImplementation(() => ({
            select: jest.fn().mockResolvedValue({
                    _id: id_simulado,
                    cantidad_asistencias: 4,
                    estudiante: mongoose.Types.ObjectId.toString(),
                    fecha_asistencias: ["19/11/2024", "20/11/2024", "23/11/2024", "27/11/2024"],
                    estado_asistencias: ["presente", "presente", "presente", "presente"],
                    curso: id_curso_simulado,
                    cantidad_presentes: 4,
                    cantidad_ausencias: 0,
                })
        }));

        await visualizarAsistencia(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          _id: id_simulado,
          cantidad_asistencias: 4,
          estudiante: mongoose.Types.ObjectId.toString(),
          fecha_asistencias: ["19/11/2024", "20/11/2024", "23/11/2024", "27/11/2024"],
          estado_asistencias: ["presente", "presente", "presente", "presente"],
          curso: id_curso_simulado,
          cantidad_presentes: 4,
          cantidad_ausencias: 0,
        });
      });
    
      test("Debería actualizar una asistencia", async () => {
        const id_simulado = new mongoose.Types.ObjectId().toString();
        const id_curso_simulado = new mongoose.Types.ObjectId().toString();
        const id_estudiante = new mongoose.Types.ObjectId().toString();
        const save_function = jest.fn()
    
        Cursos.findOne.mockResolvedValue({
          paralelo: "GR-prueba",
          materia: "materia de prueba",
          semestre: "2024-prueba",
          estudiantes: [id_estudiante],
          fecha_asistencias: {$in: ["01/12/2024"]}
        });
    
        req.body.estudiantes = [{
            estudianteId:  new mongoose.Types.ObjectId().toString(),
            asistenciaId: new mongoose.Types.ObjectId().toString()
        }]

        Asistencias.findOne.mockResolvedValue({
          _id: id_simulado,
          cantidad_asistencias: 4,
          estudiante: id_estudiante,
          fecha_asistencias: ["19/11/2024", "20/11/2024", "23/11/2024", "27/11/2024"],
          estado_asistencias: ["presente", "presente", "presente", "presente"],
          curso: id_curso_simulado,
          cantidad_presentes: 4,
          cantidad_ausencias: 0,
          save: save_function
        });
        await actualizarAsistencia(req, res);
        console.log(res.json.mock);
        

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: "Asistencias registradas con éxito",
            asistencias: [
                {
                    _id: id_simulado,
                    cantidad_asistencias: 4,
                    estudiante: id_estudiante,
                    fecha_asistencias: ["19/11/2024", "20/11/2024", "23/11/2024", "27/11/2024", "01/12/2024"],
                    estado_asistencias: ["presente", "presente", "presente", "presente"],
                    curso: id_curso_simulado,
                    cantidad_presentes: 4,
                    cantidad_ausencias: 0,
                    save: save_function
                  }
            ]
        });
      });
    

      test("Debería eliminar una asistencia", async () => {
        const id_simulado = new mongoose.Types.ObjectId().toString();
        const id_curso_simulado = new mongoose.Types.ObjectId().toString();
    
        Asistencias.findByIdAndDelete.mockResolvedValue({
          _id: id_simulado,
          cantidad_asistencias: 4,
          estudiante: mongoose.Types.ObjectId.toString(),
          fecha_asistencias: ["19/11/2024", "20/11/2024", "23/11/2024", "27/11/2024"],
          estado_asistencias: ["presente", "presente", "presente", "presente"],
          curso: id_curso_simulado,
          cantidad_presentes: 4,
          cantidad_ausencias: 0,
        });
    
        await eliminarAsistencia(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: "Asistencia eliminada con éxito" });
      });
})

