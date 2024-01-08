const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();
const Model = require('./model/model');

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'session'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use(async (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    try {
        const user = await Model.findById(req.session.user._id);
        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use((req, res, next) => {
    try {
        res.locals.isAuthenticated = req.session.isLoggedIn;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to Database...');
    }
    catch (error) {
        console.log(error.message);
    }
})();

const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');

app.use('/users', userRoute);
app.use('/admin', adminRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});