const Loan = require('../models/Loan');
const Book = require('../models/Book');
// Importar Moment.js para manejar fechas fácilmente (npm install moment)
// const moment = require('moment'); 

// @desc    Crear un nuevo préstamo
// @route   POST /api/loans
// @access  Private
exports.createLoan = async (req, res) => {
    const { bookId, dueDate } = req.body; // Recibimos el ID del libro y la fecha límite
    const userId = req.user._id; // El ID del usuario lo obtenemos del token (middleware 'protect')

    try {
        const book = await Book.findById(bookId);

        // 1. Verificar Disponibilidad
        if (!book || book.copiesAvailable < 1) {
            return res.status(400).json({ message: 'Libro no disponible para préstamo.' });
        }

        // 2. Crear el Préstamo
        const loan = await Loan.create({
            book: bookId,
            user: userId,
            dueDate: dueDate // Idealmente, se calcula: moment().add(14, 'days')
        });

        // 3. ACTUALIZAR EL INVENTARIO: Reducir copias disponibles
        book.copiesAvailable -= 1;
        await book.save();

        res.status(201).json({ 
            message: 'Préstamo registrado exitosamente.', 
            loan 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el préstamo.', error: error.message });
    }
};

// @desc    Devolver un préstamo
// @route   PUT /api/loans/:id/return
// @access  Private
exports.returnLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({ message: 'Préstamo no encontrado.' });
        }
        if (loan.returned) {
            return res.status(400).json({ message: 'Este libro ya fue devuelto.' });
        }

        // 1. Marcar como devuelto
        loan.returned = true;
        loan.returnDate = new Date();
        await loan.save();
        
        // 2. ACTUALIZAR EL INVENTARIO: Aumentar copias disponibles
        await Book.findByIdAndUpdate(loan.book, { $inc: { copiesAvailable: 1 } });

        res.status(200).json({ message: 'Libro devuelto exitosamente.', loan });

    } catch (error) {
        res.status(500).json({ message: 'Error al procesar la devolución.', error: error.message });
    }
};

// @desc    Obtener historial del usuario logueado
// @route   GET /api/loans/my
// @access  Private
exports.getMyLoans = async (req, res) => {
    const userId = req.user._id; // Obtenido del token

    try {
        // Usamos .populate() para obtener la información completa del libro asociado
        const loans = await Loan.find({ user: userId })
            .populate('book', 'title author isbn') // Solo trae estos campos del libro
            .sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente

        res.status(200).json(loans);

    } catch (error) {
        res.status(500).json({ message: 'Error al obtener tu historial.', error: error.message });
    }
};