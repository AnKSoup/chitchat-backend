# DEPENDENCIES :
Node v25.3.0
libcrypto 1.1
sqlite3 v3.50.4
sqlcipher v3.46.1

# OVERALL SET UP
Setting up the project :

  $ ./init.sh
   => And follow the instruction given!
    
**OPTIONAL : TESTING**

  $ npm run test 
    => This will test every endpoints to ensure the server works.

# DATABASE :

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

This project uses internal messages and responses formatted as objects that each "operations" return.
=> Helps checking for success and easier response for the API.

Here is the following template:

**IRO CTOR** : {
success: boolean,
title: string,
status: number,
detail: string,
content?: object
}

# ROUTES

## ENDPOINTS:
USERS:
#1-   Sign in:        POST    /user/                                      REQ: {"user_name","user_email","user_password"}                                 RES : IRO + {"rowid"}
#2-   Log in:         POST    /user/login                                 REQ: {"user_email","user_password"}                                             RES : IRO + {"user_token"}
#3-   Log out:        POST    /user/logout                                REQ: {"user_token"}                                                             RES : IRO 
#4-   Get by id:      GET     /user/:id                                                                                                                   RES : IRO + {"user_id","user_name"}
#5-   Update:         PUT     /user/:id                                   REQ: {"user_token", ..., "!user_id", "!user_password", "!user_created_at"}      RES : IRO
#6-   Delete:         DELETE  /user/:id                                   REQ: {"user_token"}                                                             RES : IRO + {"rowid"}
#7-   Get id:         POST    /user/get_id                                REQ: {"user_token"}                                                             RES : IRO + [{"user_id"}]
#8-   Get my info:    POST    /user/:id                                   REQ: {"user_token"}                                                             RES : IRO + [{"user_name","user_email","user_created_at}]
#9-   Get by name:    GET     /user/search/:username                                                                                                      RES : IRO + [{"user_id","user_name"}]
#10-  Chang pass:     PUT     /user/change_pass/:id                       REQ: {"user_token","user_password"}                                             RES : IRO 

#1- Get conv:         GET     /conversation/:id                                                                                                           RES : IRO + [{"conversation_id","conversation_name","conversation_created_at","owner_id"}]
#2- Create conv:      POST    /conversation/                              REQ: {"conversation_name","owner_id"}                                           RES : IRO + {"key","iv","rowid"}
#3- Update conv:      PUT     /conversation/:id                           REQ: {"user_token", ...,  "!conversation_id", "!conversation_created_at"}       RES : IRO
#4- Delete conv:      DELETE  /conversation/:id                           REQ: {"user_token"}                                                             RES : IRO
#5- All members:      GET     /conversation/members_of/:conversation_id                                                                                   RES : IRO + [{"user_id","user_name"}]

GROUP MEMBERS:
#1- Join Chat:        POST    /group_member/                              REQ: {"user_token","user_id","conversation_id","decrypt_key","decrypt_iv"}      RES : IRO + {"rowid"}
#2- Rejoin Chat:      PUT     /group_member/rejoin/:conversation_id       REQ: {"user_token","user_id","decrypt_key","decrypt_iv"}                        RES : IRO 
#3- Leave chat:       PUT     /group_member/leave/:conversation_id        REQ: {"user_token","user_id"}                                                   RES : IRO 
#4- All conv:         GET     /group_member/conversation_of/:user_id                                                                                      RES : IRO + [{"conversation_id","conversation_name"}]
#5- Get key/iv        POST    /group_member/key_iv_of/                    REQ: {"user_id","conversation_id"}                                              RES : IRO + [{"decrypt_key","decrypt_iv"}]

MESSAGES:
#1- Get all messages: POST    /message/get/:conversation_id               REQ: {"user_token","user_id","message_count","message_offset"}                  RES : IRO + [{"message_id","message_content","message_tag","message_sent_at","message_modified_at","in_response_to","user_id","user_name"}]
#2- Write message:    POST    /message/:conversation_id                   REQ: {"user_token","user_id","message_content","message_tag","in_response_to"}  RES : IRO + {"rowid"}
#3- Edit message:     PUT     /message/:conversation_id                   REQ: {"user_token","user_id","message_id","message_content","message_tag"}      RES : IRO
#4- Delete message:   DELETE  /message/:conversation_id                   REQ: {"user_token","user_id","message_id"}                                      RES : IRO

BLOGS:
#1- Get a blog:       GET     /blog/:blog_id                                                                                                              RES : IRO + [{"blog_id","blog_content","blog_modified_at"}]
#2- Create a blog:    POST    /blog/:blog_id                              REQ: {"user_token"}                                                             RES : IRO + {"rowid"}
#3- Edit a blog:      PUT     /blog/:blog_id                              REQ: {"user_token","blog_content"}                                              RES : IRO 

