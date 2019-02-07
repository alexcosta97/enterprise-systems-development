module.exports = {
    //Development configuration options
    db: process.env.MONGODB_URI || 'mongodb://localhost:27017/360-rooms',
    sessionSecret: process.env.sessionSecret || 'developmentSessionSecret',
    jwtSecret: process.env.jwtSecret || 'jwtDevSecret'
}