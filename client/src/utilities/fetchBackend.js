import tokenStore from '../stores/tokenStore.js';

let token;

let unsubscribe = tokenStore.subscribe((value) => {
   token = value.token;
});

export default async function doCall(url, method = 'GET', body) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    if (token && token.length !== 0) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, options);
    let jsonResponse = await response.json();

    if (response.ok) {
        return jsonResponse;
    } else {
        throw new Error(jsonResponse.error);
    }
}
