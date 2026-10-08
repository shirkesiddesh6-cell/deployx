const { Pool } = require("pg");

const pool = new Pool({
    user: "deployx_user",
    host: "postgres",
    database: "deployx",
    password: "deployx123",
    port: 5432
});

module.exports = pool;
