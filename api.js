const client = require('./connection.js')
const express = require('express');
const app = express();

client.connect();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.listen(3000, () => console.log('grant-disbursement api application is running'));