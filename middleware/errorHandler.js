const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Internal Server Error';

    console.log(err);
    

    res.status(statusCode).json({ status, message });
}

module.exports = errorHandler