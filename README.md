# DATABASE :

(Homemade framework..)

## Set up:

Using **sqlite3** with **sqlcipher** encryption.
Tables go in ./db/tables.

run ./db/help to get a list of available scripts :
CREATE TABLES **_./db/scripts/create_**<br />
DROP TABLES **_./db/scripts/drop_** (-a / -t TABLE TABLE...)<br />
RESET TABLES **_./db/scripts/reset_** (-a / -t TABLE TABLE...)<br />
LIST TABLES **_./db/scripts/list_** ("" / -sa / -s TABLE TABLE...)

ENCRYPT DATABASE **_./db/scripts/encrypt_**
WARNING: Will disable the other scripts from working.

# Internal Response Object (IRO).

This project uses internal messages and responses formated as objects that each "operations" return.
=> Helps checking for success and easier response for the API.

Here is the following template:

**IRO CTOR** : {
success: boolean,
title: string,
status: number,
detail: string,
content?: object
}

(Internal messages where removed to use the api response template for easier retuns).

# ROUTES

## /user/

**user.ts** from _src/routes/user.ts_

### ENDPOINTS:

**POST** */user/* REQ: {user_name, user_email, user_password}<br />
**POST** */user/login* REQ: {user_email, user_password} RES: user_token<br />
**POST** */user/logout* REQ: {user_token} <br />
<!-- **GET** */user/:id* RES: user_name<br /> -->
**PUT** */user/:id* REQ: {user_token, ..., !user_id, !user_password, !user_created_at}<br />
**DELETE** */user/:id* REQ: {user_token} <br />
**GET** */user/get_id* REQ: {user_token} user_id<br />
**GET** */user/search/:username* RES: {user_id, user_name}<br />
**PUT** */user/change_pass/:id* REQ: {user_token, user_password} <br />

# Services :

## DB

- _src/services/db/queries.service.ts_
  Handles connection and basic CRUD operation with the database.

  **dbOpen()**: Returns a connection to the database.
  _async_ **dbUnlock()**: Returns a Promise, attempts to log in the database using the pragma key.
  _async_ **dbRun()**: Returns a Promise, attempts to execute a prepared "run" statement in the db.

  Basic CRUD:
  _async_ **dbSelect()**: Returns a Promise, attemps to retrieve data from the db.
  _async_ **dbInsert()**: Returns a Promise, attemps to insert data into the db.
  _async_ **dbUpdate()**: Returns a Promise, attemps to update data from the db.
  _async_ **dbDelete()**: Returns a Promise, attemps to delete data from the db.

- _src/services/db/user.service.ts_
  Handles communication with user table implementing the logic needed.

  Basic CRUD:
  _async_ **getUser()**: Returns an "Internal Response Object" : "R".
  _async_ **createUser()**: Returns an IRO : "C".
  _async_ **updateUser()**: Returns an IRO : "U".
  _async_ **deleteUser()**: Returns an IRO : "D".

  Data Utils:
  **usersToArray()**: Returns an Array of Objects: to easily use the content from an IRO retrieved by getUser().
  _async_ **emailToPassword()**: Returns an IRO : With corresponding password in content. Also helps checking if a user exists with its email.
  _async_ **idToPassword()**: Returns an IRO : With corresponding password in content.

  Logic:
  _async_ **signinUser()**: Returns an IRO : Attempts to sign a user in.
  _async_ **loginUser()**: Returns an IRO : Attempts to log a user in.
  _async_ **logoutUser()**: Returns an IRO : Attempts to log a user out.

  _async_ **getUserByName()**: Returns an IRO : Attempts to retrieve user(s).
  _async_ **editUser()**: Returns an IRO : Attempts to edit a user.
  _async_ **removeUser()**: Returns an IRO : Attempts to remove a user.

  _async_ **updatePassword()**: Returns an IRO : Updates a user password.
  _async_ **changeUserPassword()**: Returns an IRO : Attempts to change a user password with checks.

## Encryption

- _src/services/encrytption/bcrypt.service.ts_
  Handles bcrypt operations:

  **encryptPassword()**: Rertunrs a hashed password as a string.
  **isPasswordCorrect()**: Returns a bool : compares a string to an hashed password.
  _async_ **validateUserPassword()**: Returns an IRO : Attempts to validate a password.

## Validation

- _src/services/validation/credentials.service.ts_
  Validates credential:

  **isEmailValid()**: Returns an IRO : validates an email with regex.
  **isPasswordValid()**: Returns an IRO : validates a password with regex.

- _src/services/validation/operations.service.ts_
  Easily validate any operation that returns an IRO:

  **opertationToResponse()**: Formats an IRO and sends it throught the API as a response.
  **validateOperation()**: Does the same but returns true if it fails : so the endpoint can check for a fail easily and return.

- _src/services/validation/params.service.ts_
  Validates params sent to the API:

  **allowOnly()**: Returns an IRO : allows only defined params.
  **prevents()**: Returns an IRO : prevents defined params.
  **isPresent()**: Returns an IRO : succeeds if defined params are found.

## Token

- _src/services/tokens.service.ts_
  Handles token logic:

  **createToken()**: Returns a generated token as string.
  _async_ **isTokenValid()**: Returns an IRO : Checks if the token exists in the db. 
  **isTokenOfUser()**: Returns an IRO : Tells if the id matches the one of the given token.

# Utils :

## Responses

- _src/utils/responses.utils.ts_
  Handles IRO logic:

  **iro()**: IRO CTOR.

  **getProperty()**: Retrieves a defined property.
  **getSuccess()**: Returns bool : Easy check for success.
  **getStatus()**: Returns number : Easy check for status.

