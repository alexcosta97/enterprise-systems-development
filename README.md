# Enterprise Systems Develoment

## API Usage

### Sign-Up and login

Connect to the [API](https://three-sixty-rooms-bnu.herokuapp.com/)

1. `/api/auth/login`:
    * Provide email and password
    * Response is a JSON Web Token used to authenticate further requests

2. `/api/auth/signup`:
    * Provide name, email, phone and password
    * Response is a JSON Web Token used to authenticate further requests

### Place requests to server

Any requests other than GET require for a token to be sent in order to authenticate the user and make sure the user is only trying to modify resources that belong to them.

The Token is sent to the server by using the header `x-auth-token` along with the JSON Web Token received from the server when loging in the user.

### Access Server Resources

1. Users:
    * Get User: `/api/users/$USERID`: shows the details of a user minus their password
    * Update User: PUT `/api/users/` with authentication token: Updates the details of the user. The values that can be given to the server are:
        * name
        * email
        * password
        * phone
    * Delete User: DELETE `/api/users/` with authentication token: Deletes the user with the given authentication token

2. Properties:
    * Get properties: GET `/api/properties/`
    * Get Details for a single property: GET `/api/properties/$PROPERTYID`
    * Create Property: POST `/api/properties/` with auth token and with the folllowing values:
        * title: string, required
        * houseNumber: string, required
        * street: string, required
        * town: string, required
        * postCode: string, required
        * county: string
        * country: string
        * description: string
        * picture: Image file, sent as part of a multi-part form
    * Update a Property: PUT `/api/properties/$PROPERTYID` with the same values as to create a property
    * Delete a Property: DELETE `/api/properties/$PROPERTYID` using a authentication token

3. Floors:
    * Get floors: GET `/api/floors/` with optional query parameter `?property=$PROPERTYID`
    * Get Details for a single floor: GET `/api/floors/$FLOORID`
    * Create Floor: POST `/api/floors/` with auth token and with the folllowing values:
        * property: string, required -> The ID of the property the floor belongs to
        * level: string, required -> The name of the floor, or level
        * picture: Image file, sent as part of a multi-part form
    * Update a Floor: PUT `/api/floors/$FLOORID` with the same values as to create a floor
    * Delete a Floor: DELETE `/api/floors/$FLOORID` using a authentication token

4. Rooms:
    * Get Rooms: GET `/api/rooms/` with optional query parameter `?floor=$FLOORID`
    * Get Details for a single room: GET `/api/rooms/$ROOMID`
    * Create Room: POST `/api/rooms/` with auth token and with the folllowing values:
        * floor: string, required -> The ID of the floor the room belongs to
        * name: string, required -> The name of the room
        * pixelsXMin: number, required: -> the min x where the room is situated inside the pixel dimensions of the floor plan
        * pixelsXMax: number, required: -> the max x where the room is situated inside the pixel dimensions of the floor plan
        * pixelsY: number, required: -> the y where the room is situated inside the pixel dimensions of the floor plan
    * Update a Room: PUT `/api/rooms/$ROOMID` with the same values as to create a room
    * Delete a Room: DELETE `/api/rooms/$ROOMID` using a authentication token

5. 360 Pictures:
    * Get pictures: GET `/api/pictures/` with optional query parameter `?room=$ROOMID`
    * Get Details for a single picture: GET `/api/pictures/$PICTUREID`
    * Create Picture: POST `/api/pictures/` with auth token and with the folllowing values:
        * room: string, required -> The ID of the room the picture belongs to
        * picture: Image file, sent as part of a multi-part form
    * Update a Picture: PUT `/api/pictures/$PICTUREID` with the same values as to create a picture
    * Delete a Picture: DELETE `/api/pictures/$PICTUREID` using a authentication token