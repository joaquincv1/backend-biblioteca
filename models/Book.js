// backend/models/Book.js (VERSIÓN CORREGIDA PARA EL INVENTARIO)

const mongoose = require('mongoose');
const { Schema } = mongoose;

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
        unique: true 
    },
    genre: {
        type: String,
        default: 'Desconocido'
    },
    // 🚩 CAMBIO CRÍTICO 🚩
    // Usamos un número para contar copias disponibles, esencial para préstamos.
    copiesAvailable: { 
        type: Number,
        required: [true, 'El número de copias es obligatorio'],
        default: 1, // Se asume al menos 1 copia al crear el libro
        min: 0 // No puede haber menos de 0 copias disponibles
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Book', BookSchema);