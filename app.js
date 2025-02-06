//viskas, kas susiję su express yra viename faile, šis failas labiau yra skirtas middlewares, kurios prieinamos visiems requests

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const invoiceRouter = require('./routes/invoiceRoutes');
const errorHandler = require('./middleware/errorHandler');
const AppError = require('./utils/appError');

// create server
const app = express();

// Middleware, that only parses json and only looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for handling CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//our custom middlewares, working for any request
// app.use((req, res, next) => {
//   console.log('Hello from the middleware for any route');

//   //jei nerarašysime next(), request response cycle sustos ir mes neprieisime prie router handlerio ir response neišsisiųs
//   next();
// });

//we add request time on every request
// app.use((req, res, next) => {
//   req.requestTime = new Date().toLocaleString();
//   next();
// });

// ROUTES
//naudojame tourRouter, procesas vadinasi "mounting the router"

app.use('/api/v1/users', userRouter);
app.use('/api/v1/invoices', invoiceRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

module.exports = app;
