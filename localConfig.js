module.exports = {
    jwt: {
        secret: '_BHeGnPtbYmzX8U9n8Jm9^-y#U9t8T3Q&qjaQJ^fFCf4$fcytKbBbA3DfAfpC-K^',
        expiresIn: '1d'
    }, 

    facebookAuth: {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    twitterAuth : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    googleAuth : {
        'clientID'      : '848107477754-j43pmg0gsouv869f7etvi6acqghjq3tf.apps.googleusercontent.com',
        'clientSecret'  : 'FXQlbQWuSQDDIRehUPOyDWAC',
        'callbackURL'   : 'http://127.0.0.1:3000/auth/google/callback'
    },
    
    fourSquare : {
        'clientID'       : 'L5DDPYKZNXMEK0STLKVNTETOSXXEXC3LJNVRBDTMRKZIJOQE',
        'clientSecret'   : '1ZFJDO43IVUHNEVS4ME21UKJJNOFANCGGHENJBFG2RIGOZ5O',
        'v'              : '20190426' // version - YYYYMMDD
    },

    nodemailer : {
        'provider'   : 'Gmail',
        'email'      : 'loszigerianos@gmail.com',
        'password'   : 'cAtnot-jywnon-poqme2'
    }
};