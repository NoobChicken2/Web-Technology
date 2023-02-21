import auctionData from '../data/auctions.js';

// Universal functions
export function findData(data, type, value) {
    let returnData = [], count = 0;

    data.forEach(item => {
        if (value === item[type]) {
            returnData[count] = item;
            count++;
        }
    })

    return returnData;
}

export function isFound (data, type, value) {
    let isFound = false;

    data.forEach(item => {
        if (value === item[type]){
            isFound = true;
        }
    })

    return isFound;
}

export function incrementIdNum(data, type) {
    let max = 0;

    data.forEach(item => {
        if (max < item[type]) {
            max = item[type];
        }
    });

    return max + 1;
}

export function incrementIdNumBids(data, auctionIdBids) {
    let max = 0, auctionArray = [], count = 0;

    data.forEach(item => {
        if (auctionIdBids === item['auctionId']) {
            auctionArray[count] = item;
            count++;
        }
    });

    if (auctionArray.length === 0) {
        return 1;
    } else {
        auctionArray.forEach(item => {
            if (max < item['id']) {
                max = item['id'];
            }
        })
    }

    return max + 1;
}

export function deleteAll(data) {
    const length = data.length;

    for (let i = 0; i < length; i++) {
        data.pop();
    }
}

export function deleteById(data, type, value) {
    let count = 0;

    data.forEach(item => {
        if (item[type] === value) {
            data.splice(count, 1);
            return;
        }
        count++;
    });
}

export function oneQuery (query1, query2, query3) {
    let queries = [query1, query2, query3], count = 0, index;

    for (let i = 0; i < queries.length; i++) {
        if (queries[i] !== undefined) {
            count++;
            index = i;
        }
    }

    if (count === 1) {
        return index;
    } else {
        return false;
    }
}

export function deleteBid(data, id, auctionId) {
    let count = 0;

    data.forEach(item => {
        if (item.id === id && item.auctionId === auctionId) {
            data.splice(count, 1);
            return;
        }
        count++;
    })
}

export function bodyLimit (limit, req, res) {
    let body = req.body, count = 0;

    for (let x in body) {
        count++;
    }

    if (count > limit) {
        return res.status(400).json(`The body should only contain ${limit} field/s`);
    }
}

export function findLowestBidAmount (data, id) {
    let auctions = findData(data, 'auctionId', id);

    if (auctions.length === 0) {
        auctions = findData(auctionData, 'id', id);
    }

    let max = auctions[0].amount;

    auctions.forEach(item => {
        if (max < item.amount) {
            max = item.amount;
        }
    });

    return max;
}
