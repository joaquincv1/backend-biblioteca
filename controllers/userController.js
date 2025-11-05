const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Para crear el token
// OJO: No necesitamos bcrypt aquí para hashear, ¡el modelo User.js lo hace solo!
// Pero SÍ lo necesitamos para comparar en el login.


// --- Función Auxiliar para firmar el Token ---
// (La ponemos aquí para tenerla a mano)
const generateToken = (id) => {
    // Firmamos el token con el ID del usuario y nuestro secreto
    // 'process.env.JWT_SECRET' debe venir de tu archivo .env
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // El token expirará en 30 días
    });
};

// --- 1. Registrar un nuevo usuario (CREATE) ---
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 1. Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // 2. Crear el nuevo usuario
        // ¡Recuerda! La contraseña se hashea automáticamente gracias al .pre('save') en el modelo
        const user = await User.create({
            name,
            email,
            password,
            role // 'student' o 'admin'
        });

        // 3. Si se crea, devolver los datos (¡sin la contraseña!) y el token
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id) // ¡Le damos un token de inmediato!
            });
        } else {
            res.status(400).json({ message: 'Datos de usuario inválidos' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

// --- 2. Autenticar (Login) un usuario (READ) ---
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar al usuario por email
        const user = await User.findOne({ email });

        // 2. Verificar si existe Y si la contraseña coincide
        // Usamos el método que creamos en el modelo: user.comparePassword()
        if (user && (await user.comparePassword(password))) {
            
            // ¡Éxito! Devolvemos los datos y un nuevo token
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            // Error de autenticación genérico (por seguridad, no digas si falló el email o la pass)
            res.status(401).json({ message: 'Email o contraseña inválidos' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

// --- 3. Obtener datos del perfil (protegido) ---
// Esta ruta será para que un usuario ya logueado vea su propio perfil
exports.getUserProfile = async (req, res) => {
    // NOTA: Esta ruta solo funcionará DESPUÉS de que creemos el middleware de autenticación.
    // 'req.user' será añadido por ese middleware.
    
    // Por ahora, solo la simulamos (¡la completaremos en el siguiente paso!)
    res.status(200).json({ message: "Ruta de perfil (aún por proteger)" });
};