const Book = require('../models/Book'); // Importamos el modelo

// --- 1. Obtener TODOS los libros (READ) ---
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find(); // Busca todos los libros
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los libros', error });
    }
};

// --- 2. Crear un NUEVO libro (CREATE) ---
exports.createBook = async (req, res) => {
    try {
        // req.body contiene la info del libro (title, author, isbn)
        const newBook = new Book(req.body); 
        await newBook.save(); // Guarda en la BD
        res.status(201).json({ message: 'Libro creado exitosamente', book: newBook });
    } catch (error) {
        // Manejo de errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Datos inválidos', errors: error.errors });
        }
        res.status(500).json({ message: 'Error al crear el libro', error });
    }
};

// --- 3. Obtener UN solo libro por ID (READ) ---
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id); // req.params.id viene de la URL
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el libro', error });
    }
};

// --- 4. Actualizar un libro por ID (UPDATE) ---
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // {new: true} devuelve el doc actualizado
        );
        
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.status(200).json({ message: 'Libro actualizado', book });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Datos inválidos', errors: error.errors });
        }
        res.status(500).json({ message: 'Error al actualizar el libro', error });
    }
};

// --- 5. Eliminar un libro por ID (DELETE) ---
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
        res.status(200).json({ message: 'Libro eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el libro', error });
    }
};