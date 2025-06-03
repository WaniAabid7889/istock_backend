const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'stock_management',
    password: 'root',
    port: 5433,
})

if(pool.connect()) {
    console.log("connected to db")
}
module.exports = pool;
