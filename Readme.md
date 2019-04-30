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

```http://localhost:3000/apiv1/users```

#### Register User - POST Method

To register an user, make a POST to: /signup

```http://localhost:3000/apiv1/users/signup```

Insert the followings fields:

    - name
    - email
    - password

#### Local authentication - POST Method

To obtain a token, make a POST to: /login

```http://localhost:3000/apiv1/users/login```

Use that token in the rest of request in:

    - header: 'x-access-token'
    - body: token
    - query string: token=###tokenValue###

#### Google authentication - POST Method

To obtain a token, make a POST to: /login/google

```http://localhost:3000/apiv1/users/login/google```

Use that token in the rest of request in:

    - header: 'x-access-token'
    - body: token
    - query string: token=###tokenValue###


### LOCATIONS

#### Base URL

To go to the base URL, you can use:

```http://localhost:3000/apiv1/locations?token=###tokenValue###```


#### Get all locations from database - GET Method

To view all locations, make a GET adding the token to: ?token=###tokenValue###

```http://localhost:3000/apiv1/locations?token=###tokenValue###```

To find that you want, you can search directly on the list of the all locations.

Or you can add the following filters:

    - To filter by name, you can use: &name=Parque
    http://localhost:3000/apiv1/locations?token=###tokenValue###&name=Parque

    - To paginate results, you can use: &skip=3&limit=2
    http://localhost:3000/apiv1/locations?token=###tokenValue###&skip=3&limit=2

    - To choose/show only some fields as shown: &fields=name tags photos -_id
    http://localhost:3000/apiv1/locations?token=###tokenValue###&fields=name tags photos -_id

    - (*) To order the list by name, you can use: &sort=name
    http://localhost:3000/apiv1/locations?token=###tokenValue###&sort=name

Warning (*): If you use this filter, first will be executed this filter and after the rest of the filters regardless of the order. The final result can be different than excepted.

Note: The filters can be combined with each other:

```http://localhost:3000/apiv1/locations?token=###tokenValue###&fields=name%20city%20-_id&sort=city```


#### Search places by location (Database) - GET Method

To view places by location, make a GET adding the token to: ?token=###tokenValue###

```http://localhost:3000/apiv1/locations/###location###?token=###tokenValue###```

Note: The filters can be done as 'Get all locations'.

#### Search specific places by location (Database + API) - GET Method

The results will be downloaded from api if there are no results in the database.

To view a specific places from location, make a GET adding the token to: ?token=###tokenValue###

```http://localhost:3000/apiv1/locations/###location###/###place###?token=###tokenValue###```

Note: The filters can be done as 'Get all locations'.



### COMMENTS

#### Base URL

To go to the base URL, you can use:

```http://localhost:3000/apiv1/comments```

#### Get all comments by user - GET Method

To view all comments, make a GET adding the token to: ?token=###tokenValue###

```http://localhost:3000/apiv1/comments/###user_id###?token=###tokenValue###```

#### Get all comments by location - GET Method

To view all comments, make a GET adding the token to: ?token=###tokenValue###

```http://localhost:3000/apiv1/comments/###location_id###?token=###tokenValue###```


#### Filters
you can add the following filters:

    - To paginate results, you can use: &skip=3&limit=2
    http://localhost:3000/apiv1/comments/###locationId###?token=###tokenValue###&skip=3&limit=2

    - To choose/show only some fields as shown: &fields=location description -_id
    http://localhost:3000/apiv1/comments/###locationId###?token=###tokenValue###&fields=location description -_id

    - (*) To order the list by name, you can use: &sort=name
    http://localhost:3000/apiv1/comments/###userId###?token=###tokenValue###&sort=name


#### Create a new comment - POST Method

To create a new comment, make a POST adding the parameters in body:

    - token
    - locationId
    - description

```http://localhost:3000/apiv1/comments```

