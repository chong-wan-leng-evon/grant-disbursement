const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Evon0601",
    database: "postgres"
})

module.exports = client