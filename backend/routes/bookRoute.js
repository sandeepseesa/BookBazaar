import express from 'express';
import { Books } from '../models/BookModel.js';
import authMiddleware from './auth.js';

const router = express.Router();


//route to get all books
router.get('/', async (req, res) => {
    try {
        const books = await Books.find({});
        return res.status(200).json({
            count: books.length,
            data: books,
        });
    }
    catch (err) {
        res.status(500).send({ message: err.meesage });
    }

})

//route to create and save book to database
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ) {
            return res.status(401).send({ message: "All fields are Required!" });
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        };
        const book = await Books.create(newBook);
        return res.status(201).send(book);
    }
    catch (err) {
        res.status(500).send({ message: err.message });
    }

})

//route to get one book by id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Books.findById(id);
        return res.status(200).json(book);
    }
    catch (err) {
        res.status(500).send({ message: err.mesage });
    }

})

//route to update a book
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        if (
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ) {
            return res.status(401).send({ message: "All fields are Required!" });
        }
        const { id } = req.params;

        const result = await Books.findByIdAndUpdate(id, req.body);

        if (!result) {
            return res.status(404).json({ message: "Book not found" })
        }
        return res.status(200).send({ meesage: "Book updated successfully!" })

    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
});

//route to delete a book
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Books.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "Book not found!" })
        }
        return res.status(200).send({ message: "Deleted successfully!" });
    } catch (err) {
        console.log(err);
        res.status(404).send({ message: err.message });
    }
});



export default router;