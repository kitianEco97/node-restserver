const { request, response } = require('express');

const usuariosGet = (req = request, res = response) => {

    //const query = req.query;

    const { q, nombre = 'no name', page = 1, limit } = req.query;

    res.json({        
        msg: 'get Api - controlador',
        q,
        nombre,
        page,
        limit
    });
}

const usuariosPost = (req, res = response) => {

    // request: lo que el cliente o la persona estan solicitando
    // const body = req.body;

    // desestructurar la request para obteer solo lo que necesitamos
    const { nombre, edad } = req.body;

    res.json({        
        msg: 'post Api - controlador',
        nombre, edad
    });
}

const usuariosPut = (req, res = response) => {

    const id = req.params.id;

    res.json({        
        msg: 'put Api - controlador',
        id
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({        
        msg: 'patch Api - controlador'
    });
}

const usuariosDelete = (req, res = response) => {

    const id = req.params.id;

    res.json({        
        msg: 'delete Api - controlador',
        id
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}