COMMENTS:
#1- comm from id:     GET     /comment/:comment_id                                                                                                        RES : IRO + [{"comment_id","comment_content","comment_created_at","comment_modified_at","in_response_to","user_id","blog_id"}]
#2- comms from blog:  POST    /comment/of/:blog_id                        REQ: {"limit","offset"}                                                         RES : IRO + [{"comment_id","comment_content","comment_created_at","comment_modified_at","in_response_to","user_id","blog_id","user_name"}]
#3- Write a comment:  POST    /comment/:blog_id                           REQ: {"user_id","user_token","comment_content","in_response_to"}                RES : IRO + {"rowid"}
#4- Edit a comment:   PUT     /comment/:comment_id                        REQ: {"user_id","user_token","comment_content"}                                 RES : IRO
#5- Delete a comm:    DELETE  /comment/:comment_id                        REQ: {"user_id","user_token","blog_id"}                                         RES : IRO

ENCRYPTION:
#1- Generate keys:    GET     /encryption/key_pairs                                                                                                       RES : IRO + {"publicKey","privateKey"}

# Services :

## DB

- _src/services/db/queries.service.ts_
  Handles connection and basic CRUD operation with the database.

  **dbOpen()**: Returns a connection to the database.
  _async_ **dbUnlock()**: Returns a Promise, attempts to log in the database using the pragma key.
  _async_ **dbRun()**: Returns a Promise, attempts to execute a prepared "run" statement in the db.
  _async_ **dbRun()**: Returns a Promise, attempts to execute a prepared "all" statement in the db.

  Basic CRUD:
  _async_ **dbSelect()**: Returns a Promise, attempts to retrieve data from the db.
  _async_ **dbSelectJoin()**: Returns a Promise, attempts to retrieve data from the db with inner join.
  _async_ **dbInsert()**: Returns a Promise, attempts to insert data into the db.
  _async_ **dbUpdate()**: Returns a Promise, attempts to update data from the db.
  _async_ **dbDelete()**: Returns a Promise, attempts to delete data from the db.

- _src/services/db/safe\_queries.service.ts_
  Try catches queries and return iros for easier implementation.
  _async_ **getItems()**: Returns an IRO, calls dbSelect().
  _async_ **getItemsJoin()**: Returns an IRO, calls dbSelectJoin().
  _async_ **createItem()**: Returns an IRO, calls dbInsert().
  _async_ **updateItem()**: Returns an IRO, calls dbUpdate().
  _async_ **deleteItem()**: Returns an IRO, calls dbDelete().

  **itemsToArray()**: Returns the array from a getItems(). 

- _src/services/db/user.service.ts_
  Handles communication with user table implementing the logic needed.

  Basic CRUD: UNCHANGED BECAUSE OF COMPATIBILITY => TO CHANGE IN THE FUTURE 
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

- _src/services/db/conversation.service.ts_
  Handles communication with conversation table implementing the logic needed.

  Basic CRUD:
  _async_ **getConversation()**: Returns an IRO : "R".
  _async_ **createConversation()**: Returns an IRO : "C".
  _async_ **updateConversation()**: Returns an IRO : "U".
  _async_ **deleteConversation()**: Returns an IRO : "D".

  Logic:
  _async_ **getOwnerId()**: Returns an IRO : Retrieves the owner id.
  _async_ **getAllMembers()**: Returns an IRO : Gets all the members of a conversation.

- _src/services/db/group\_member.service.ts_
  Handles communication with group_member table implementing the logic needed.

  NOTE TO SELF: Why naming them "Chats" => change them to conversation later.
  _async_ **joinChat()**: Returns an IRO : Attempts to join a chat.
  _async_ **rejoinChat()**: Returns an IRO : Attempts to rejoin a chat. Needed if user already left once.
  _async_ **leaveChat()**: Returns an IRO : Attempts to leave a chat.

  _async_ **isSafeToCreate()**: Returns an IRO : Checks if member exists and if not is safe to create.
  _async_ **isMemberInConv()**: Returns an IRO : Checks if a member is in a chat.

  _async_ **getAllConvsOfUser()**: Returns an IRO : Gets all the conversation of a user.

  - _src/services/db/message.service.ts_
  Handles communication with message table implementing the logic needed.

  Basic CRUD:
  _async_ **getMessagesFromConv()**: Returns an IRO : "R". Within a given range.
  _async_ **createMessage()**: Returns an IRO : "C".
  _async_ **editMessage()**: Returns an IRO : "U".
  _async_ **deleteMessage()**: Returns an IRO : "D".

  Logic:
  _async_ **isMessageOfId()**: Returns an IRO : Checks if the message belongs to a certain user.
  _async_ **isMessageInConv()**: Returns an IRO : Checks if a message belongs to a certain conv.

  - _src/services/db/blog.service.ts_  
  Handles communication with blog table.
  
  Basic CRUD:
  _async_ **getBlog()**: Returns an IRO : "R". 
  _async_ **createBlog()**: Returns an IRO : "C".
  _async_ **updateBlog()**: Returns an IRO : "U".

  - _src/services/db/comment.service.ts_
  Handles communication with comment table implementing the logic needed.

  Basic CRUD:
  _async_ **getCommentById()**: Returns an IRO : "R". Within a given range.

  _async_ **getComments()**: Returns an IRO : "R". Within a given range.
  _async_ **writeComment()**: Returns an IRO : "C".
  _async_ **editComment()**: Returns an IRO : "U".
  _async_ **deleteComment()**: Returns an IRO : "D".

  Logic:
  _async_ **isCommentOfUser()**: Returns an IRO : Checks if the comment belongs to a certain user.
  _async_ **isCommentOfBlog()**: Returns an IRO : Checks if a comment belongs to a certain blog.

