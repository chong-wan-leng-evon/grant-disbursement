const client = require('./connection.js')
const express = require('express');
const app = express();

client.connect();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Endpoint 1: Create Household
app.post('/create-household', (req, res)=> {
    const household = req.body;
    let insertQuery = '';

    for(var type in household) {
        if(type == 0)
        {
            insertQuery = `insert into household(housing_type) values('${household[type]['housing_type']}')`;
        }
        else
        {
            insertQuery += `, ('${household[type]['housing_type']}')`;
        }
    }

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Household created successfully.')
        }
        else{ console.log(err.message) }
    })
    client.end;
});

//Endpoint 2: Add a family member to household
//maritalStatus: single, married, widowed, divorced



//Endpoint 3: List all the households in the database

//Endpoint 4: Show the details of a household in the database by member id

//Endpoint 5: Search for households and recipients of grant disbursement

//Endpoint 6: Delete household

//Endpoint 7: Delete Family Member - Remove Family Member from the Household



app.listen(4000, () => console.log('grant-disbursement api application is running'));