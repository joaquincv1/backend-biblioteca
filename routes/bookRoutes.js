const express = require('express');
const router = express.Router();

// Importamos el controlador
const bookController = require('../controllers/bookController');

// Definimos las rutas y las conectamos con las funciones del controlador

// /api/books/
router.get('/', bookController.getAllBooks);
router.post('/', bookController.createBook);

// /api/books/:id
router.get('/:id', bookController.getBookById);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);


module.exports = router;