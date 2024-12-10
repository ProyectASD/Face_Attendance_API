import mongoose, { model, Schema } from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto"
const estudianteSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    apellido : {
        type: String,
        require: true,
        trim: true
    },
    cedula: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        trim: true   
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    fotografia: {
        type:String,
        require: true,
        default: false
    },
    descriptor: {
        type: [Number],
        required: false
    },
    fecha_nacimiento: {
        type: Date,
        require: true,
        trim: true
    },
    direccion: {
        type: String,
        trim: true
    },
    ciudad: {
        type: String,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
    token: {
        type: String,
        default: null,
        trim: true
    },
    confirmEmail: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})


estudianteSchema.methods.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10)
    const passwordEncrypted = await bcrypt.hash(password, salt)
    return passwordEncrypted
}

estudianteSchema.methods.matchPassword = async function (password) {
    const response = await bcrypt.compare(password, this.password)
    return response
}

estudianteSchema.methods.createToken = async function (){
    // const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    const tokenGenerado = crypto.randomBytes(3).toString("hex")
    return tokenGenerado
}


export default model("Estudiantes", estudianteSchema)