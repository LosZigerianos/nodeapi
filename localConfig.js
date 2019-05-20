module.exports = {
    jwt: {
        secret: '_BHeGnPtbYmzX8U9n8Jm9^-y#U9t8T3Q&qjaQJ^fFCf4$fcytKbBbA3DfAfpC-K^',
        expiresIn: '1d'
    }, 

    facebookAuth: {
        'clientID'      : 'your_secret_client_id_here', // your App ID
        'clientSecret'  : 'your_client_secret_here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    twitterAuth : {
        'consumerKey'       : 'your_consumer_key_here',
        'consumerSecret'    : 'your_client_secret_here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    googleAuth : {
        'clientID'      : 'your_client_id_here',
        'clientSecret'  : 'your_client_secret_id_here',
        'callbackURL'   : 'http://127.0.0.1:3000/auth/google/callback'
    },
    
    fourSquare : {
        'clientID'       : 'your_client_id_here',
        'clientSecret'   : 'your_client_secret_here',
        'v'              : '20190426' // version - YYYYMMDD
    },

    nodemailer : {
        'provider'   : 'Gmail',
        'email'      : 'your_email_here',
        'password'   : 'your_email_password_here'
    },
    s3: {
        accessKeyId: 'your_access_key_here',
        secretAccessKey: 'your_secret_access_key_here',
        region: 'us-east-1',
        bucket_name: 'your_bucket_name_here'
    },
};
