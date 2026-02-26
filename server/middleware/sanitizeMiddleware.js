/**
 * Sanitization Middleware
 * Trims inputs and provides basic XSS protection
 */

const sanitize = (req, res, next) => {
    if (req.body) {
        for (const key in req.body) {
            if (typeof req.body[key] === 'string') {
                // Trim whitespace
                req.body[key] = req.body[key].trim();

                // Basic XSS protection - replace < and > tags
                req.body[key] = req.body[key].replace(/<[^>]*>?/gm, '');
            }
        }
    }

    if (req.query) {
        for (const key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
                req.query[key] = req.query[key].replace(/<[^>]*>?/gm, '');
            }
        }
    }

    next();
};

module.exports = sanitize;
