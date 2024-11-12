import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JSWTOKEN;

class JWTService {
    static sign(tokenInfo) {
        return jwt.sign(tokenInfo, jwtSecret, { expiresIn: '1h' });
    }

    static verify(token) {
        try {
            return jwt.verify(token, jwtSecret);
        } catch (error) {
            console.error('Token verification error:', error.message); // Log the error message
            throw new Error('Invalid token');
        }
    }
}

export default JWTService;
