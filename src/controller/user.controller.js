const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                password: true,
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
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                username: true,
                password: true,
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
};

// Create new user
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, name, role } = req.body;

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: { username, email, password: hashedPassword, name, role },
            select: { id: true, username: true, email: true, name: true, role: true, active: true, createdAt: true },
        });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { username, email, password, name, role, active } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { id: req.params.id } });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updateData = { username, email, name, role, active, updatedAt: new Date() };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.params.id },
            data: updateData,
            select: { id: true, username: true, email: true, name: true, role: true, active: true, updatedAt: true },
        });

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const existingUser = await prisma.user.findUnique({ where: { id: req.params.id } });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        await prisma.user.delete({ where: { id: req.params.id } });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
