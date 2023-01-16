const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./src/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const ejs = require('ejs')
var cookieParser = require('cookie-parser')

const JWT_SECRET = 'vrwgha84fv8w1as56c1azxasdq8785646#@#$@$$5j14vsdfassdqwergdfvcs'

const app = express();
const router = express.Router();
app.set('view engine', 'ejs');

// === DB CONNECTION ======
const conn = require('./src/db/conn');
const { response, Router } = require('express');
const { findById } = require('./src/models/user');

// === PATH ======
app.use('/src', express.static(__dirname + '/src'));

// === BODYPARSER ======
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
// === STYLES ======
app.use('/src/css', express.static(__dirname + '/src/css'));
app.use('/src/img', express.static(__dirname + '/src/img'));

// === ROUTES ======
router.get('/', function (req, res) {
    res.render('login')

});

router.get('/views/register', function (req, res) {
    res.render('register')
});

// HOME
  
router.get('/views/home', function (req, res) {
    res.render('home')
});
// MODIFY HTML TAG

//  LOGIN
app.post('/', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email, }).select("+password")


    if (!user) {
        return res.json({ status: 'error', error: 'Email / Senha inválidos' })
    }

    if (await bcrypt.compare(password, user.password)) {
        // the email, password sucesso
        const token = jwt.sign({
            id: user._id,
            email: user.email
        },
            JWT_SECRET

        );

        res.cookie('authcookie', token, { maxAge: 900000, httpOnly: true })
        return res.json({ status: 'ok', data: token })
    }
    res.json({ status: 'error', error: 'Email / Senha inválidos' })
})

// Function which checks cookie
function checkToken(req, res) {
    //get authcookie from request
    const authcookie = req.cookies.authcookie

    //verify token which is in cookie value
    jwt.verify(authcookie, "JWT_SECRET", (err, data) => {
        if (err) {
            res.sendStatus(403)
            console.log(err)
            console.log(403)
        }
        else if (data.user) {
            req.user = data.user
            next()
        }
    });
}

// === REGISTER USER ======
app.post('/src/pages/register', async (req, res) => {
    const { username, lastName, email, birthday, gender, createdAt, password: plainTextPassword } = req.body

    // VALIDATION
    if (!email || typeof email !== 'string') {
        return res.json({ status: 'error', error: 'O email ja existe!' })
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Senha inválida!' })
    }
    // ==========

    // USER CAD
    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        const res = await User.create({
            username,
            lastName,
            email,
            password,
            birthday,
            gender,
            createdAt
        })
        console.log('Usuário criado com sucesso!')
    } catch (error) {
        if (error.code === 11000) { // EMAIL EXIST RETURN MSG 
            return res.json({ status: 'error', error: 'O email ja existe!' })
        }
    }

    res.json({ status: 'ok' })
})

app.use('/', router);

app.listen(process.env.port || 3000);

// 
console.log('Index: ON');

