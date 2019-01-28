module.exports = {
    //Development configuration options
    db: 'mongodb://localhost:27017/360-rooms',
    sessionSecret: 'developmentSessionSecret',
    facebook: {
        clientID:     process.env.FACEBOOK_ID || 'id',
        clientSecret: process.env.FACEBOOK_SECRET || 'secret',
        callbackURL:  'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {
        clientID:     process.env.TWITTER_ID || 'id',
        clientSecret: process.env.TWITTER_SECRET || 'secret',
        callbackURL:  'http://localhost:3000/auth/twitter/callback'
    },
    google: {
        clientID:     process.env.GOOGLE_ID || 'id',
        clientSecret: process.env.GOOGLE_SECRET || 'secret',
        callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
    },
}