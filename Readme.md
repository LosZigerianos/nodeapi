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

    - username
    - email
    - password

#### Me data - GET Method

To get **Me data** of an user, make a GET to: /userId/###userId###

```http://localhost:3000/apiv1/users/userId/###userId###```

#### Update User - PUT Method

To Update an user, make a PUT to: /userId/###userId###/update

```http://localhost:3000/apiv1/users/userId/###userId###/update```

You CAN insert the followings fields:

    - fullname
    - username
    - email
    - username

#### Change Password - PUT Method

To Change password of an user, make a PUT to: /userId/:userId/change-password

```http://localhost:3000/apiv1/users/me/userId/###userId###/change-password```

Insert the followings fields:

    - oldPassword
    - newPassword

#### Upload photo - PUT Method

To upload photo of an user, make a PUT to: /userId/###userId###/photo

```http://localhost:3000/apiv1/users/userId/###userId###/photo```

Add Header **Content-Type: multipart/form-data**

Insert the followings fields like **File type**:

    - image


#### Followers and Following EndPoints

##### Add Following to other User  - POST Method

To Add Following to other user, make a POST to: /userId/###userId###/following/add
```http://localhost:3000/apiv1/users/userId/###userId###/following/add```

Insert the followings fields:

    - followingId

##### Delete Following from a User  - DELETE Method

To Add Following to other user, make a POST to: /userId/###userId###/following/delete
```http://localhost:3000/apiv1/users//userId/###userId###/following/delete```

Insert the followings fields:

    - followingId

##### Get Following From user  - GET Method

To Get Following from user, make a GET to: /userId/###userId###/following
```http://localhost:3000/apiv1/users/userId/###userId###/following```

##### Get Followers From user  - GET Method

To Get Following from user, make a GET to: /userId/###userId###/followers
```http://localhost:3000/apiv1/users/userId/###userId###/followers```

##### Followers and Following Filters
```
- To paginate results, you can use: &skip=3&limit=2
http://localhost:3000/apiv1/users/userId/###userId###/followers?skip=3&limit=2

- To choose/show only some fields as shown: &fields=name tags photos -_id
http://localhost:3000/apiv1/users/userId/###userId###/followers?fields=fullname -email

- (*) To order the list by name, you can use: &sort=name
http://localhost:3000/apiv1/users/userId/###userId###/following?sort=fullname
```

#### Search Friends - GET Method
To search friends, make a GET to: /search?query=###searchQuery###
```http://localhost:3000/apiv1/users/search?query=###searchQuery###```
**Note: query param is required**

#### User Profile - GET Method

To get User Profile, make a GET to: /profile/###userId###
```http://localhost:3000/apiv1/users/profile/###userId###```

**User profile Filters (comments and locations)**

```
- To paginate **comments**, you can use: &skipComment=3&limitComment=2
http://localhost:3000/apiv1/users/userId/###userId###/followers?skipComment=3&limitComment=2

- To choose/show only some fields from **comments** as shown: &fieldsComments=description -_id
http://localhost:3000/apiv1/users/userId/###userId###/followers?fieldsComments=description

- To choose/show only some fields from **locations** as shown: &fieldsComments=description -_id
http://localhost:3000/apiv1/users/userId/###userId###/followers?fieldsLocations=name -_id

- (*) To order the list by creation_date from **comments**, you can use: &sortComments=name
http://localhost:3000/apiv1/users/userId/###userId###/following?sortComments=creation_date
```
    

#### Recover password - POST Method

To recover the password of an user, make a POST to: /recoverPassword

```http://localhost:3000/apiv1/users/recoverPassword```

Insert the followings fields:
    - email

Finally, an email with the new password will be sent so that the user can update it. 

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

```http://localhost:3000/apiv1/locations/city/###location###?token=###tokenValue###```

Note: The filters can be done as 'Get all locations'.

#### Search specific places by location (Database + API) - GET Method

The results will be downloaded from api if there are no results in the database.

To view a specific places from location, make a GET adding the token to: ?token=###tokenValue###

```http://localhost:3000/apiv1/locations/city/###location###/place/###place###?token=###tokenValue###```

Note: The filters can be done as 'Get all locations'.

#### Get near locations (DATABASE) - Get Method

To view near locations, make a GET adding the token to: ?token=###tokenValue###

Insert the following fields required:
```
- latitude
- longitude
```

```Note: optional query field: search```

**Example: ```locations/near?latitude=41.6560593&longitude=-0.87734```**
**Example with search: ```locations/near?latitude=41.6560593&longitude=-0.87734&search=cafe```**


```http://localhost:3000/apiv1/locations/near?latitude=###latitudeValue###&longitude=###longitudeValue###&token=###tokenValue###```



### COMMENTS

#### Base URL

To go to the base URL, you can use:

```http://localhost:3000/apiv1/comments```

#### Get all comments by user - GET Method

To view all comments, make a GET adding the token to: ?token=###tokenValue###

```http://localhost:3000/apiv1/comments/user/###user_id###?token=###tokenValue###```

#### Get all comments by location - GET Method

To view all comments, make a GET adding the token to: ?token=###tokenValue###

```http://localhost:3000/apiv1/comments/location/###location_id###?token=###tokenValue###```


#### Get all comments from following user like timeline - GET Method

To view timeline comments, make a GET adding the token to: ?token=###tokenValue###

```http://localhost:3000/apiv1/comments/timeline?token=###tokenValue###```


#### Filters
you can add the following filters:

    - To paginate results, you can use: &skip=3&limit=2
    http://localhost:3000/apiv1/comments/location/###locationId###?token=###tokenValue###&skip=3&limit=2

    - To choose/show only some fields as shown: &fields=location description -_id
    http://localhost:3000/apiv1/comments/location/###locationId###?token=###tokenValue###&fields=location description -_id

    - (*) To order the list by name, you can use: &sort=creation_date
    http://localhost:3000/apiv1/comments/user/###userId###?token=###tokenValue###&sort=creation_date


#### Create a new comment - POST Method

To create a new comment, make a POST adding the parameters in body:

    - token
    - locationId
    - description

```http://localhost:3000/apiv1/comments/add```


#### Delete a comment - DELETE Method

To delete a comment, make a DELETE adding the **comment id** parameter in url and add in body or query params:

    - token

```http://localhost:3000/apiv1/comments/###commentId###/delete```

Note: Only can to delete a comment the same user that it created

### Validate token - GET Method
To validate a token, make a GET adding token to:
```http://localhost:3000/apiv1/token/validate?token=###TOKEN###```
