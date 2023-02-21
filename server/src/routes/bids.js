import express from 'express';
const router = express.Router();

import bidsData from '../data/bids.js';

import * as utilities from '../util/utilities.js';
import {
    numAuctionId,
    findAuctionIdBids,
    numId,
    findIdBids, checkBidAmount,
} from '../middleware/util-middleware.js';
import {isLoggedIn} from '../middleware/authentication.js';


// GET routers
router.get ("/", (req, res) => {
    const {userId} = req.query;

    if (userId === undefined) {
        return res.status(200).json(bidsData);
    }

    if(utilities.isFound(bidsData, 'userId', userId)) {
        return res.status(200).json(utilities.findData(bidsData, 'userId', userId));
    }

    //Returns an empty (array) body
    return res.status(200).json([]);
});

router.get ("/:auctionId", numAuctionId, findAuctionIdBids, (req, res) => {
    return res.status(200).json(req.foundAuctionId);
});

router.get ("/:auctionId/:id", numAuctionId, numId, findAuctionIdBids, findIdBids, (req, res) => {
    return res.status(200).json(req.foundBidsId);
});

// POST routers
router.post ("/:auctionId", numAuctionId, checkBidAmount, isLoggedIn, (req, res) => {
    const limit = 2;
    utilities.bodyLimit(limit, req, res);

    if (!('userId' in req.body && 'amount' in req.body)) {
        return res.status(400).json({error: 'The requested body does not have the required parameters'});
    }

    let newBid;
    newBid = {
        auctionId : req.auctionIdNum,
        id : utilities.incrementIdNumBids(bidsData, req.auctionIdNum)
    };
    Object.assign(newBid, req.body);
    bidsData.push(newBid);

    return res.status(200).json({result: 'The bid was successfully created'});
});

// PUT routers
router.patch ("/:auctionId/:id", numAuctionId, numId, findAuctionIdBids, findIdBids, checkBidAmount, isLoggedIn, (req, res) => {
    const limit = 1;
    utilities.bodyLimit(limit, req, res);

    if ('amount' in req.body) {
        Object.assign(req.foundBidsId, req.body);
        return res.status(200).json(req.foundBidsId);
    }

    return res.status(400).json({error: 'The body should only contain the amount field'});
});

// DELETE routers
router.delete ("/:auctionId/:id", numAuctionId, numId, findAuctionIdBids, isLoggedIn, (req, res) => {
    utilities.deleteBid(bidsData, req.idNum, req.auctionIdNum);

    return res.status(200).json({result: 'The bid was successfully deleted'});
});

export default router;