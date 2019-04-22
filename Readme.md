# NODEAPI

-------------------------------------------------------------------------------

## Installation

Install dependencies with:

```shell
npm install
```

-------------------------------------------------------------------------------

## MongoDB

This application uses MongoDB.

### MongoDB Server

To start the MongoDB server, you can use from mongo directory:

```
./bin/mongod --dbpath ./data/db --directoryperdb
```

### MongoDB Client

To start as MongoDB client, you can use:

```
./bin/mongo
```

-------------------------------------------------------------------------------

## Start the API

### Upload model files

To upload model files to mongoDB, you can use:

```shell
npm run installDB
```

### Production

To start the application in production mode use:

```shell
npm start
```

### Development

To start the application in development mode use:

```shell
npm run dev
```

NOTE: This mode uses nodemon.

### Cluster

To start the application in cluster mode use:

```shell
npm run cluster
```

-------------------------------------------------------------------------------

## API Documentation

### USERS

#### Base URL

To go to the base URL, you can use:

http://localhost:3000/apiv1/users

#### Register User - POST Method

To register an user, make a POST to: /signin

http://localhost:3000/apiv1/users/signin

Insert the followings fields:

    - name
    - email
    - password

#### Authentication - POST Method

To obtain a token, make a POST to: /login

http://localhost:3000/apiv1/users/login

Use that token in the rest of request in:

    - header: 'x-access-token'
    - body: token
    - query string: token=###tokenValue###


### LOCATIONS
