const fs = require('fs');
const http = require('http');
const path = require('path');
const DATA_PATH = './data/cluj';

const getWheaterData = () => {
    // http://www.meteoromania.ro/wp-json/meteoapi/v2/starea-vremii
    const options = {
        hostname: 'www.meteoromania.ro',
        port: 80,
        path: '/wp-json/meteoapi/v2/starea-vremii',
        method: 'GET'
    }

    const req = http.request(options, res => {
        let response = '';
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => response += d);
        res.on('end', () => {
            const fileName = getFileName();
            const filePath = path.join(DATA_PATH, fileName);
            const data = JSON.parse(response);
            const clujData = {
                ...data,
                features: data.features.find(d => d.properties.nume.toLowerCase() === 'cluj-napoca')
            };
            fs.writeFile(filePath, JSON.stringify(clujData, null, 4), e => {
                if (e) {
                    console.error('Cannot write to file', filePath, e);
                }
            });
            return 0;
        });
    })

    req.on('error', error => {
        console.error(error)
    })

    req.end()
}

const getFileName = () => {
    return new Date()
        .toLocaleString()
        .replace(/\//g, '-')
        .replace(', ', '_')
        .replace(/:/g, '-')
        .replace(/\s/g, '_') + '.json';
}

getWheaterData();
