import User from 'models/User';

const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
});


export function sendQuery(query): any {
    return pool.query(query);
}