const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Importamos a nuestro "guardia"
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// --- Rutas ---

// ¡Ruta PROTEGIDA! (Solo usuarios logueados pueden ver los libros)
router.get('/', protect, bookController.getAllBooks);

// ¡Ruta PROTEGIDA!
router.get('/:id', protect, bookController.getBookById);

// --- Rutas de Admin ---
router.post('/', protect, isAdmin, bookController.createBook);
router.put('/:id', protect, isAdmin, bookController.updateBook);
router.delete('/:id', protect, isAdmin, bookController.deleteBook);

module.exports = router;