const mongoose = require('mongoose');
const { Schema } = mongoose;

// Este es el "plano" de nuestro documento de libro
const BookSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio']
    },
    author: {
        type: String,
        required: [true, 'El autor es obligatorio']
    },
    isbn: {
        type: String,
        required: [true, 'El ISBN es obligatorio'],
        unique: true // No puede haber dos libros con el mismo ISBN
    },
    genre: {
        type: String,
        default: 'Desconocido'
    },
    // Este campo es clave para saber si se puede prestar
    available: {
        type: Boolean,
        default: true 
    }
}, {
    timestamps: true // Esto añade automáticamente createdAt y updatedAt
});

// Exportamos el modelo para que el resto de la app pueda usarlo
module.exports = mongoose.model('Book', BookSchema);