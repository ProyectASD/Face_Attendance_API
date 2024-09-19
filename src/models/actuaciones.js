import mongoose, { Schema, model } from "mongoose"


const actuacionSchema = new Schema({
    cantidad_actuaciones: {
        type: Number,
        require: true, 
        default : 0
    },
    descripciones: {
        type: Array,
        require: true
    } ,
    estudiante:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Estudiantes"
    }
},{
    timestamps: true
})

export default model("Actuaciones", actuacionSchema)