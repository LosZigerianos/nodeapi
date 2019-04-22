'use strict';

const fs = require('fs');
const path = require('path');
const Location = require('./model/Location');
const User = require('./model/User');
const crypto = require('crypto');

// Función para eliminar los documentos existentes de la colección
function eliminarDocumento(documento) {
    return documento.remove(function(err, removed) {
        if (err) {
            console.log('No ha sido posible eliminar los documentos:', err);
            return;
        }
        // where removed is the count of removed documents
        removed.n === 1 ? console.log(`Se ha eliminado ${removed.n} user`) : console.log(`Se han eliminado ${removed.n} users`);
    });
}

// Función que retorna un array de objetos del fichero
function extraerModelos(nombreFichero) {
    return new Promise(resolve => {

        const fichero = path.join(__dirname, './model/', nombreFichero + '.json');

        fs.readFile(fichero, 'utf8', (err, data) => { // esta es la opción ASINCRONA! fs.readFile(path, 'utf8' (las opciones), callback);

            if (err) {
                console.log('No ha sido posible extraer los modelos', err);
                return;
            }

            const packageObject = JSON.parse(data);
            resolve(packageObject.data);
        });

    });
}

// Función para cargar los modelos en la base de datos del servidor MongoDB
const cargarModelos = async function() {
    try {
        // Conexión de Mongoose
        const conn = await require('./lib/connectMongoose');
        console.log('Conectado a la base de datos');

        // Eliminar documentos existentes de la colección
        await eliminarDocumento(Location);
        await eliminarDocumento(User);
        console.log('Se han eliminado los documentos existentes');

        // Genera un array con todos los modelos
        const arrLocations = await extraerModelos('locations');
        console.log('Se han eliminado los documentos existentes');
        // Guardar documento en la base de datos
        for (const location of arrLocations) {
            const saveLocation = new Location(location);
            await saveLocation.save();
        }

        // Genera un array con todos los modelos
        const arrUsers = await extraerModelos('users');
        // Guardar documento en la base de datos
        for (const user of arrUsers) {
            let saveUser = new User(user);
            saveUser.password = crypto.createHash('sha256').update(saveUser.password).digest('base64');
            await saveUser.save();
        }
        console.log('Se han guardado los documentos en la base de datos');

        // Se desconecta de la base de datos
        conn.close(function () {
            console.log('Mongoose connection disconnected');
        });

    } catch(err) {
        console.log('No ha sido posible cargar a los usuarios en la base de datos. Error:', err);
    }
    
};

// Ejecutamos la función
cargarModelos();