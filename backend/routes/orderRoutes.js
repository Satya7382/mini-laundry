const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Utility: escape regex (prevents ReDoS attacks)
const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Valid statuses
const VALID_STATUSES = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];


// ======================
// 🟢 CREATE ORDER
// ======================
router.post('/', async (req, res) => {
  try {
    const { customerName, phoneNumber, items, estimatedDeliveryDate } = req.body;

    // ✅ Validation
    if (!customerName || !phoneNumber || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // ✅ Calculate total
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += (item.quantity || 0) * (item.price || 0);
    });

    // ✅ Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      orderId,
      customerName,
      phoneNumber,
      items,
      totalAmount,
      status: 'RECEIVED',
      estimatedDeliveryDate
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// ======================
// 🟢 GET ORDERS (Search + Filter + Pagination)
// ======================
router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    let query = {};

    // ✅ Filter by status
    if (status && VALID_STATUSES.includes(status)) {
      query.status = status;
    }

    // ✅ Search (safe regex)
    if (search) {
      const safeSearch = escapeRegex(search);

      query.$or = [
        { customerName: { $regex: safeSearch, $options: 'i' } },
        { phoneNumber: { $regex: safeSearch, $options: 'i' } },
        { orderId: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),

      Order.countDocuments(query)
    ]);

    res.json({
      data: orders,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// ======================
// 🟢 DASHBOARD (Optimized)
// ======================
router.get('/dashboard', async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },

          RECEIVED: { $sum: { $cond: [{ $eq: ['$status', 'RECEIVED'] }, 1, 0] } },
          PROCESSING: { $sum: { $cond: [{ $eq: ['$status', 'PROCESSING'] }, 1, 0] } },
          READY: { $sum: { $cond: [{ $eq: ['$status', 'READY'] }, 1, 0] } },
          DELIVERED: { $sum: { $cond: [{ $eq: ['$status', 'DELIVERED'] }, 1, 0] } }
        }
      }
    ]);

    const stats = result[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      RECEIVED: 0,
      PROCESSING: 0,
      READY: 0,
      DELIVERED: 0
    };

    res.json({
      totalOrders: stats.totalOrders,
      totalRevenue: stats.totalRevenue,
      statusCounts: {
        RECEIVED: stats.RECEIVED,
        PROCESSING: stats.PROCESSING,
        READY: stats.READY,
        DELIVERED: stats.DELIVERED
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// ======================
// 🟢 UPDATE STATUS
// ======================
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Validate status
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;