// logger.mjs
const logger = (req, res, next) => {
    const methodColors = {
        GET: '\x1b[32m', // Green
        POST: '\x1b[34m', // Blue
        PUT: '\x1b[33m', // Yellow
        DELETE: '\x1b[31m', // Red
    };
    const resetColor = '\x1b[0m';
    console.log(`${methodColors[req.method] || ''}${new Date().toISOString()} - ${req.method} ${req.url}${resetColor}`);
    if (req.method !== 'GET') {
        console.log(req.body);
    }
    next();
};

export default logger;

