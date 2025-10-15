import { Router } from 'express';
import { SELECT } from "../utils/db/select.utils.js";

export const routeUser = Router();

//GET User by id;
routeUser.get('/:id', (req, res) => {
    try {
        res.status(200).send(SELECT(['user_name'], 'User', [`user_id LIKE ${req.params.id}`]));
    } catch (error: any) {
        res.status(404).send("User not found.")
    }
});

//Search user by name:
routeUser.post('/search/:username', (req, res) => {
    try {
        res.status(200).send(SELECT(['user_id, user_name'], 'User', [`user_name LIKE '%${req.params.username}%'`]));
    } catch (error: any) {
        res.status(404).send("User not found.")
    }
});