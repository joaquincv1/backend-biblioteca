const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---

// 1. Middleware de CORS (¡Configuración clave para despliegue!)

// 🚩 SOLUCIÓN: LA WHITELIST DEBE DEFINIRSE PRIMERO 🚩
const whiteList = [
    'http://localhost:4200', 
    'https://biblioteca-frontend-w1b7.vercel.app/' // <-- ¡Tu URL de Vercel!
];

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    }
};
app.use(cors(corsOptions));

// 2. Middleware para entender JSON
app.use(express.json()); // Mantenido en posición correcta (antes de las rutas)

// --- Conexión a la Base de Datos ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// --- Rutas ---

// Ruta de prueba (Mantenida después de express.json() para evitar conflictos)
app.get('/api', (req, res) => {
    res.json({ message: 'Bienvenido a la API de la Biblioteca' });
});

const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});