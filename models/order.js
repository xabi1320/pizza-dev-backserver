const { Schema, model } = require('mongoose');


const OrderSchema = Schema({
    customerData: {
        type: Object,
        require: [true, 'Customer data is required']
    },
    delivery: {
        type: Object,
        required: [true, 'Delivery way is required']
    },
    description: {
        type: Array,
        required: [true, 'Description is required']
    },
    orderNumber: {
        type: Number,
        unique: true,
        required: [true, 'Order number is required']
    },
    totalAmount: {
        type: Number,
        required: [true, 'Price is required']
    },
    status: {
        type: String,
        default: 'preparing',
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

OrderSchema.methods.toJSON = function() {
    const { _id, __v, ...data } = this.toObject();
    data.o_id = _id;
    return data;
}

module.exports = model('Order', OrderSchema)