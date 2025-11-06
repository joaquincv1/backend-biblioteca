const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// Obtener mi historial de préstamos (accesible por estudiantes y admins)
router.get('/my', protect, loanController.getMyLoans);

// Crear un préstamo (accesible por estudiantes y admins)
router.post('/', protect, loanController.createLoan);

// Devolver un préstamo (PUT /api/loans/:id/return) - accesible por admins o el mismo usuario
router.put('/:id/return', protect, loanController.returnLoan);

module.exports = router;