const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const secure = require('../middleware/secure');

router.use(secure);

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        transactionItems: true,
        serviceItems: true,
        stockLogs: true,
      },
    });
    res.json({
      status: 'success',
      message: 'Products retrieved successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        transactionItems: true,
        serviceItems: true,
        stockLogs: true,
      },
    });
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }
    res.json({
      status: 'success',
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const {
      name,
      barcode,
      category,
      price,
      costPrice,
      stock,
      minStockLevel,
      unit,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        barcode,
        category,
        price,
        costPrice,
        stock,
        minStockLevel,
        unit,
      },
    });
    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      barcode,
      category,
      price,
      costPrice,
      stock,
      minStockLevel,
      unit,
    } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        barcode,
        category,
        price,
        costPrice,
        stock,
        minStockLevel,
        unit,
      },
    });
    res.json({
      status: 'success',
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
});

module.exports = router;
