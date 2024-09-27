import mongoose, { model, Schema } from "mongoose"

const asistenciaSchema = new Schema({
    cantidad_asistencias: {
        type: Number,
        require: true,
        default: 0
    },
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Estudiantes"
    },
    fecha_asistencias: {
        type: Array,
        require: true
    },
    estado_asistencias: {
        type: Array,
        require: true
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cursos"
    },
    cantidad_presentes:{
        type: Number,
        require: true,
        default: 0
    },
    cantidad_ausencias: {
        type: Number,
        require: true,
        default: 0
    }
},{
    timestamps: true
})

export default model("Asistencias", asistenciaSchema)