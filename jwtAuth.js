const jwt = require('jsonwebtoken');
require('dotenv').config();


const jwtAuth = (req, res, next) => {
    // Extract the jwt token from the request headers
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ error: 'unauthorized token' })

    try {
        // Verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Attach user information to request the object
        req.user = decoded
        next();
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Internal server error' })
    }
}
module.exports = jwtAuth;