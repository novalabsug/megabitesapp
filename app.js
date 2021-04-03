const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const cors = require('cors');
const multer = require('multer');
const { fileLoader } = require('ejs');

const app = express();

// view engine
app.set('view engine', 'ejs');

app.set('views', 'views');

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// app.use(multer({
//     dest: './uploads/',
//     rename: function(fieldname, filename) {
//         return filename;
//     }
// }));

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://nova:novalabs@cluster0.qyhpo.mongodb.net/megabites?retryWrites=true&w=majority')
    .then((result) => app.listen(PORT, () => console.log(`Listening on port ${PORT}`)))
    .catch((err) => console.log(err));

// mongoose.connect('mongodb://localhost:27017/megaBites')
//     .then((result) => app.listen(PORT, () => console.log(`Listening to port ${PORT}`)))
//     .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('index'));
app.get('/menu', requireAuth, (req, res) => res.render('menu'));
app.get('/reservation', requireAuth, (req, res) => res.render('reservation'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.use(authRoutes);