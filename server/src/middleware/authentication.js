import bcrypt from 'bcrypt';
import * as utilities from '../util/utilities.js';
import {isFound} from '../util/utilities.js';

import userData from '../data/users.js';

import jwt from 'jsonwebtoken';

export let secret = 'Thisismysecret';

export function hashPassword (req, res, next) {
    if (req.body.password === undefined) {
        return next();
    }

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({error: 'The hash function had an error!'});
        }

        req.password = hash;
        return next();
    });
}

export function compareLoginDetails (req, res, next) {
    if(!isFound(userData, 'username', req.body.username)) {
        return res.status(404).json({error: 'The username could not be found'});
    }

    let foundUser = utilities.findData(userData, 'username', req.body.username);
    req.roles = foundUser[0].roles;

    bcrypt.compare(req.body.password, foundUser[0].password, (err, result) => {
        if (err) {
            return res.status(500).json({error: 'An error occurred while comparing passwords'});
        }

        if (result) {
            return next();
        } else {
            return res.status(404).json({error: 'The password does not match!'});
        }
    });
}

export function isLoggedIn (req, res, next) {
    let token = req.get('Authorization');

    if (!token) {
        return res.status(401).json({error: 'You are not logged in'})
    }

    token = token.split(" ");
    req.token = token[1];

    jwt.verify(req.token, secret, {algorithm: 'HS256'}, (err) => {
        if (err) {
            return res.status(401).json({error: 'The token is not valid'})
        } else {
            req.user = jwt.decode(req.token, secret);
            return next();
        }
    });
}