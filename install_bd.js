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
        removed.n === 1 ? console.log(`Se ha eliminado ${removed.n} user`) : console.log(`Se han eliminado ${removed.n} documentos`);
    });
}

// Function that return array of objects from json file
function extractModels(fileName) {
    return new Promise(resolve => {

        const fichero = path.join(__dirname, './model/', fileName + '.json');

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
        const arrLocations = await extractModels('locations_zaragoza');
        //const arrLocations = await extractModels('locations_zaragoza');
        console.log('Se han eliminado los documentos existentes');
        // Store data in database
        /*for (const location of arrLocations.venues) {
            const saveLocation = new Location(location);

            await saveLocation.save();
        }*/
        const zaragozaPlaces = await extractModels('locations_zaragoza');
        const madridPlaces = await extractModels('locations_madrid');
        const vigoPlaces = await extractModels('locations_vigo');
        const serenaPlaces = await extractModels('locations_la_serena');
        const arrPlaces = (zaragozaPlaces.venues)
        .concat(madridPlaces.venues)
        .concat(vigoPlaces.venues)
        .concat(serenaPlaces.venues);

        for (const place of arrPlaces) {
            const newLocation = new Location(place);
            newLocation.description = "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque, cras eros tempor dictumst nostra aptent conubia, a mus habitant libero augue convallis faucibus."
            newLocation.coordinates.latitude = place.location.lat;
            newLocation.coordinates.longitude = place.location.lng;
            newLocation.address = place.location.address;
            newLocation.postalCode = place.location.postalCode;
            newLocation.cc = place.location.cc;
            newLocation.city = place.location.city;
            newLocation.state = place.location.state;
            newLocation.country = place.location.country;
            newLocation.formattedAddress = place.location.formattedAddress.join(', ');
            newLocation.tags = place.categories.map( (currentCategory, index, array) => currentCategory.name );
            newLocation.comments = [];
            if (newLocation.rating.totalVotes > 0 && newLocation.rating.totalValues > 0) {
                newLocation.rating.value = newLocation.rating.totalValues / newLocation.rating.totalVotes;
            } else {
                newLocation.rating.value = 0;
            }

            // Photos
            const arrItems = await extractModels('location_photos');

            let photoUrl = [];
            for (const item of arrItems.photos.items) {
                if (item.visibility.toLowerCase() === 'public'.toLowerCase()) {
                    const url = `${item.prefix}${item.width}x${item.height}${item.suffix}`;
                    photoUrl.push(url);
                }
            }
            newLocation.photos = photoUrl;
            
            await newLocation.save();
        }
        

        // Return array with data
        /*const zaragozaPlaces = await extractModels('zaragoza');
        const madridPlaces = await extractModels('madrid');
        const vigoPlaces = await extractModels('vigo');
        const serenaPlaces = await extractModels('la_serena');
        const arrPlaces = zaragozaPlaces.concat(madridPlaces).concat(vigoPlaces).concat(serenaPlaces)
        // Store data in database
        for (const place of arrPlaces) {
            const newLocation = new Location();
            newLocation.id = place.id;
            //newLocation.place_id = place.place_id;
            newLocation.name = place.name;
            newLocation.description = "Lorem ipsum dolor sit amet consectetur adipiscing elit quisque, cras eros tempor dictumst nostra aptent conubia, a mus habitant libero augue convallis faucibus."
            newLocation.address = place.vicinity;
            newLocation.coordinates.latitude = place.geometry.location.lat;
            newLocation.coordinates.longitude = place.geometry.location.lng;
            newLocation.rating = place.rating;
            newLocation.photos = [];
            newLocation.tags = place.types;
            newLocation.comments = [];
            
            await newLocation.save();
        }*/

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