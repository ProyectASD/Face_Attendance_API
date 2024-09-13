import { Schema, model } from "mongoose"


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
    }
},{
    timestamps: true
})


export default model("Cursos", cursoSchema)