module.exports = {
    //Test configuration options
    db: process.env.MONGOURI || 'mongodb://localhost:27017/360-rooms',
    sessionSecret: process.env.sessionSecret || 'testSessionSecret',
    jwtSecret: process.env.jwtSecret || 'jwtTestSecret',
    emptyID: '507f1f77bcf86cd799439011'
}