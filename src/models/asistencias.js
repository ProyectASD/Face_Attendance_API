import mongoose, { model, Schema } from "mongoose"

const asistenciaSchema = new Schema({
    cantidad_asistencias: {
        type: Int32Array,
        require: true
    },
    participaciones: {
        type: Array,
        require: true
    },
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Estudiantes"
    }
},{
    timestamps: true
})

export default model("Asistencias", asistenciaSchema)