const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const petRoutes = require('./routes/petRoutes');
const journalRoutes = require('./routes/journalRoutes');

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in the .env file before starting the app.');
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(flash());

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(authRoutes);
app.use(pageRoutes);
app.use(adminRoutes);
app.use(petRoutes);
app.use(journalRoutes);

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
