import https from 'https';

const options = {
    hostname: 'foodfusion-backend-zjrp.onrender.com',
    port: 443,
    path: '/api/restaurants',
    method: 'GET',
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('BODY:', data);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
