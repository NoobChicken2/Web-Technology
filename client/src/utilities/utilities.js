import loginStore from '../stores/loginStore.js';

export function findData (data, field, value, entry) {
    let returnValue;

    data.forEach(item => {
        if (value === item[field]) {
            if (entry === undefined) {
                returnValue = item;
            } else {
                returnValue = item[entry];
            }
        }
    });

    return returnValue;
}

export function findDataArray (data, field, value) {
    let returnValue = [], count = 0;

    data.forEach(item => {
        if (value === item[field]) {
            returnValue[count] = item;
            count++;
        }
    });

    return returnValue;
}

export function findAllCategories (data) {
    let categories = [], index = 0;

    data.forEach(item => {
        categories[index] = item.itemType;
        index++;
    });

    return categories.reduce((accumulator, value) => {
        return {...accumulator, [value]: (accumulator[value] || 0) + 1};
        }, {});
}

export function isLoggedIn (token) {
    if (typeof token === 'object') {
        loginStore.update((oldValue) => {
            oldValue.isLoggedIn = false
            return oldValue;
        });

        return false;
    } else if (typeof token === 'string' && token.length !== 0) {
        loginStore.update((oldValue) => {
            oldValue.isLoggedIn = true
            return oldValue;
        });

        return true;
    }
}

