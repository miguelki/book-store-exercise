import React, { Component } from 'react';
import './App.css';
import * as Books from './books';
import BookList from './BookList';
import BookDetails from './BookDetails';

class App extends Component {
  state = {
    books: [],
    bookDetails: undefined
  }

  constructor(props) {
    super(props);
    this.rowClicked = this.rowClicked.bind(this);
    this.orderBook = this.orderBook.bind(this);
    this.returnBook = this.returnBook.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
}

  componentDidMount() {
    Books.getBooks()
      .then(books => {
        console.log('books list:');
        console.log(books);
        this.setState({ books });
      });
  }

  rowClicked(id) {
    console.log(`row with id ${id} clicked`);
    Books.getBookDetails(id)
    .then(details => {
      console.log('book details:');
      console.log(details);
      this.setState({ bookDetails: details });
    });
  }

  orderBook(id) {
    console.log(`order book with id ${id}`);
    Books.orderBook(id)
      .then(() => {
        // fetch updated list & details 
        Books.getBooks()
          .then(books => {
            this.setState({ books });
          })
          .then(() => {
            Books.getBookDetails(id)
              .then(details => {
                this.setState({ bookDetails: details });
              });
          });
      });
  }

  returnBook(id) {
    console.log(`return book with id ${id}`);
    Books.returnBook(id)
      .then(() => {
        // fetch updated list & details 
        Books.getBooks()
          .then(books => {
            this.setState({ books });
          })
          .then(() => {
            Books.getBookDetails(id)
              .then(details => {
                this.setState({ bookDetails: details });
              });
          });
      });
  }

  closeDetails() {
    this.setState({bookDetails: undefined});
  }

  render() {
    let list;
    if (this.state.books && this.state.books.length) {
      list = (<BookList
        books={this.state.books}
        onRowClick={this.rowClicked}
      />);
    }

    let details;
    if (this.state.bookDetails) {
      const bookDetails = this.state.bookDetails;
      details = (<BookDetails
        id={bookDetails.id}
        title={bookDetails.title}
        author={bookDetails.author}
        isbn={bookDetails.ISBN}
        width={bookDetails.width}
        height={bookDetails.height}
        inStock={bookDetails.inStock}
        onClose={this.closeDetails}
        onOrder={this.orderBook}
        onReturn={this.returnBook}
      />)
    }

    return (
      <div className="App">
      <p>Click on a row to display book details:</p>
        <div>
          {list}
        </div>
        {details}
      </div>
    );
  }
}

export default App;
