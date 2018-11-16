# Enterprise Systems Develoment

## Setting up the development environment
In order to set up the development environment, you need to set the variable in the Operating System prior to running the application.

You have two options to set the environment: either `development` or `production`.

For Windows-based systems, you need to use the following command:
`set NODE_ENV=development`

For Unix-based systems, you need to use the following command:
`export NODE_ENV=development`

## Running the application
In order to run the application, you need to start the application with the following command:
`node server`

The server then starts the service and Express awaits requests being sent to it.
The express server listens to port 3000.

In order to connect to the server, you can use following URL: `http://localhost:3000/`.

## Adding Controllers
To add controllers, you export the method that deals with the request sent to the server and set up the code to deal with the request and set the response.

See Express documentation for the different methods to deal with requests and prepare the response.

Example:
```javascript
exports.render = function(req, res){
    res.send('Answer');
}
```

## Adding Routes
To add routes, you need to export the module that sets the routes for the controller. When initializing the routes module, you require the controller so that you can access its methods more easily. Example:
```javascript
module.exports = function(app){
    var contollerName = require('pathToController');
    //Here set the request type that you're setting the route for and the controller method that is assigned to it
    app.route('/').get(controllerName.method);
}
```

## Creating Mongoose Schemas and Models
Schemas and models go inside the `app/models` folder.

To create a model for the database, you first need to set a schema with Mongoose. Here's an example of a schema for a user database:
```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String
});
```

When setting up a schema, we initialize a Schema object and assign to it the name of the variables contained in the model and the data type. For more data types and information about schemas, see the Mongoose documentation.

After the schema is set, we need to create a model using the schema that has just been created using the `model` method from Mongoose:
```javascript
mongoose.model('User', UserSchema);
```
In this method, we set the name for the model and assign a schema to it. When requesting the model, we have to use the model method again, this time only using the name of the model we want to use as an argument.

Before being able to use the model, we first need to add the model file to mongoose, so that the model is loaded for the other modules of the application as well.
```javascript
module.exports = function(){
    var db = mongoose.connect(config.db, {useNewUrlParser:true});
    require('../app/models/modelFileName');
    return db;
}
```

After the model has been loaded into Mongoose, we can use it for controllers by requiring it with the Mongoose `model` method, as in the following example:
```javascript
var User = require('mongoose').model('User');
```