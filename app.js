// Import necessary dependencies
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const dotenv = require('dotenv');
const coreRoutes = require('./routes/coreRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-default-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    },
  })
);

// CSRF protection setup
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Middleware to expose CSRF token and username to views
app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes
app.use('/', authRoutes);
app.use('/', coreRoutes);
app.use('/', aiRoutes);
app.use('/', messageRoutes);
app.use('/', adminRoutes); 
app.use('/', aboutRoutes); 
// Error handling for CSRF token errors
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next(err);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});