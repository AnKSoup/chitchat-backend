import { Router } from 'express';
import bcrypt from 'bcrypt';
import { SELECT } from "../utils/db/select.utils.js";
import { INSERT } from '../utils/db/insert.utils.js';
import { UPDATE } from '../utils/db/update.utils.js';
import { allowOnly, getUserID, isTokenOfID, prevents } from '../utils/validation.utils.js';
import { DELETE } from '../utils/db/delete.utils.js';

/*
TODO implements : Reset password:
1: Find user_id with user_email
2: Create temporary token like 'recovery_123456'
3: Send email : link of a page like recovery/ticket and code like numeric half of temporary token
4: call /user/change_pass/:id with user_token as recovery_yournumericalcode and new user_password
--------------------------------------------------------------------------------------------------
ENDPOINTS :
#1- Sign in:    POST    /user/                  REQ: {user_name, user_email, user_password}                         RES: {message}
#2- Log in:     POST    /user/login             REQ: {user_email, user_password}                                    RES: {message|user_token}
#3- Log out:    POST    /user/logout            REQ: {user_token}                                                   RES: {message}
#4- Get by id:  GET     /user/:id                                                                                   RES: {user_name|message}    
#5- Update:     PUT     /user/:id               REQ: {user_token, ..., !user_id, !user_password, !user_created_at}  RES: {message}
#6- Delete:     DELETE  /user/:id               REQ: {user_token}                                                   RES: {message}
#7- Get id:     GET     /user/get_id            REQ: {user_token}                                                   RES: {user_id|message}
#8- Get b name: GET     /user/search/:username                                                                      RES: {user_id, user_name|message}
#9- Chang pass: PUT     /user/change_pass/:id   REQ: {user_token, user_password}                                    RES: {message}
*/

export const routeUser = Router();

//Email validator from W3C:
const emailValidator = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//Checks if has at least 1 digit, 1 lowecase, 1 uppercase, 1 special char, no white spaces and between 8 and 20 chars.
const passwordValidator = /^(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9\W]{8,20}$/;

// For testing purposes: TO DELETE
routeUser.get('/', (req, res) => {
    res.send(SELECT(['*'], 'User'));
});

// #1- Sign in:
routeUser.post('/', (req, res) => {
    let user = req.body;

    // Checks for correct request! 
    if (!allowOnly(user, ['user_name', 'user_email', 'user_password'])) {
        res.status(400).send({ message: "Body error." });
        return;
    }

    //TODO : implement a real email validator
    if (!emailValidator.test(user.user_email)) {                                    //Checks if not email.
        res.status(400).send({ message: "Not an email." });
    }

    //Checks password 
    if (passwordValidator.test(user.user_password)) {                               //Checks if password is valid.
        user.user_password = bcrypt.hashSync(user.user_password, 12);               //Encripts password.
    } else {
        res.status(400).send({ message: "Password not matching requirements." });
    }

    //Tries to create a user: Try catch wouldnt detect an error for some reasons..
    const result = INSERT('User', user);

    if (result.includes("Error: stepping, UNIQUE constraint failed: User.user_email")) {
        res.status(400).send({ message: "Email already in use" });
    } else if (result.includes('Command failed')) {
        res.status(500).send({ message: "Something went wrong." });
    } else {
        res.status(201).send({ message: "User successfully created." });
    }
});

// #2- Log in:
routeUser.post('/login', (req, res) => {
    let body = req.body;

    // Checks for correct request! 
    if (!allowOnly(body, ['user_email', 'user_password'])) {
        res.status(400).send({ message: "Body error." });
        return;
    }

    try {
        const user = SELECT(['user_id', 'user_password'], 'User', [`user_email LIKE '${body.user_email}'`]);    //Gets user.

        if (bcrypt.compareSync(body.user_password, user.user_password)) {                                       //Checks if password is correct.

            const token = bcrypt.hashSync(`TOKEN:${user.user_id}_${body.user_email}`, 10);                      //Creates a user token, bycript is good enough for that

            UPDATE("User", { user_token: token }, [`user_id LIKE ${user.user_id}`]);                            //Stores the token in the database.

            res.status(200).send({ user_token: token });                                                        //Sends the token for the client to store.
        } else {
            res.status(400).send({ message: 'Invalid login.' });
        }
    } catch (error) {
        res.status(400).send({ message: 'No such users.' })
    }
});

