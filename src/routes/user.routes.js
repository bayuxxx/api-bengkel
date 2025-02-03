const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Middleware to check if user is SUPER_ADMIN
const isSuperAdmin = checkRole(['SUPER_ADMIN']);

// Get all users
router.get('/', authenticate, isSuperAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                password : true,
                email: true,
                name: true,
                role: true,
                active: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user by ID
router.get('/:id', authenticate, isSuperAdmin, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                username: true,
                password : true,
                email: true,
                name: true,
                role: true,
                active: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create new user
router.post('/', authenticate, isSuperAdmin, async (req, res) => {
    try {
        const { username, email, password, name, role } = req.body;

        // Check if username or email already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                name,
                role,
            },
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                role: true,
                active: true,
                createdAt: true,
            },
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
router.put('/:id', authenticate, isSuperAdmin, async (req, res) => {
    try {
        const { username, email, password, name, role, active } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: req.params.id },
        });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Prepare update data
        const updateData = {
            username,
            email,
            name,
            role,
            active,
            updatedAt: new Date(),
        };

        // If password is provided, hash it
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.params.id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                name: true,
                role: true,
                active: true,
                updatedAt: true,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user
router.delete('/:id', authenticate, isSuperAdmin, async (req, res) => {
    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: req.params.id },
        });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete user
        await prisma.user.delete({
            where: { id: req.params.id },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;