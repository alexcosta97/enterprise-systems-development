var users = require('../controllers/users.server.controller');

module.exports = function(app){
    //Creating routes to create a user and retrieve all users
    app.route('/users').post(users.create).get(users.list);

    //Creating route to retrieve a single user by username
    app.route('/users/:username').get(users.read);
    app.param('username', users.userByUsername);
}