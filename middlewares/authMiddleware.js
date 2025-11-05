const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Necesitamos User para buscar al usuario por ID

const protect = async (req, res, next) => {
    let token;

    // 1. Verificar si el token viene en los "Headers" de la petición
    // Los tokens JWT se suelen enviar así: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Obtener el token (quitando la palabra "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verificar la firma del token con nuestro secreto
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. ¡Token válido! Buscar al usuario y adjuntarlo al objeto 'req'
            // Excluimos la contraseña (-password) por seguridad
            req.user = await User.findById(decoded.id).select('-password');

            // 5. ¡Dejar pasar al usuario a la siguiente función (el controlador)!
            next();

        } catch (error) {
            console.error('Error de autenticación:', error);
            res.status(401).json({ message: 'No autorizado, token falló' });
        }
    }

    // Si no hay token en los headers...
    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

// Middleware para roles (¡un extra!)
// Lo usaremos para asegurarnos de que solo los 'admin' puedan borrar libros
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // Es admin, puede pasar
    } else {
        res.status(403).json({ message: 'No autorizado, se requiere rol de administrador' });
    }
};

module.exports = { protect, isAdmin };