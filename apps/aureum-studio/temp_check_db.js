const net = require('net');
const client = new net.Socket();
client.setTimeout(5000);

console.log("Connecting to 34.71.172.79:5432...");
client.connect(5432, '34.71.172.79', () => {
    console.log('SUCCESS: Connected to database port 5432!');
    client.destroy();
});

client.on('error', (err) => {
    console.error('ERROR connecting to port 5432:', err.message);
    client.destroy();
});

client.on('timeout', () => {
    console.error('TIMEOUT connecting to port 5432');
    client.destroy();
});
