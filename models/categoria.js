const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

CategoriaSchema.methods.toJSON = function() {
    // para quitar los valores de los parametros '__v, password'
    const { __v, estado, ...data } = this.toObject();
    return data; // usuario no contiene __v ni password
}

module.exports = model('Categoria', CategoriaSchema);