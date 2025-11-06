const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    // La clave para la relación: apunta al modelo 'Book'
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book', 
        required: true
    },
    // La clave para la relación: apunta al modelo 'User'
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Fecha límite para la devolución
    dueDate: {
        type: Date,
        required: true
    },
    // Estado del préstamo
    returned: {
        type: Boolean,
        default: false
    },
    // Fecha real de devolución (para cálculo de multas, si aplica)
    returnDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);