const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Importamos a nuestro "guardia"
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// --- Rutas ---

// Ruta PÚBLICA (Cualquiera puede ver los libros)
router.get('/', bookController.getAllBooks);

// Ruta PÚBLICA (Cualquiera puede ver un libro)
router.get('/:id', bookController.getBookById);

// --- Rutas PROTEGIDAS ---
// Para CREAR un libro, primero debes pasar por el "guardia" (protect)
// Y ADEMÁS, ser un administrador (isAdmin)
router.post('/', protect, isAdmin, bookController.createBook);

// Para ACTUALIZAR, igual
router.put('/:id', protect, isAdmin, bookController.updateBook);

// Para ELIMINAR, igual
router.delete('/:id', protect, isAdmin, bookController.deleteBook);


module.exports = router;