## Encryption

- _src/services/encryption/bcrypt.service.ts_
  Handles bcrypt operations:

  **encryptPassword()**: Returns a hashed password as a string.
  **isPasswordCorrect()**: Returns a bool : compares a string to an hashed password.
  _async_ **validateUserPassword()**: Returns an IRO : Attempts to validate a password.

- _src/services/encryption/conversation\_encryption.service.ts_
  Handles the logic for hybrid encryption: 
  Everything is stored and shared as base64 strings.

  TODO : MOVE THIS LOGIC TO CLIENT FOR BETTER SECURITY

  SYMMETRIC LOGIC:
  **createKeyAndIV()**: Returns an IRO : Creates an unencrypted key and iv for a conversation.
  **encryptMessage()**: Returns an IRO : Encrypts a message and gives it a tag.
  **decryptMessage()**: Returns an IRO : Decrypts a message.

  ASYMMETRIC LOGIC:
  **createPair()**: Returns an IRO : Creates a pair of keys.
  **encryptKey()**: Returns an IRO : Encrypts a symmetric key. Use this for iv also.
  **decryptKey()**: Returns an IRO : Decrypts a symmetric key. Use this for iv also.

## Validation

- _src/services/validation/credentials.service.ts_
  Validates existence of items:

  _async_ **doesItemExist()**: Returns an IRO : Checks if an item exists.
  _async_ **doesUserExist()**: Returns an IRO : Checks if a user exists.
  _async_ **doesConvExist()**: Returns an IRO : Checks if a conversation exists.
  _async_ **doesCommentExist()**: Returns an IRO : Checks if a comment exists.

- _src/services/validation/credentials.service.ts_
  Validates credential:

  **isEmailValid()**: Returns an IRO : validates an email with regex.
  **isPasswordValid()**: Returns an IRO : validates a password with regex.

- _src/services/validation/operations.service.ts_
  Easily validate any operation that returns an IRO:

  **operationToResponse()**: Formats an IRO and sends it through the API as a response.
  **validateOperation()**: Does the same but returns true if it fails : so the endpoint can check for a fail easily and return.
  **onlyValidate()** : onlyValidates for success without sending a response to prevent errors when checking for multiples operations

- _src/services/validation/params.service.ts_
  Validates params sent to the API:

  **allowOnly()**: Returns an IRO : allows only defined params.
  **prevents()**: Returns an IRO : prevents defined params.
  **isPresent()**: Returns an IRO : succeeds if defined params are found.
  **isNotNull()**: Returns an IRO : succeeds if defined params are not null.

## Token

- _src/services/tokens.service.ts_
  Handles token logic:

  **createToken()**: Returns a generated token as string.
  _async_ **isTokenValid()**: Returns an IRO : Checks if the token exists in the db.
  **isTokenOfUser()**: Returns an IRO : Tells if the id matches the given token.
  _async_ **isTokenOfOWner()**: Returns an IRO : Tells if the token matches the token of a conversation owner.

# Utils :

## Responses

- _src/utils/responses.utils.ts_
  Handles IRO logic:

  **iro()**: IRO CTOR.

  **getProperty()**: Retrieves a defined property.
  **getSuccess()**: Returns bool : Easy check for success.
  **getStatus()**: Returns number : Easy check for status.

# TESTING :

- _src/tests/endpoints_validator_
  
This file contains various .js scripts to test endpoints.

- _assets/data.js_
  Stores the testing values.
  
- _assets/api_caller.js_
  Exports the call() function to call and fetch data from endpoints 
  
- _assets/result_formatter.js_
  Calls each function from the routes and formats the response sent to :
  
- _/endpoints_tester.js_
  Which then writes it in the result.txt file upon completion.
  
# TODO :

This section serves as a form of planning for the futur of this project :
  
  - Fix endpoints sending arrays of object where only one object is present.
  - Rework the password changer
