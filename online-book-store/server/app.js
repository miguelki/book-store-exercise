/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

/* ********** DATABASE LOADING ********** */

const Datastore = require('nedb');
const db = new Datastore({ filename: './db/books.db', autoload: true });

/* ********** SERVER SETUP ********** */

const app = express();
const port = 5000;

// Enable CORS because the React front-end runs on a different port
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware used to parse request bodies
app.use(bodyParser.json());

// Get all books
app.get('/api/books', (req, res) => {
    console.log('Requesting list of all books');
    db.find({}, (err, docs) => {
        const books = docs.map(book => lowDetails(book));
        res.send(books);
    });
});

// Get book details
app.get('/api/books/:bookId', (req, res) => {
    const bookId = parseInt(req.params.bookId);
    console.log(`Requesting book details for book id ${bookId}`);

    let response;
    db.find({ id: bookId }, (err, docs) => {
        if (err) {
            response = buildErrorResponse(err);
        } else if (docs.length === 0) {
            response = buildErrorResponse('Error: There is no book matching this id.');
        } else {
            const book = docs[0];
            response = buildSuccessResponse({ book: allDetails(book) });
        }

        console.log('Response:');
        console.log(response);
        res.send(response);
    });
});

// Order book
app.post('/api/order', (req, res) => {
    const bookId = req.body.bookId;
    console.log(`Ordering book with id ${bookId}`);

    let response;
    db.find({ id: bookId }, (err, docs) => {
        if (err) {
            response = buildErrorResponse(err);
        } else if (docs.length === 0) {
            response = buildErrorResponse('Error: There is no book matching this id.');
        } else {
            const book = docs[0];
            if (book.inStock) {
                db.update({ id: bookId }, { $set: { inStock: false } }, {}, function (err) {
                    if (err) {
                        response = buildErrorResponse(err);
                    } else {
                        response = buildSuccessResponse();
                    }
                    console.log('Response:');
                    console.log(response);
                    res.send(response);
                });
            } else {
                response = buildErrorResponse('Error: The book is already ready to be shipped, cancelling operation.');
            }
        }

        // only send the response if we went through an error case 
        // (the async database update isn't done yet)
        if (response) {
            console.log('Response:');
            console.log(response);
            res.send(response);
        }
    });
});

// Return book
app.post('/api/return', (req, res) => {
    const bookId = req.body.bookId;
    console.log(`Returning book with id ${bookId}`);

    let response;
    db.find({ id: bookId }, (err, docs) => {
        if (err) {
            response = buildErrorResponse(err);
        } else if (docs.length === 0) {
            response = buildErrorResponse('Error: There is no book matching this id.');
        } else {
            const book = docs[0];
            if (!book.inStock) {
                db.update({ id: bookId }, { $set: { inStock: true } }, {}, function (err) {
                    if (err) {
                        response = buildErrorResponse(err);
                    } else {
                        response = buildSuccessResponse();
                    }
                    console.log('Response:');
                    console.log(response);
                    res.send(response);
                });
            } else {
                response = buildErrorResponse('Error: The book is already in stock, cancelling operation.');
            }
        }

        // only send the response if we went through an error case 
        // (the async database update isn't done yet)
        if (response) {
            console.log('Response:');
            console.log(response);
            res.send(response);
        }
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));

/* ********** HELPER FUNCTIONS ********** */

// retrieve partial book info
function lowDetails(book) {
    const bookDetails = allDetails(book);
    return {
        id: bookDetails.id,
        title: bookDetails.title,
        author: bookDetails.author,
        inStock: bookDetails.inStock
    };
}

// remove internal db id
function allDetails(book) {
    // Modifying a copy of the book
    const trimmedBook = Object.assign({}, book);
    delete trimmedBook._id;
    return trimmedBook;
}

function buildErrorResponse(errorMessage) {
    return {
        error: errorMessage,
        success: false
    };
}

function buildSuccessResponse(body = {}) {
    return Object.assign({ success: true }, body);
}
