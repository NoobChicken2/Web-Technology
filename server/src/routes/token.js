import express from 'express';
const router = express.Router();

import {userBodyDetails} from "../middleware/util-middleware.js";
import {compareLoginDetails, secret} from "../middleware/authentication.js";

import jwt from 'jsonwebtoken';

router.post("/", userBodyDetails, compareLoginDetails, (req, res) => {
    let payload = req.body;
    payload.date = new Date();
    payload.roles = req.roles;

    jwt.sign(payload, secret, {algorithm: 'HS256'}, (err, result) => {
        if (err) {
            return res.status(500).json({error: 'Something went wrong with the token'})
        }
        return res.status(200).json({token: result});
    });
});

export default router;