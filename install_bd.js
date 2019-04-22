'use strict';

const fs = require('fs');
const path = require('path');
const Location = require('./model/Location');
const User = require('./model/User');
const crypto = require('crypto');

// Function to remove all documents from collection
function removeDocument(documento) {
    return documento.remove(function(err, removed) {
        if (err) {
            console.log('No ha sido posible eliminar los documentos:', err);
            return;
        }
        // where removed is the count of removed documents
        removed.n === 1 ? console.log(`Se ha eliminado ${removed.n} user`) : console.log(`Se han eliminado ${removed.n} users`);
    });
}

// Function that return array of objects from json file
function extractModels(nombreFichero) {
    return new Promise(resolve => {

        const fichero = path.join(__dirname, './model/', nombreFichero + '.json');

        fs.readFile(fichero, 'utf8', (err, data) => {

            if (err) {
                console.log('No ha sido posible extraer los modelos', err);
                return;
            }

            const packageObject = JSON.parse(data);
            resolve(packageObject.data);
        });

    });
}

// Function to upload data at mongoDB database
const uploadData = async function() {
    try {
        // Connect to database
        const conn = await require('./lib/connectMongoose');
        console.log('Database connected');

        // Remove all documents from collection
        await removeDocument(Location);
        await removeDocument(User);
        console.log('Se han eliminado los documentos existentes');

        // Return array with data
        const arrLocations = await extractModels('locations');
        console.log('Se han eliminado los documentos existentes');
        // Store data in database
        for (const location of arrLocations) {
            const saveLocation = new Location(location);
            await saveLocation.save();
        }

        // Return array with data
        const arrUsers = await extractModels('users');
        // Store data in database
        for (const user of arrUsers) {
            let saveUser = new User(user);
            saveUser.password = crypto.createHash('sha256').update(saveUser.password).digest('base64');
            await saveUser.save();
        }
        console.log('Se han guardado los documentos en la base de datos');

        // Disconnect from database
        conn.close(function () {
            console.log('Database disconnected');
        });

    } catch(err) {
        console.log('No ha sido posible cargar a los usuarios en la base de datos. Error:', err);
    }
    
};

uploadData();