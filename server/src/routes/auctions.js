import express from 'express';
const router = express.Router();

import data from '../data/auctions.js';

import * as utilities from '../util/utilities.js';
import {findIdAuction, numId, bodyId, isAuctionDataEmpty} from '../middleware/util-middleware.js';
import {isLoggedIn} from "../middleware/authentication.js";


// GET Routers
router.get ('/', isAuctionDataEmpty, (req, res) => {
    let {name, userId, itemType} = req.query;
    const queryQuantity = utilities.oneQuery(name, userId, itemType);

    if (name === undefined && userId === undefined && itemType === undefined) {
        return res.json(data);
    }
    userId = Number.parseInt(userId);

    if (queryQuantity !== false) {
        switch (queryQuantity) {
            case 0 :
                if (utilities.isFound(data, 'name', name)) {
                    return res.json(utilities.findData(data, 'name', name));
                }
                break;
            case 1 :
                if (utilities.isFound(data, 'userId', userId)) {
                    return res.json(utilities.findData(data, 'userId', userId));
                }
                break;
            case 2 :
                if (utilities.isFound(data, 'itemType', itemType)) {
                    return res.json(utilities.findData(data, 'itemType', itemType));
                }
                break;
            default :
                return res.status(404).json({error: 'Default switch reached'});
        }
    } else {
        return res.status(400).json( {error: 'Only one query parameter allowed'});
    }

    return res.status(400).json({error: 'The query parameters provided are not correct'});
});

router.get ('/:id', numId, findIdAuction, (req, res) => {
    return res.status(200).json(req.found);
});

// POST Routers
router.post('/', isLoggedIn, (req, res) => {
    const limit = 5;
    utilities.bodyLimit(limit, req, res);

    if(!('name' in req.body && 'startingBid' in req.body && 'userId' in req.body && 'itemType' in req.body && 'image' in req.body)) {
        return res.status(400).json({error: 'The requested body does not have the required parameters'})
    }

    let newAuction;
    newAuction = {
        id : utilities.incrementIdNum(data, 'id')
    };
    Object.assign(newAuction, req.body);
    data.push(newAuction);

    return res.status(201).json({result: 'The auction was successfully created'});
});

// PUT Routers
router.patch('/:id', numId, findIdAuction, bodyId, isLoggedIn, (req, res) => {
    Object.assign(utilities.findData(data,'id', req.idNum)[0], req.body);

    return res.status(200).json({result: 'The entry was updated'});
});

// DELETE Routers
router.delete('/', isLoggedIn, (req, res) => {
    utilities.deleteAll(data);

    return res.status(200).json({result: 'All the auction entries have been deleted!'});
});

router.delete('/:id', numId, findIdAuction, isLoggedIn, (req, res) => {
    utilities.deleteById(data, 'id', req.idNum);

    return res.status(200).json({result: `The Auction entry with ID ${req.idNum} has been deleted`});
});

export default router;