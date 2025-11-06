const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Carga las variables de .env

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---

// 1. Middleware de CORS (¡Configuración clave para despliegue!)

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin) || !origin) {
            // Permitir la solicitud si está en la lista blanca o si es del mismo origen (ej. Postman)
            callback(null, true);
        } else {
            // Rechazar la solicitud
            callback(new Error('No permitido por CORS'));
        }
    }
};
app.use(cors(corsOptions));

// 2. Middleware para entender JSON
app.use(express.json());

const whiteList = [
    'http://localhost:4200', // Desarrollo local
    'https://biblioteca-frontend-w1b7.vercel.app/' // <-- ¡Tu URL de Vercel!
];

app.get('/api', (req, res) => {
    res.json({ message: 'Bienvenido a la API de la Biblioteca' });
});
// --- Conexión a la Base de Datos ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));


// (Aquí conectaremos nuestras rutas de /api/libros, /api/usuarios, etc.)
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');

// ¡Aquí le decimos a Express que use estas rutas!
// Todas las rutas en 'bookRoutes' ahora tendrán el prefijo '/api/books'
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

// --- Iniciar Servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});