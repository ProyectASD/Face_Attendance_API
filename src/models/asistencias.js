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
    }
},{
    timestamps: true
})

export default model("Asistencias", asistenciaSchema)