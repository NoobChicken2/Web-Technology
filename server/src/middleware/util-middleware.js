import * as utilities from '../util/utilities.js';

import auctionData from '../data/auctions.js';
import bidsData from '../data/bids.js';
import userData from '../data/users.js';

// Universal middleware
export function numId (req, res, next) {
    const idNum = Number.parseInt(req.params.id);

    if(isNaN(idNum)) {
        return res.status(400).json({error: 'The ID provided is not a number'});
    }

    req.idNum = idNum;
    return next();
}

export function bodyId(req, res, next) {
    if ('id' in req.body || 'auctionId' in req.body || 'userId' in req.body) {
        return res.status(400).json({error: 'Id\'s cannot be part of a body'});
    }

    return next();
}

export function userBodyDetails (req, res ,next) {
    const limit = 2;
    utilities.bodyLimit(limit, req, res);

    if(!('username' in req.body && 'password' in req.body)) {
        return res.status(400).json({error: 'The requested body does not have the required parameters'});
    }

    return next();
}

// Auction middleware
export function findIdAuction(req, res, next) {
    req.found = utilities.findData(auctionData,'id', req.idNum)[0];

    if(!utilities.isFound(auctionData, 'id', req.idNum)) {
        return res.status(404).json({error: `The auction with ID ${req.idNum} was not found`});
    }

    return next();
}

export function isAuctionDataEmpty(req, res, next) {
    if (auctionData.length === 0) {
        //Returns empty (array) object
        return res.status(200).json([]);
    }

    return next();
}

// Bids middleware
export function numAuctionId (req, res, next) {
    const idNum = Number.parseInt(req.params.auctionId);

    if(isNaN(idNum)) {
        return res.status(404).json({error: `The auction with ID ${req.idNum} was not found`});
    }

    req.auctionIdNum = idNum;
    return next();
}

export function findAuctionIdBids(req, res, next) {
    req.foundAuctionId = utilities.findData(bidsData,'auctionId', req.auctionIdNum);

    if(!utilities.isFound(bidsData,'auctionId', req.auctionIdNum)) {
        //Returns empty (array) object
        return res.status(200).json([]);
    }

    return next();
}

export function findIdBids(req, res, next) {
    req.foundBidsId = utilities.findData(req.foundAuctionId,'id', req.idNum)[0];

    if(!utilities.isFound(req.foundAuctionId,'id', req.idNum)) {
        //Returns empty (array) object
        return res.status(200).json([]);
    }

    return next();
}

// User middleware
export function findUserIdBids(req, res, next) {
    req.foundUserId = utilities.findData(bidsData, 'userId', req.idNum)[0];

    if(!utilities.isFound(bidsData,'userId', req.idNum)) {
        return res.status(404).json({error: `The user with ID ${req.idNum} provided was not found`});
    }

    return next();
}

export function usernameExists (req, res, next) {
    if (utilities.isFound(userData, 'username', req.body.username)) {
        return res.status(400).json({error: 'The username provided already exists'});
    }

    return next();
}

export function checkBidAmount (req, res, next) {
    if (req.body.amount <= utilities.findLowestBidAmount(bidsData, req.auctionIdNum)) {
        return res.status(400).json({error: 'The amount entered has to be higher than the current bid amount'});
    }

    return next();
}



