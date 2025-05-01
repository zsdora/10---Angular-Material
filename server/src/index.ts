import { MainClass } from './main-class';
import express from 'express';
import { Request, Response } from 'express';
import { configureRoutes } from './routes/routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 5000;
const dbUrl = 'mongodb+srv://dononono0:admin@hotelcluster.rrubk.mongodb.net/Hotel';

// mongodb connection
mongoose.connect(dbUrl).then((_) => {
    console.log('Successfully connected to MongoDB.');
}).catch(error => {
    console.log(error);
    return;
});

// Updated CORS configuration
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// bodyParser
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb'}));

// cookieParser
app.use(cookieParser());

// session
const sessionOptions: expressSession.SessionOptions = {
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set to true if using https
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
};
app.use(expressSession(sessionOptions));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

// Routes configuration
app.use('/app', configureRoutes(passport, express.Router()));

// Start server
app.listen(port, () => {
    console.log('Server is listening on port ' + port.toString());
});

console.log('After server is ready.');