const express = require('express');
const axios = require('axios');  // Import Axios
let books = require("./booksdb.js");
let users = [];  
const public_users = express.Router();

/// User registration
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add user to the users array
  users.push({ username, password });
  console.log(users);  // For debugging, ensure users are being registered
  return res.status(200).json({ message: "User registered successfully" });
});

// User login
public_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user exists and the password matches
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Successful login
  return res.status(200).json({ message: "Login successful" });
});
// Get all books using Axios and async-await
public_users.get('/books/async', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/books');  // Example URL for local data
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details by ISBN using async-await and Axios
public_users.get('/isbn/async/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);  // Example URL
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: `Error fetching book with ISBN ${isbn}`, error: error.message });
  }
});

public_users.get('/author/:author',function (req, res) {
  const authors = req.params.author;
  const book_arrs =  Object.values(books);

  const book = book_arrs.filter((book) => book.author === authors);
  res.status(200).json(book);
  
});

// Get books by title using async-await and Axios
public_users.get('/title/async/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    // Simulate an external API call with Axios
    const response = await axios.get(`http://localhost:5000/title/${title}`);  // Example URL
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: `Error fetching books by title ${title}`, error: error.message });
  }
});

// Get all books from local data (as fallback)
public_users.get('/books', (req, res) => {
  return res.status(200).json(books);
});

// Get book details by ISBN from local data
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get books by title from local data
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title);

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const book_isbn = req.params.isbn;
  const book = books[book_isbn];

  // Check if the book exists
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the book has reviews
  if (!book.reviews || book.reviews.length === 0) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  // Send the book reviews
  return res.status(200).json(book.reviews);
});



module.exports.general = public_users;