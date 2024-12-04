import mongoose from "mongoose"
import {
    crearCurso,
    visualizarCursoDocente,
    visualizarCursosDocente,
    actualizarCurso,
    eliminarCurso
} from "../src/controllers/curso_controller.js"
import Cursos from "../src/models/cursos"

jest.mock("../src/models/cursos")

describe.only("Pruebas Unitarias - Gestionamiento de modulos - Docente",()=>{

    let req, res
    beforeEach(()=>{
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
            params: {
                id: new mongoose.Types.ObjectId().toString(),
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
        

    test("Deberia crear un curso", async()=>{
        Cursos.findOne.mockResolvedValue(null)

        await crearCurso(req,res)
        
        expect(res.status).toHaveBeenCalledWith(200)   
        expect(res.json).toHaveBeenCalledWith({msg: "Curso creado con éxito", codigo:  "codigo-123curso"})
    })


    test("Debería visualizar un curso por id", async () => {
        const curso = { codigo: "codigo-123curso", materia: "materia de prueba" }
        Cursos.findById.mockResolvedValue(curso)

        await visualizarCursoDocente(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(curso)
    })



    test("Debería visualizar todos los cursos de un docente", async () => {
        const cursos = [{ codigo: "codigo-123curso", materia: "materia de prueba" }]

        Cursos.find.mockImplementation(() => ({
            select: jest.fn().mockResolvedValue(cursos)
        }));

        await visualizarCursosDocente(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(cursos)
    })


    test("Debería actualizar un curso correctamente", async () => {
        const cursoExistente = { _id: "777", ...req.body }
        Cursos.findByIdAndUpdate.mockResolvedValue(cursoExistente)

        await actualizarCurso(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ msg: "Curso actualizado con éxito" })
    })


    test("Debería eliminar un curso correctamente", async () => {
        const cursoExistente = { _id: "777", estudiantes: [] }
        Cursos.findById.mockResolvedValue(cursoExistente)
        cursoExistente.deleteOne = jest.fn().mockResolvedValue(true) 
        
        Cursos.deleteOne.mockResolvedValue(true)
        await eliminarCurso(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ msg: "Curso eliminado con éxito" })
    })

    
})