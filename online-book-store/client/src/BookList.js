import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookRow from './BookRow';

class BookList extends Component {
    render() {
        const rows = this.props.books.map(book =>
            (<BookRow
                id={book.id}
                title={book.title}
                author={book.author}
                inStock={book.inStock}
                key={book.id}
                onClick={this.props.onRowClick}
            />));

        return (
            <table>
                <thead>
                    <tr>
                        <th>Book Id</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>In Stock?</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}

BookList.propTypes = {
    books: PropTypes.array,
    onRowClick: PropTypes.func
};

export default BookList;
