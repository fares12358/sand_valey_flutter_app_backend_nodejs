import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.role !== 'admin' && decoded.role !== 'user') {
            return res.status(403).json({ message: 'Access denied: Admins or Users only' });
        }

        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
