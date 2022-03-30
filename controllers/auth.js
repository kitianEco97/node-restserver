const { response, json } = require("express");
const bcryptjs = require('bcryptjs');
    
const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        
        // generar el JWT
        const token = await generarJWT  (usuario.id);

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "hable con el administrador"
        });
    }    
}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {
        const { correo, nombre, img } = await googleVerify( id_token );
        console.log(correo);
        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true,
            };
            
            usuario = new Usuario( data );
            await usuario.save();
        }
        // si el usuario en BBDD
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'hable con el administrador, usuario bloqueado'
            });
        }

        // generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'el token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}