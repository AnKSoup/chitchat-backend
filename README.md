## DATABASE :
(Homemade framework..)

# Set up:
Using **sqlite3** with **sqlcipher** encryption.
Tables go in ./db/tables.

run ./db/help to get a list of available scripts :
 CREATE    TABLES    ./db/scripts/create
   DROP    TABLES    ./db/scripts/drop    (-a / -t TABLE TABLE...)
  RESET    TABLES    ./db/scripts/reset   (-a / -t TABLE TABLE...)
   LIST    TABLES    ./db/scripts/list    ("" / -sa / -s TABLE TABLE...)
-----------------------------------------
ENCRYPT   DATABASE   ./db/scripts/encrypt
WARNING: Will disable the other scripts from working.

# Communicate with db:
*dbQuery(string: string)* from */utils/db/connect.utils.ts*: 
  Executes a query, returns a string.

*INSERT(table: string, object: Object)* from */utils/db/insert.utils.ts*:
  INSERTs a JSON object in a given table with sql injection prevention.

*SELECT(columns: Array<string>, table: string, conditions?: Array<string>, limit?: number)* from */utils/db/select.utils.ts*:
  Executes a SELECT query with sql injection prevention and returns a JSON: 
    Examples: 
      - *SELECT(['*'], 'User')* => SELECT * FROM User;
      - *SELECT(['*'], 'User', undefined, 3)* => SELECT * FROM User LIMIT 3;
      - *SELECT(['user_id','user_name'], 'User', ['user_id > 1',"user_name LIKE '%Jean%'", 2])* => SELECT user_id, user_name FROM User WHERE user_id > 1 AND user_name LIKE '%Jean%' LIMIT 2;

*UPDATE(table: string, object: Object, conditions: Array<string>)* from */utils/db/update.utils.ts*:
  UPDATEs a JSON object in a given table with conditions and sql injection prevention.

*DELETE(table: string, conditions: Array<string>)* from */utils/db/delete.utils.ts*:
  DELETEs rows from table with conditions and sql injection prevention.

# Preventing sql injections:
*isOnlyWord(word: string, string: string)* from */utils/validation.utils.ts*:
  Returns true if word matches string and no other query words present.
*isOnlyFirstWord(string: string)* from */utils/validation.utils.ts* :
  Same thing but first word is auto detected.
[**WARNING**: isOnlyWord() and isOnlyFirstWord() not being used => delete?]

*isOnlyQuery(string: string)* from */utils/validation.utils.ts*:
  Returns true if only one query executed.

# Formating utilities:
*jsonifySelect(string: string)* from */utils/json.utils.ts*: 
  Takes in a string and returns a JSON object (SELECT queries only).
*betterStrings(array: Array<any>)* from */utils/json.utils.ts*:
  Takes in an array and returns the same array with its strings encapsulated in single quotation marks.