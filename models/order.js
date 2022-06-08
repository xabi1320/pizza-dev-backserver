const { Schema, model } = require('mongoose');


const OrderSchema = Schema({
    customer_data: {
        type: Object,
        require: [true, 'Customer data is required']
    },
    delivery: {
        type: Object,
        required: [true, 'Delivery way is required']
    },
    description: {
        type: Object,
        required: [true, 'Description is required']
    },
    order_number: {
        type: Number,
        unique: true,
        required: [true, 'Order number is required']
    },
    total_Amount: {
        type: Number,
        required: [true, 'Price is required']
    },
    status: {
        type: String,
        default: 'In Progress',
        required: true
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

OrderSchema.methods.toJSON = function() {
    const { _id, __v, status, ...data } = this.toObject();
    data.o_id = _id;
    return data;
}

module.exports = model('Order', OrderSchema)