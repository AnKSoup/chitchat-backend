# DATABASE :
(Homemade framework..)

## Set up:
Using **sqlite3** with **sqlcipher** encryption.
Tables go in ./db/tables.

run ./db/help to get a list of available scripts :
 CREATE    TABLES    ***./db/scripts/create***<br />
   DROP    TABLES    ***./db/scripts/drop***    (-a / -t TABLE TABLE...)<br />
  RESET    TABLES    ***./db/scripts/reset***   (-a / -t TABLE TABLE...)<br />
   LIST    TABLES    ***./db/scripts/list***    ("" / -sa / -s TABLE TABLE...)

ENCRYPT   DATABASE   ***./db/scripts/encrypt***
WARNING: Will disable the other scripts from working.

## Communicate with db:
***dbQuery(string: string)*** from */src/utils/db/connect.utils.ts*:<br />
  Executes a query, returns a string.

***INSERT(table: string, object: Object)*** from */src/utils/db/insert.utils.ts*:<br />
  INSERTs a JSON object in a given table with sql injection prevention.

***SELECT(columns: Array<string>, table: string, conditions?: Array<string>, limit?: number)*** from */src/utils/db/select.utils.ts*:<br />
  Executes a SELECT query with sql injection prevention and returns a JSON: <br />
    Examples: <br />
      - *SELECT(['\*'], 'User')* => SELECT * FROM User;<br />
      - *SELECT(['\*'], 'User', undefined, 3)* => SELECT * FROM User LIMIT 3;<br />
      - *SELECT(['user_id','user_name'], 'User', ['user_id > 1',"user_name LIKE '%Jean%'", 2])* => SELECT user_id, user_name FROM User WHERE user_id > 1 AND <br />user_name LIKE '%Jean%' LIMIT 2;

***UPDATE(table: string, object: Object, conditions: Array<string>)*** from */src/utils/db/update.utils.ts*:<br />
  UPDATEs a JSON object in a given table with conditions and sql injection prevention.

***DELETE(table: string, conditions: Array<string>)*** from */src/utils/db/delete.utils.ts*:<br />
  DELETEs rows from table with conditions and sql injection prevention.

## Preventing sql injections:
***isOnlyWord(word: string, string: string)*** from */src/utils/validation.utils.ts*:<br />
  Returns true if word matches string and no other query words present.<br />
***isOnlyFirstWord(string: string)*** from */src/utils/validation.utils.ts* :<br />
  Same thing but first word is auto detected.<br />
[**WARNING**: isOnlyWord() and isOnlyFirstWord() not being used => delete?]

***isOnlyQuery(string: string)*** from */src/utils/validation.utils.ts*:<br />
  Returns true if only one query executed.

# ROUTES

## /user/
**user.ts** from *src/routes/user.ts*

### ENDPOINTS:
**POST**    */user/*                  REQ: {user_name, user_email, user_password}                         RES: {message}<br />
**POST**    */user/login*             REQ: {user_email, user_password}                                    RES: {message|user_token}<br />
**POST**    */user/logout*            REQ: {user_token}                                                   RES: {message}<br />
**GET**     */user/:id*                                                                                   RES: {user_name|message}<br /> 
**PUT**     */user/:id*               REQ: {user_token, ..., !user_id, !user_password, !user_created_at}  RES: {message}<br />
**DELETE**  */user/:id*               REQ: {user_token}                                                   RES: {message}<br />
**GET**     */user/get_id*            REQ: {user_token}                                                   RES: {user_id|message}<br />
**GET**     */user/search/:username*                                                                      RES: {user_id, user_name|message}<br />
**PUT**     */user/change_pass/:id*   REQ: {user_token, user_password}                                    RES: {message}<br />

# Additional tools: 

## Formating utilities:
***jsonifySelect(string: string)*** from */src/utils/json.utils.ts*: <br />
  Takes in a string and returns a JSON object (SELECT queries only).<br />
***betterStrings(array: Array<any>)*** from */src/utils/json.utils.ts*:<br />
  Takes in an array and returns the same array with its strings encapsulated in single quotation marks.

***escapeChar(char: string, string: string)*** from */src/utils/bash.utils.ts*<br />
  Escapes a char, only used with '$' right now.

## Allowing/ Rejecting body keys:
***allowOnly(object: Object, array: Array<string>)*** from *src/utils/validation.utils.ts*:<br />
  Returns false if finds an unwanted key in a given object.<br />
***prevents(object: Object, array: Array<string>)*** from *src/utils/validation.utils.ts*:<br />
  Returns true if finds unwanted keys in a given object. 

## Validating tokens:
***getUserID(token: string)*** from *src/utils/validation.utils.ts*:<br />
  Returns user_id or undefined.<br />
***function isTokenValid(token: string)*** from *src/utils/validation.utils.ts*:<br />
  Returns true if given token is in the db.<br />
***function isTokenOfID(token: string, id: any)*** from *src/utils/validation.utils.ts*:<br />
  Returns true if given token is equal to the token of the given id. 