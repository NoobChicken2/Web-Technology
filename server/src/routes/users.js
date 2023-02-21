import express from 'express';
const router = express.Router();

import userData from '../data/users.js';
import bidsData from '../data/bids.js';
import auctionData from '../data/auctions.js';

import * as utilities from '../util/utilities.js';
import {findUserIdBids, numId, userBodyDetails, usernameExists} from '../middleware/util-middleware.js';
import {hashPassword, isLoggedIn} from '../middleware/authentication.js';


// GET routers
router.get ("/", (req, res) => {
    const {username} = req.query;

    if (username === undefined) {
        return res.status(200).json(userData);
    }

    if(utilities.isFound(userData,'username', username)) {
        return res.status(200).json(utilities.findData(userData,'username', username));
    }

    return res.status(404).json({error: `The user with the username ${username} was not found`});
});

router.get ("/:id", numId, (req, res) => {
    if (!utilities.isFound(userData,'id', req.idNum)) {
        return res.status(404).json({error: `The user with id ${req.idNum} could not be found!`});
    }

    return res.status(200).json(utilities.findData(userData, 'id' ,req.idNum));
});

router.get ("/:id/bids", numId, findUserIdBids, (req, res) => {
    return res.status(200).json(req.foundUserId);
});

// POST routers
router.post ("/", userBodyDetails, usernameExists, hashPassword, (req, res) => {
    let newUser;

    newUser  = {
        id: utilities.incrementIdNum(userData, 'id'),
        username: req.body.username,
        password: req.password,
        roles: ['user']
    }
    userData.push(newUser);

    return res.status(201).json({id: newUser.id, username: newUser.username} );
});

// PUT routers
router.patch ("/:id", numId, usernameExists, hashPassword, isLoggedIn, (req, res) => {
    const limit = 1;
    utilities.bodyLimit(limit, req, res);

    if(!('username' in req.body || 'password' in req.body)) {
        return res.status(400).json({error: 'The requested body does not have the required parameters'});
    }

    if (req.body.password !== undefined) {
        Object.assign(utilities.findData(userData, 'id', req.idNum)[0], {password: req.password});
    } else {
        Object.assign(utilities.findData(userData, 'id', req.idNum)[0], {username: req.body.username});
    }

    return res.status(200).json({error: 'The user details were updated'});
});

// DELETE routers
router.delete ("/:id", numId, isLoggedIn, (req, res) => {
    //Deletes the user
    utilities.deleteById(userData, 'id', req.idNum);

    //Deletes his bids
    while (utilities.isFound(bidsData, 'userId', req.idNum)) {
        utilities.deleteById(bidsData, 'userId', req.idNum);
    }

    //Deletes his auctions
    while (utilities.isFound(auctionData, 'userId', req.idNum)) {
        utilities.deleteById(auctionData, 'userId' , req.idNum);
    }

    return res.status(200).json({result: 'The entry was deleted correctly'});
});

export default router;