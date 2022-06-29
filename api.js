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
app.get('/search-grant/:household_type/:annual_income/:member_age/:martial_status', (req, res)=>{
    let searchQuery = '';
    let member_age_operator = '';
    let annual_income_operator = '';
    let member_age = '';
    let annual_income = '';

    if(req.params.member_age !== "nil")
    {
        member_age_operator = req.params.member_age.substring(0, 4);

        if(member_age_operator == 'more')
        {
            member_age_operator = '<=';
        }
        else
        {
            member_age_operator = '>=';
        }

        member_age = parseFloat(req.params.member_age.substring(4));
    }

    if(req.params.annual_income !== "nil")
    {
        annual_income_operator = req.params.annual_income.substring(0, 4);

        if(annual_income_operator == 'more')
        {
            annual_income_operator = '>';
        }
        else
        {
            annual_income_operator = '<';
        }

        annual_income = parseFloat(req.params.annual_income.substring(4)).toFixed(2);
    }

    //Student Encouragement Bonus (Households with children of less than 16 years old and household income of less than $150,000)
    if(req.params.household_type == "nil" && req.params.annual_income !== "nil" && req.params.member_age !== "nil" && req.params.martial_status === "nil")
    {
        searchQuery = `with a as (
                        SELECT household_family_id, total_annual_income FROM (
                                                    select hfm.household_family_id as household_family_id, sum(hfm.member_annual_income) as total_annual_income
                                                                    from household_family hf
                                                                    inner join household h
                                                                    on h.id = hf.household_id
                                                                    inner join household_family_member hfm
                                                                    on hf.id = hfm.household_family_id
                                                                    group by hfm.household_family_id
                                                ) R
                                                WHERE total_annual_income ${annual_income_operator} ${annual_income}
                            ), b as (
                                                    select hfm.household_family_id
                                                                        from household_family hf
                                                                        inner join household h
                                                                        on h.id = hf.household_id
                                                                        inner join household_family_member hfm
                                                                        on hf.id = hfm.household_family_id
                                                        where hfm.household_family_id = (SELECT household_family_id FROM a )
                                                        and hfm.member_dob${member_age_operator} hfm.member_dob - INTERVAL '${member_age} years'
                                                        group by hfm.household_family_id
                                                ) select hfm.*
                                                                        from household_family hf
                                                                        inner join household h
                                                                        on h.id = hf.household_id
                                                                        inner join household_family_member hfm
                                                                        on hf.id = hfm.household_family_id
                                                        where hfm.household_family_id = (SELECT household_family_id FROM b )`;
    }

    //Family Togetherness Scheme (Households with husband & wife and Has child(ren) younger than 18 years old)
    if(req.params.household_type == "nil" && req.params.annual_income == "nil" && req.params.member_age !== "nil" && req.params.martial_status !== "nil")
    {
        searchQuery = `with a as
                                (
                                    select hfm.household_family_id
                                                        from household_family hf
                                                        inner join household h
                                                        on h.id = hf.household_id
                                                        inner join household_family_member hfm
                                                        on hf.id = hfm.household_family_id
                                                        where hfm.member_marital_status = '${req.params.martial_status}'
                                                        group by hfm.household_family_id
                                ), b as (
                                    select hfm.household_family_id
                                                        from household_family hf
                                                        inner join household h
                                                        on h.id = hf.household_id
                                                        inner join household_family_member hfm
                                                        on hf.id = hfm.household_family_id
                                        where hfm.household_family_id = (SELECT household_family_id FROM a )
                                        and hfm.member_dob${member_age_operator} hfm.member_dob - INTERVAL '${member_age} years'
                                        group by hfm.household_family_id
                                ) select hfm.*
                                                        from household_family hf
                                                        inner join household h
                                                        on h.id = hf.household_id
                                                        inner join household_family_member hfm
                                                        on hf.id = hfm.household_family_id
                                        where hfm.household_family_id = (SELECT household_family_id FROM b )`;
    }

    //Elder Bonus (HDB household with family members above the age of 50)
    if(req.params.household_type !== "nil" && req.params.annual_income == "nil" && req.params.member_age !== "nil")
    {
        searchQuery = `with a as
                        (
                            select household_family_id
                                                from household_family hf
                                                inner join household h
                                                on h.id = hf.household_id
                                                inner join household_family_member hfm
                                                on hf.id = hfm.household_family_id
                                                where h.household_type = '${req.params.household_type}'
                                                and hfm.member_dob${member_age_operator} hfm.member_dob - INTERVAL '${member_age} years'
                                                group by hfm.household_family_id
                        ) select hfm.*
                                                from household_family hf
                                                inner join household h
                                                on h.id = hf.household_id
                                                inner join household_family_member hfm
                                                on hf.id = hfm.household_family_id
                                where hfm.household_family_id = (SELECT household_family_id FROM a )`;
    }

    //Baby Sunshine Grant (children younger than 5)
    if(req.params.household_type == "nil" && req.params.annual_income == "nil" && req.params.member_age !== "nil")
    {
        searchQuery = `with a as
                        (
                            select household_family_id
                                                from household_family hf
                                                inner join household h
                                                on h.id = hf.household_id
                                                inner join household_family_member hfm
                                                on hf.id = hfm.household_family_id
                                                where hfm.member_dob${member_age_operator} hfm.member_dob - INTERVAL '${member_age} years'
                                                group by hfm.household_family_id
                        ) select hfm.*
                                                from household_family hf
                                                inner join household h
                                                on h.id = hf.household_id
                                                inner join household_family_member hfm
                                                on hf.id = hfm.household_family_id
                                where hfm.household_family_id = (SELECT household_family_id FROM a )`;
    }

    //YOLO GST Grant (income of less than $100,000)
    if(req.params.household_type !== "nil" && req.params.annual_income !== "nil")
    {
        searchQuery = `SELECT household_family_id, total_annual_income FROM (
                            select hfm.household_family_id as household_family_id, sum(hfm.member_annual_income) as total_annual_income
                                            from household_family hf
                                            inner join household h
                                            on h.id = hf.household_id
                                            inner join household_family_member hfm
                                            on hf.id = hfm.household_family_id
                                            where h.household_type = '${req.params.household_type}' 
                                            group by hfm.household_family_id
                        ) R
                        WHERE total_annual_income ${annual_income_operator} ${annual_income};`;
    }

    client.query(searchQuery, (err, result)=>{
        if(!err){                   
            res.send(result.rows);
        }
        else{ 
            console.log(err.message) 
        }
        })
    client.end;
});

//Endpoint 6: Delete household - Remove Household and family members
app.delete('/delete-household/:household_family_id', (req, res)=> {
    let insertQuery = `DELETE FROM household_family WHERE id = ${req.params.household_family_id}; 
                        DELETE FROM household_family_member WHERE household_family_id = ${req.params.household_family_id};`;

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Household and family members removed successfully the household type.')
        }
        else{ console.log(err.message) }
    })
    client.end;
})

//Endpoint 7: Delete Family Member - Remove Family Member from the Household
app.delete('/delete-member/:household_family_id/:household_family_member_id', (req, res)=> {
    let insertQuery = `delete from household_family_member 
                        where household_family_id=${req.params.household_family_id}
                        and id=${req.params.household_family_member_id}`;

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Family member removed successfully from the household.')
        }
        else{ console.log(err.message) }
    })
    client.end;
})



app.listen(3600, () => console.log('grant-disbursement api application is running'));