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
            insertQuery = `insert into household(household_type) values('${household[type]['household_type']}')`;
        }
        else
        {
            insertQuery += `, ('${household[type]['household_type']}')`;
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
app.post('/add-member', (req, res)=> {
    const householdMember = req.body;
    let insertQuery = '';

    let member_name_array = '';
    let member_gender_array = '';
    let member_marital_status_array = '';
    let member_spouse_array = '';
    let member_occupation_type_array = '';
    let member_annual_income_array = '';
    let member_dob_array = '';

    for(var member in householdMember) {
        if(member == 0)
        {
            member_name_array = `'${householdMember[member]['member_name']}'`;
            member_gender_array = `'${householdMember[member]['member_gender']}'`;
            member_marital_status_array = `'${householdMember[member]['member_marital_status']}'`;
            member_spouse_array = `'${householdMember[member]['member_spouse']}'`;
            member_occupation_type_array = `'${householdMember[member]['member_occupation_type']}'`;
            member_annual_income_array = `${householdMember[member]['member_annual_income']}`;
            member_dob_array = `'${householdMember[member]['member_dob']}'::date`;
        }
        else
        {
            member_name_array += `, '${householdMember[member]['member_name']}'`;
            member_gender_array += `, '${householdMember[member]['member_gender']}'`;
            member_marital_status_array += `, '${householdMember[member]['member_marital_status']}'`;
            member_spouse_array += `, '${householdMember[member]['member_spouse']}'`;
            member_occupation_type_array += `, '${householdMember[member]['member_occupation_type']}'`;
            member_annual_income_array += `, ${householdMember[member]['member_annual_income']}`;
            member_dob_array += `, '${householdMember[member]['member_dob']}'::date`;
        }
    }

    insertQuery = `WITH a AS (
        SELECT id FROM household where household_type = '${householdMember[0]['household_type']}' 
    ), b AS (
        INSERT INTO household_family(household_id)
        SELECT id
        FROM a 
        RETURNING id
    )
    INSERT INTO household_family_member(household_family_id, member_name, member_gender, member_marital_status, member_spouse, member_occupation_type, member_annual_income, member_dob)
    SELECT id, unnest(ARRAY[${member_name_array}]), unnest(ARRAY[${member_gender_array}]), unnest(ARRAY[${member_marital_status_array}]), unnest(ARRAY[${member_spouse_array}])
    , unnest(ARRAY[${member_occupation_type_array}]), unnest(ARRAY[${member_annual_income_array}]), unnest(ARRAY[${member_dob_array}])
    FROM b`;

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Family member added to household successfully.')
        }
        else{ console.log(err.message) }
    })
    client.end;
});

//Endpoint 3: List all the households in the database
app.get('/list-household', (req, res)=>{
    client.query(`select rtrim(h.household_type) as household_type, rtrim(hfm.member_name) as member_name, hfm.member_gender, rtrim(hfm.member_marital_status) as member_marital_status, rtrim(hfm.member_spouse) as member_spouse, rtrim(hfm.member_occupation_type) as member_occupation_type, hfm.member_annual_income, hfm.member_dob
                from household h
                inner join household_family hf
                on h.id = hf.household_id
                inner join household_family_member hfm
                on hf.id = hfm.household_family_id
                order by hfm.id asc`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
});

//Endpoint 4: Show the details of a household in the database by member id
app.get('/show-household/:id', (req, res)=>{
    client.query(`select rtrim(h.household_type) as household_type, rtrim(hfm.member_name) as member_name, hfm.member_gender, rtrim(hfm.member_marital_status) as member_marital_status, rtrim(hfm.member_spouse) as member_spouse, rtrim(hfm.member_occupation_type) as member_occupation_type, hfm.member_annual_income, hfm.member_dob
                    from household_family hf
                    inner join household h
                    on h.id = hf.household_id
                    inner join household_family_member hfm
                    on hf.id = hfm.household_family_id
                    where hf.id = ${req.params.id}
                    order by hfm.id asc`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
});

//Endpoint 5: Search for households and recipients of grant disbursement

//Endpoint 6: Delete household

//Endpoint 7: Delete Family Member - Remove Family Member from the Household



app.listen(3000, () => console.log('grant-disbursement api application is running'));