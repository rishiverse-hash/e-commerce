const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    url: String,
    alt: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  variant: {
    name: String,
    value: String
  },
  sku: String,
  total: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    rate: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  shipping: {
    cost: {
      type: Number,
      default: 0,
      min: 0
    },
    method: String,
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date
  },
  discount: {
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    code: String,
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'free-shipping']
    }
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Addresses
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: String,
    address1: { type: String, required: true },
    address2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String
  },
  billingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: String,
    address1: { type: String, required: true },
    address2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String
  },
  
  // Payment
  payment: {
    method: {
      type: String,
      required: true,
      enum: ['stripe', 'paypal', 'cod', 'bank-transfer']
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentIntentId: String,
    paidAt: Date,
    failureReason: String
  },
  
  // Order Status
  status: {
    type: String,
    required: true,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
      'returned'
    ],
    default: 'pending'
  },
  
  // Status History
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Fulfillment
  fulfillment: {
    method: {
      type: String,
      enum: ['shipping', 'pickup', 'digital'],
      default: 'shipping'
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'failed'],
      default: 'pending'
    },
    shippedAt: Date,
    deliveredAt: Date,
    estimatedDelivery: Date
  },
  
  // Customer Notes
  customerNotes: String,
  adminNotes: String,
  
  // Flags
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  
  // Refund/Return
  refund: {
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    reason: String,
    status: {
      type: String,
      enum: ['none', 'requested', 'processing', 'completed', 'rejected'],
      default: 'none'
    },
    requestedAt: Date,
    processedAt: Date,
    refundId: String
  },
  
  // Analytics
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin', 'api'],
    default: 'web'
  },
  
  // Timestamps
  placedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ placedAt: -1 });
orderSchema.index({ total: 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to add status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
    
    // Update status-specific timestamps
    switch (this.status) {
      case 'confirmed':
        this.confirmedAt = new Date();
        break;
      case 'shipped':
        this.shippedAt = new Date();
        this.fulfillment.status = 'shipped';
        this.fulfillment.shippedAt = new Date();
        break;
      case 'delivered':
        this.deliveredAt = new Date();
        this.fulfillment.status = 'delivered';
        break;
      case 'cancelled':
        this.cancelledAt = new Date();
        break;
    }
  }
  next();
});

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  
  // Calculate total
  this.total = this.subtotal + this.tax.amount + this.shipping.cost - this.discount.amount;
  
  return this.total;
};

// Method to update status
orderSchema.methods.updateStatus = async function(newStatus, note = '', updatedBy = null) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
  
  // Handle inventory for cancelled orders
  if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
    const Product = mongoose.model('Product');
    
    for (const item of this.items) {
      const product = await Product.findById(item.product);
      if (product) {
        await product.releaseStock(item.quantity);
      }
    }
  }
  
  await this.save();
  return this;
};

// Method to process refund
orderSchema.methods.processRefund = async function(amount, reason) {
  this.refund.amount = amount;
  this.refund.reason = reason;
  this.refund.status = 'processing';
  this.refund.requestedAt = new Date();
  
  if (amount >= this.total) {
    this.status = 'refunded';
  }
  
  await this.save();
  return this;
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function(startDate, endDate) {
  const matchStage = {
    placedAt: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        statusBreakdown: {
          $push: '$status'
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalOrders: 1,
        totalRevenue: 1,
        averageOrderValue: { $round: ['$averageOrderValue', 2] },
        statusBreakdown: 1
      }
    }
  ]);
  
  return stats[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    statusBreakdown: []
  };
};

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((new Date() - this.placedAt) / (1000 * 60 * 60 * 24));
});

// Virtual for current status info
orderSchema.virtual('currentStatusInfo').get(function() {
  const latestStatus = this.statusHistory[this.statusHistory.length - 1];
  return latestStatus || { status: this.status, timestamp: this.createdAt };
});

// Transform output
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);