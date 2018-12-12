import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

class BookDetails extends Component {
    constructor(props) {
        super(props);
        this.closeClicked = this.closeClicked.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
    }

    closeClicked() {
        this.props.onClose();
    }

    updateStatus() {
        if (this.props.inStock) {
            this.props.onOrder(this.props.id);
        } else {
            this.props.onReturn(this.props.id);
        }
    }

    render() {
        const inStock = this.props.inStock ? 'In stock' : 'Ready to be shipped';
        const statusButtonText = this.props.inStock ? 'Order Book' : 'Return Book';
        return (
            <div>
                <div
                    className='close-button'
                    onClick={this.closeClicked}
                >
                    x
                </div>
                <p><b>{this.props.title} by {this.props.author}</b></p>
                <ul>
                    <li>Book id: {this.props.id}</li>
                    <li>ISBN: {this.props.isbn}</li>
                    <li>Dimensions (W*H): {this.props.width}*{this.props.height}</li>
                    <li>Book status: {inStock}</li>
                </ul>
                <div
                    className='status-button'
                    onClick={this.updateStatus}
                >
                    {statusButtonText}
                </div>
            </div>
        );
    }
}

BookDetails.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    isbn: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    inStock: PropTypes.bool.isRequired,
    onClose: PropTypes.func,
    onOrder: PropTypes.func,
    onReturn: PropTypes.func
};

export default BookDetails;
