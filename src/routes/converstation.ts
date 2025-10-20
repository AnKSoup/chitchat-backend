import { Router } from 'express';
import bcrypt from 'bcrypt';

import { SELECT } from "../utils/db/select.utils.js";
import { INSERT } from '../utils/db/insert.utils.js';
import { UPDATE } from '../utils/db/update.utils.js';
import { DELETE } from '../utils/db/delete.utils.js';

import { allowOnly, getUserID, isTokenOfID, prevents } from '../utils/validation.utils.js';

export const routeConversation = Router();

//Creates a new conversation:
routeConversation.post('/', (req, res) => {
    //Getting inputs:
    const body = req.body;

    //Body validation:
    if (!allowOnly(body, ['conversation_name', 'owner_id'])) {
        res.status(400).send({ message: "Body error." });
        return;
    }

    //Creates a decription key stored in the database:
    const conversation_decrypt_key = bcrypt.hashSync(`key:${body.owner_id}_${body.conversation_name}`, 10); // Non du coup..

    let conversation = {
        conversation_name: body.conversation_name,
        conversation_decrypt_key: conversation_decrypt_key,
        owner_id: body.owner_id,
    };
    //Query execution:
    //Responses: 
});

//Updates a conservation:
routeConversation.put('/', (req, res) => {
    //Getting inputs:
    //Body validation:
    //Code:
    //Query execution:
    //Responses: 
});
//Deletes a conservation:
routeConversation.delete('/', (req, res) => {
    //Getting inputs:
    //Body validation:
    //Code:
    //Query execution:
    //Responses: 
});
//Retrieves a conservation:
routeConversation.get('/', (req, res) => {
    //Getting inputs:
    //Body validation:
    //Code:
    //Query execution:
    //Responses: 
});
// //Retrieves conservations:
// routeConversation.get('/', (req, res) => {
//     //Getting inputs:
//     //Body validation:
//     //Code:
//     //Query execution:
//     //Responses: 
// });