// #3- Log out:
routeUser.post('/logout', (req, res) => {
    // Checks for correct request! 
    if (!allowOnly(req.body, ['user_token'])) {
        res.status(400).send({ message: "Body error." });
        return;
    }
    const user_id = getUserID(req.body.user_token);
    if (!user_id) {
        res.status(404).send({ message: "Couldn't log user out: user not found." });
        return;
    } else {
        //Deletes token:
        UPDATE("User", { user_token: null }, [`user_id LIKE ${user_id}`]);
        res.status(200).send({ message: 'User logged out.' });
    }
});

//#4- Get by id:
routeUser.get('/:id', (req, res) => {
    try {
        res.status(200).send(SELECT(['user_name'], 'User', [`user_id LIKE ${req.params.id}`]));
    } catch (error) {
        res.status(404).send({ message: "User not found." });
    }
});

//#5- Update user info by id with token verification :
routeUser.put('/:id', (req, res) => {
    const body = req.body;
    if (!body.user_token) {
        res.status(401).send({ message: "No tokens provided." });
        return;
    }

    if (prevents(body, ['user_id', 'user_password', 'user_created_at'])) {
        res.status(400).send({ message: "Body error." });
        return;
    }

    //Check if user has permission.
    if (!isTokenOfID(body.user_token, req.params.id)) {
        res.status(401).send({ message: "Unauthorized user." });
        return;
    } else {
        const result = UPDATE("User", body, [`user_id LIKE ${req.params.id}`]);
        if (result.includes('Error')) {
            res.status(404).send({ message: 'Error: Invalid field name.' });
        } else {
            res.status(201).send({ message: 'User updated.' });
        }
    }
});

//#6- Deletes user by id:
routeUser.delete('/:id', (req, res) => {
    const body = req.body;
    if (!allowOnly(body, ['user_token'])) {
        res.status(400).send({ message: "Provide only token." });
        return;
    }
    //Check if user has permission.
    if (!isTokenOfID(body.user_token, req.params.id)) {
        res.status(401).send({ message: "Unauthorized user." });
        return;
    } else {
        DELETE('User', [`user_id LIKE ${req.params.id}`]);
        res.status(200).send({ message: "User deleted." });
    }
});

//#7- GET ID with token:
routeUser.get('get_id', (req, res) => {
    const body = req.body;
    if (!allowOnly(body, ['user_token'])) {
        res.status(400).send({ message: "Provide only token." });
        return;
    }
    const user_id = getUserID(body.user_token);
    if (!user_id) {
        res.status(404).send({ message: "Invalid token." });
        return;
    } else {
        res.status(200).send({ user_id: user_id });
    }
});

//#8- GET user by name:
routeUser.get('/search/:username', (req, res) => {
    try {
        res.status(200).send(SELECT(['user_id, user_name'], 'User', [`user_name LIKE '%${req.params.username}%'`]));
    } catch (error) {
        res.status(404).send({ message: "User not found." });
    }
});

//#9- Change password:
routeUser.put('/change_pass/:id', (req, res) => {
    let body = req.body;
    if (!allowOnly(body, ['user_token', 'user_password'])) {
        res.status(400).send({ message: "Provide only token and new password." });
        return;
    }
    //Is user authorized
    if (!isTokenOfID(body.user_token, req.params.id)) {
        res.status(401).send({ message: "Unauthorized user." });
        return;
    }
    //Checks password
    try {
        const user_password = SELECT(['user_password'], 'User', [`user_id LIKE ${req.params.id}`]).user_password;
        //Are we the same?
        if (bcrypt.compareSync(body.user_password, user_password)) {
            res.status(400).send({ message: "Old and new passwords cannot be the same." });
            return;
        }
    } catch (error) {
        res.status(500).send({ message: "Something went wrong." });     //Just in case the select statement shits itself. This shouldn't occure?
        return;
    }
    if (passwordValidator.test(body.user_password)) {                   //Checks if password is valid.
        body.user_password = bcrypt.hashSync(body.user_password, 12);   //Encripts password.
    } else {
        res.status(400).send({ message: "Password not matching requirements." });
        return;
    }
    UPDATE("User", body, [`user_id LIKE ${req.params.id}`]);
    res.status(201).send({ message: 'Password changed.' });
});