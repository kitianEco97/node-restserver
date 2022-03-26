const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { emailExiste } = require('../helpers/db-validators');

const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({        
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {
    
    // request: lo que el cliente o la persona estan solicitando
    // const body = req.body;

    // desestructurar la request para obtener solo lo que necesitamos
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en base de datos
    await usuario.save();

    res.json({        
        usuario
    });
}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    // de esta forma aunque el cliente envie estos campos, seran ignorados y no se actualizaran
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO: validar contra la base de datos
    if (password) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );        
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({        
        msg: 'patch Api - controlador'
    });
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario);
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}