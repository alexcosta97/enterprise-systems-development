module.exports = {
    //Development configuration options
    db: process.env.MONGOURI || 'mongodb://localhost:27017/360-rooms',
    sessionSecret: process.env.sessionSecret || 'developmentSessionSecret',
    jwtSecret: process.env.jwtSecret || 'jwtDevSecret',
    awsAccessKeyID: process.env.awsAccessKeyID || 'your AWS Access Key ID Here',
    awsSecretAccessKey: process.env.awsSecretAccessKey || 'your AWS Access Key Here'
}