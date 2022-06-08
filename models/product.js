const { Schema, model } = require('mongoose');


const ProductSchema = Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'name is required']
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
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'category is required']
    },
    description: { type: String },
    available: {
        type: Boolean,
        default: true
    },
    img: { type: String },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

ProductSchema.methods.toJSON = function() {
    const { _id, __v, status, ...data } = this.toObject();
    data.pid = _id;
    return data;
}

module.exports = model('Product', ProductSchema)