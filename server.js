const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Asegúrate de que esta línea esté
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---

// 1. Middleware de CORS (¡CONFIGURACIÓN ABIERTA!)
// Esto garantiza que Vercel pueda conectar sin conflictos de origen.
app.use(cors()); // <-- ¡La solución simple que permite todos los orígenes!

// 2. Middleware para entender JSON (¡Posición correcta!)
app.use(express.json());

// --- Conexión a la Base de Datos ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// --- Rutas ---

// Ruta de prueba
app.get('/api', (req, res) => {
    res.json({ message: 'Bienvenido a la API de la Biblioteca' });
});

const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');

app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});