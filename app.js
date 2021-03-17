const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./server/routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./server/middleware/authMiddleware');
const cors = require('cors');

const app = express();

// view engine
app.set('view engine', 'ejs');

app.set('views', './client/views');

// middleware
app.use(express.static('client/public'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect('mongodb://localhost/megaBites')
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('index'));
app.get('/menu', requireAuth, (req, res) => res.render('menu'));
app.get('/reservation', requireAuth, (req, res) => res.render('reservation'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.use(authRoutes);