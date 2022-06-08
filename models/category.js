const { Schema, model } = require('mongoose');


const CaterogySchema = Schema({
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
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

CaterogySchema.methods.toJSON = function() {
    const { _id, __v, status, ...data } = this.toObject();
    data.cid = _id;
    return data;
}

module.exports = model('Category', CaterogySchema)