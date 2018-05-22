const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8999});

function noop() {}

function heartbeat() {
    this.isAlive = true;
}

wss.on('connection', function connection(ws) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);

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

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 2000)