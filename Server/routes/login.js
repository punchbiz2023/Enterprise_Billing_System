import express from 'express';
import jwt from 'jsonwebtoken';
import { drizzle } from 'drizzle-orm/postgres-js';
import { Users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

const router = express.Router();

const refreshTokens = {};
const client = postgres(process.env.DATABASE_URL);
const db4 = drizzle(client, { schema: { Users }, logger: true });

const generateAccessToken = (user) => {
    // Include user's email in the payload
    return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    refreshTokens[refreshToken] = user.email; // Store by email instead of userId
    return refreshToken;
};

// Login endpoint (POST /auth)
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch the user from the database based on the email using drizzle ORM
        const users = await db4
            .select({
                email: Users.mail,
                pass: Users.password,
            })
            .from(Users)
            .where(eq(Users.mail, email)); // Use `eq` for equality comparison

        console.log(users);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Get the first user from the array (assuming only one user per email)
        const user = users[0];

        // Direct comparison of the password (no bcrypt, assuming plain text passwords)
        if (user.pass !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT tokens (access and refresh)
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Respond with the generated tokens
        res.json({ accessToken, refreshToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Refresh token endpoint (POST /auth/refresh-token)
router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken || !refreshTokens[refreshToken]) {
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired refresh token' });
        }

        // Generate a new access token
        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    });
});

// Example of a protected route (GET /auth/protected-resource)
router.get('/protected-resource', (req, res) => {
    const authHeader = req.headers['authorization']; // Authorization header

    // Extract the token from the header
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    // If no token is found
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    // Verify the access token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid access token' });
        }

        // Send protected content
        res.json({ message: 'Protected content', user });
    });
});

export default router;
