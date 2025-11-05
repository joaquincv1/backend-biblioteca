const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Importamos bcrypt
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        // Expresión regular simple para validar formato de email
        match: [/.+\@.+\..+/, 'Por favor ingrese un email válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role: {
        type: String,
        enum: ['student', 'admin'], // Solo permite estos dos valores
        default: 'student'
    }
}, {
    timestamps: true
});

// --- ¡Magia de Mongoose! (Middleware "pre-save") ---
// Esto se ejecutará AUTOMÁTICAMENTE antes de que un documento 'User' se guarde
UserSchema.pre('save', async function(next) {
    // Si la contraseña no se ha modificado (ej. actualizando el email), no hagas nada
    if (!this.isModified('password')) {
        return next();
    }

    // "Salt" es una capa extra de seguridad para el hash
    const salt = await bcrypt.genSalt(10);
    // Reemplaza la contraseña en texto plano por la hasheada
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para comparar contraseñas (lo usaremos en el login)
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);