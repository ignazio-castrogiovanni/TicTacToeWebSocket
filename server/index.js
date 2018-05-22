const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8999});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        //broadcast
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        })
    });

    ws.send('connected');
});