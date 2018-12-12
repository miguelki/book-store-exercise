import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export function getBooks() {
  console.log('api call - get books list');
  return axios.get(`${API_URL}/books`)
    .then(res => res.data);
};

export function getBookDetails(id) {
  console.log('api call - get book details');
  return axios.get(`${API_URL}/books/${id}`)
    .then(res => res.data.book);
};

export function orderBook(id) {
  console.log('api call - order book');
  return axios.post(`${API_URL}/order`, {
    bookId: id
  })
    .then(res => res.data);
};

export function returnBook(id) {
  console.log('api call - return book');
  return axios.post(`${API_URL}/return`, {
    bookId: id
  })
    .then(res => res.data);
};
