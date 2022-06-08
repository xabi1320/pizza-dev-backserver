const { Schema, model } = require('mongoose');


const IngredientSchema = Schema({
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
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'category is required']
    },
    img: { type: String },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

IngredientSchema.methods.toJSON = function() {
    const { _id, __v, status, ...data } = this.toObject();
    data.i_id = _id;
    return data;
}

module.exports = model('Ingredient', IngredientSchema)