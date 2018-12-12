import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BookRow extends Component {
    constructor(props) {
        super(props);
        this.rowClicked = this.rowClicked.bind(this);
    }

    rowClicked() {
        const id = this.props.id;
        this.props.onClick(id);
    }

    render() {
        const inStock = this.props.inStock ? 'x' : ' ';
        return (
            <tr onClick={this.rowClicked}>
                <td>{this.props.id}</td>
                <td>{this.props.title}</td>
                <td>{this.props.author}</td>
                <td>{inStock}</td>
            </tr>
        );
    }
}

BookRow.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    inStock: PropTypes.bool.isRequired,
    onClick: PropTypes.func
};

export default BookRow;
