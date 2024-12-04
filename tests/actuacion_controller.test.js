import {
    visualizarActuaciones, 
    visualizarReporte,
    estudiantesPresentes,
    actualizarActuaciones,
    eliminarActuacion
} from "../src/controllers/actuacion_controller.js"
import Asistencias from "../src/models/asistencias.js"
import Actuaciones from "../src/models/actuaciones.js"
import Cursos from "../src/models/cursos.js"
import Estudiantes from "../src/models/estudiantes.js"
import mongoose from "mongoose"

jest.mock("../src/models/actuaciones.js")
jest.mock("../src/models/estudiantes.js")
jest.mock("../src/models/cursos.js")
jest.mock("../src/models/asistencias.js")

describe("Pruebas Unitarias - Gestionamiento de actuaciones - Docentes",()=>{
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
    

    test("Deberia visualizar actuaciones", async()=>{
        Cursos.findOne.mockResolvedValue({
            paralelo: "GR-prueba",
            materia: "materia de prueba",
            semestre: "2024-prueba", 
            estudiantes: req.body.estudiantes
        })

        let id_simulado, id_curso_simulado = new mongoose.Types.ObjectId().toString()

        Actuaciones.find.mockImplementation(() => ({
            select: jest.fn().mockResolvedValue([
                {
                    _id: id_simulado,
                    cantidad_actuaciones: 12,
                    descripciones: [["Come en clase", "todo bien Fernando"], ["Muy bien fernando"]],
                    fecha_actuaciones: ["19/11/2024", "20/11/2024"],
                    estudiante: mongoose.Types.ObjectId.toString(),
                    curso: id_curso_simulado
                },
                {
                    _id: id_simulado,
                    cantidad_actuaciones: 2,
                    descripciones: [["llego atrasado al examen"]],
                    fecha_actuaciones: ["20/11/2024"],
                    estudiante: mongoose.Types.ObjectId.toString(),
                    curso: id_curso_simulado
                }
            ])
        }));

        await visualizarActuaciones(req, res)

        expect(res.status).toHaveBeenCalledWith(200)        
        expect(res.json).toHaveBeenCalledWith([ {
                _id: id_simulado,
                cantidad_actuaciones: 12,
                descripciones: [["Come en clase", "todo bien Fernando"], ["Muy bien fernando"]],
                fecha_actuaciones: ["19/11/2024", "20/11/2024"],
                estudiante: mongoose.Types.ObjectId.toString(),
                curso: id_curso_simulado
            },
            {
                _id: id_simulado,
                cantidad_actuaciones: 2,
                descripciones: [["llego atrasado al examen"]],
                fecha_actuaciones: ["20/11/2024"],
                estudiante: mongoose.Types.ObjectId.toString(),
                curso: id_curso_simulado
            }
        ]);
    })



    
    test("Deberia visualizar reporte de actuaciones", async()=>{
        Cursos.findOne.mockResolvedValue({
            paralelo: "GR-prueba",
            materia: "materia de prueba",
            semestre: "2024-prueba", 
            estudiantes: req.body.estudiantes
        })

        let id_simulado, id_curso_simulado = new mongoose.Types.ObjectId().toString()
        
        Actuaciones.find.mockImplementation(() => ({
            select: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue([
                        {
                            _id: id_simulado,
                            cantidad_actuaciones: 12,
                            descripciones: [["Come en clase", "todo bien Fernando"], ["Muy bien fernando"]],
                            fecha_actuaciones: ["19/11/2024", "20/11/2024"],
                            estudiante: { nombre: "Fernando", apellido: "Pérez" },
                            curso: { materia: "materia de prueba", paralelo: "GR-prueba" }
                        },
                        {
                            _id: id_simulado,
                            cantidad_actuaciones: 2,
                            descripciones: [["Llegó atrasado al examen"]],
                            fecha_actuaciones: ["20/11/2024"],
                            estudiante: { nombre: "Luis", apellido: "Martínez" },
                            curso: { materia: "materia de prueba", paralelo: "GR-prueba" }
                        }
                    ])
                })
            })
        }));
        
        await visualizarReporte(req, res)

        expect(res.status).toHaveBeenCalledWith(200)        
        expect(res.json).toHaveBeenCalledWith([
            {
                _id: id_simulado,
                cantidad_actuaciones: 12,
                descripciones: [["Come en clase", "todo bien Fernando"], ["Muy bien fernando"]],
                fecha_actuaciones: ["19/11/2024", "20/11/2024"],
                estudiante: { nombre: "Fernando", apellido: "Pérez" },
                curso: { materia: "materia de prueba", paralelo: "GR-prueba" }
            },
            {
                _id: id_simulado,
                cantidad_actuaciones: 2,
                descripciones: [["Llegó atrasado al examen"]],
                fecha_actuaciones: ["20/11/2024"],
                estudiante: { nombre: "Luis", apellido: "Martínez" },
                curso: { materia: "materia de prueba", paralelo: "GR-prueba" }
            }
        ])

    })



    test("Debería obtener la lista de estudiantes presentes", async () => {
        Cursos.findOne.mockResolvedValue({
            _id: "cursoIdMock",
        })

        Asistencias.find.mockResolvedValue([{
                estudiante: "estudianteId1",
                estado_asistencias: ["ausente", "presente"],
                fecha_asistencias: ["2024-11-30", "2024-12-01"],
            },{
                estudiante: "estudianteId2",
                estado_asistencias: ["presente", "ausente"],
                fecha_asistencias: ["2024-11-29", "2024-12-01"],
        }])

        Actuaciones.find.mockImplementation(()=>({
            populate: jest.fn().mockResolvedValue([{
                estudiante: { _id: "estudianteId1", nombre: "Juan", apellido: "Pérez" },
                cantidad_actuaciones: 5,
            }])
        }))

        await estudiantesPresentes(req, res);

        expect(Cursos.findOne).toHaveBeenCalledWith({
            paralelo: "GR-prueba",
                materia: "materia de prueba",
                semestre: "2024-prueba",
        })

        expect(Asistencias.find).toHaveBeenCalledWith({ curso: "cursoIdMock" })
        expect(Actuaciones.find).toHaveBeenCalledWith({
            curso: "cursoIdMock",
            estudiante: { $in: ["estudianteId1"] },
        })
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith([{
            estudiante: { _id: "estudianteId1", nombre: "Juan", apellido: "Pérez" },
            cantidad_actuaciones: 5,
            fecha: "2024-12-01",
        }])
    })


    test("Debería actualizar una actuación correctamente", async () => {
        Cursos.findOne.mockResolvedValue({
            _id: "cursoIdMock"
        })
        
        req.body.actuaciones = [{
            id : "674a8bf6baa5eac28d60928a",
			cantidad_actuaciones: "1",
			descripciones: ["hola", "cambiar", "datos", "algo"]
        }]

        const save_function = jest.fn()

        Actuaciones.findOne.mockImplementation(()=>({
            select: jest.fn().mockResolvedValue({
                _id: req.params.idActuacion,
                cantidad_actuaciones: 5,
                descripciones: ["Nueva descripción"],
                fecha_actuaciones: ["2024-12-01"],
                save: save_function
            })
        }));

        await actualizarActuaciones(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: "Actuaciones actualizadas con éxito", 
            actuaciones: [
                {
                    _id: req.params.idActuacion,
                    cantidad_actuaciones: 6,
                    descripciones: ["Nueva descripción",["hola", "cambiar", "datos", "algo"]],
                    fecha_actuaciones: ["2024-12-01"],
                    save: save_function
                }
            ]})
    })

    test("Debería eliminar una actuación correctamente", async () => {
        Actuaciones.findByIdAndDelete.mockResolvedValue({
            _id: req.params.idActuacion,
        });

        await eliminarActuacion(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({msg: "Actuación eliminada correctamente"})
    });

    
})

