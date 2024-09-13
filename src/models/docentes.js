import {model, Schema} from "mongoose"
import bcrypt from "bcryptjs"


const docenteSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    apellido: {
        type: String,
        require: true,
        trim: true
    },
    ciudad: {
        type: String,
        trim: true
    },
    direccion : {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
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

docenteSchema.methods.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10)
    const passwordEncrypted = await bcrypt.hash(password, salt)
    return passwordEncrypted
}

docenteSchema.methods.matchPassword = async function (password) {
    const response = await bcrypt.compare(password, this.password)
    return response
}

docenteSchema.methods.createToken = async function (){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}


export default model("Docentes", docenteSchema)