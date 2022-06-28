const client = require('./connection.js')
const express = require('express');
const app = express();

client.connect();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Endpoint 1: Create Household

//Endpoint 2: Add a family member to household
//,aritalStatus: single, married, widowed, divorced


//Endpoint 3: List all the households in the database

//Endpoint 4: Show the details of a household in the database by member id

//Endpoint 5: Search for households and recipients of grant disbursement

//Endpoint 6: Delete household

//Endpoint 7: Delete Family Member - Remove Family Member from the Household



app.listen(3000, () => console.log('grant-disbursement api application is running'));