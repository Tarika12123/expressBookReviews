const express = require('express');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const general_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

// Session middleware setup
app.use(session({ 
  secret: "fingerprint_customer", 
  resave: true, 
  saveUninitialized: true 
}));

// Use the customer routes for authenticated users
app.use("/customer", customer_routes);

// Use the general routes for public access
app.use("/", general_routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));