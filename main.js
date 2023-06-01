let { Connection } = require('./Connection.js')

const tournament_id = '142857';
const name = 'Pablo Escobar';
const port = 4000;
const url = `http://127.0.0.1:${port}`;
// Create a connection to the socket
var connection = new Connection(url, tournament_id, name);

connection.connect();
connection.disconnect();

// Wait for the ok_signin signal
connection.waitedSignals();
