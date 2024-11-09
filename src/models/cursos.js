import mongoose, { Schema, model } from "mongoose"

const cursoSchema = new Schema({
    codigo: {
        type: String,
        require: true,
        unique: true
    },
    paralelo: {
        type: String,
        require: true
    },
    materia: {
        type: String,
        require: true
    },
    horario: {
        type: String,
        require: true
    },
    semestre: {
        type: String, 
        require: true
    },
    docente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Docentes"
    },
    estudiantes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Estudiantes"
    }]
},{
    timestamps: true
})


export default model("Cursos", cursoSchema)