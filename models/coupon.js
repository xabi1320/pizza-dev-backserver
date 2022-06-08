const { Schema, model } = require('mongoose');


const CouponSchema = Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'description is required']
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    img: { type: String },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

CouponSchema.methods.toJSON = function() {
    const { _id, __v, status, ...data } = this.toObject();
    data.co_id = _id;
    return data;
}

module.exports = model('Coupon', CouponSchema)