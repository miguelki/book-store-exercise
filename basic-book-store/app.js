/* eslint-disable no-console */
const fs = require('fs');
const minimist = require('minimist');
const cTable = require('console.table');

// read books list
const BOOK_LIST_PATH = './books-list.json';
const booksStr = fs.readFileSync(BOOK_LIST_PATH);
const booksList = JSON.parse(booksStr);

// parse args
const argv = minimist(process.argv.slice(2), {
    // string: ['l', 'v', 'o', 'r'],
    alias: {
        h: 'help',
        l: 'list',
        v: 'view',
        o: 'order',
        r: 'return'
    }
});
const keys = Object.keys(argv);

// show help
if (keys.length === 1 || keys.indexOf('h') !== -1 || keys.indexOf('help') !== -1) {
    console.log('List of available commands:\n\
    --help (-h): shows a list of the options available to use on the command line\n\
    --list [inStock | is | toBeShipped | tbs ] (-l): lists all the books in the current stock, or the list of books to be shipped\n\
    --view [bookId] (-v): given a bookId, shows the info for that book\n\
    --order [bookId] (-o): "orders" a book by moving it from the "in stock" list to the "to be shipped" list\n\
    --return [bookId] (-r): returns a book by moving it from the "to be shipped" list back to the "in stock" list\n\
\n***********\n\
    ');
}

// list books
if (keys.indexOf('l') !== -1 || keys.indexOf('list') !== -1) {
    const type = argv.l;

    if (type === 'inStock' || type === 'is' || type === 'toBeShipped' || type === 'tbs') {
        const inStockStatus = type === 'inStock' || type === 'is';
        const filteredBooks = filterBooks(inStockStatus);
        const table = cTable.getTable(filteredBooks);

        console.log(table);
        console.log('***********\n');

    } else if (typeof(type) === 'boolean') {
        console.warn('No parameter passed to the list argument, displaying general stock information:');
        const titles = bookTitles();
        const allBooks = [];
        titles.forEach(bookTitle => {
            const stats = bookStats(bookTitle);
            allBooks.push({
                'Title': bookTitle,
                'Author': stats.author,
                'ISBN': stats.isbn,
                'In stock': stats.inStock,
                'To be shipped': stats.toBeShipped,
                'Total stock': stats.total
            });
        });
        const table = cTable.getTable(allBooks);

        console.log(table);
        console.log('***********\n');
    } else {
        console.error('Error: Unknown list type.\n***********\n');
    }
}

// view book details
if (keys.indexOf('v') !== -1 || keys.indexOf('view') !== -1) {
    const book = getBook(argv.v);
    if (!book) {
        console.error('Error: There is no book matching this id.\n***********');
    } else {
        console.log('Book details:');
        for (let k in book) { 
            console.log(`${k}: ${book[k]}`);
        }
        console.log('\n***********\n');
    }
}

// order book
if (keys.indexOf('o') !== -1 || keys.indexOf('order') !== -1) {
    const book = getBook(argv.o);
    if (book) {
        if (book.inStock) {
            book.inStock = false;
            saveInventoryStatus();
            console.log('Book status updated from "in stock" to "to be shipped", inventory updated.');
        } else {
            console.error('Error: The book is already ready to be shipped, cancelling operation.');
        }
    } else {
        console.error('Error: There is no book matching this id.');
    }
    console.log('\n***********\n');
}

// return book
if (keys.indexOf('r') !== -1 || keys.indexOf('return') !== -1) {
    const book = getBook(argv.r);
    if (book) {
        if (!book.inStock) {
            book.inStock = true;
            saveInventoryStatus();
            console.log('Book status updated from "to be shipped" to "in stock", inventory updated.');
        } else {
            console.error('Error: The book is already in stock, cancelling operation.');
        }
    } else {
        console.error('Error: There is no book matching this id.');
    }
    console.log('\n***********\n');
}

/* ********* FUNCTIONS ********* */

function bookTitles() {
    const titles = new Set();
    booksList.forEach(book => titles.add(book.title));
    return titles;
}

function bookStats(title) {
    const books = booksList.filter(element => element.title === title);
    return {
        title: title,
        author: books[0].author,
        isbn: books[0].ISBN,
        inStock: books.filter(element => element.inStock).length,
        toBeShipped: books.filter(element => !element.inStock).length,
        total: books.length
    };
}

function filterBooks(inStockStatus) {
    return booksList.filter(element => element.inStock === inStockStatus);
}

function getBook(id) {
    return booksList.find(element => element.id === id);
}

function saveInventoryStatus() {
    fs.writeFile(BOOK_LIST_PATH, JSON.stringify(booksList), err => {
        if (err) {
            console.error(`Something went wrong when saving the updated inventory: ${err.message}. Exiting.`);
            process.exit(-1);
        }
    });
}
