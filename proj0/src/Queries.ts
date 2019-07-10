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
    pool.connect((err, client, release) => {
        if (err) {
            return console.error('Error acquiring client', err.stack);
        }
        client.query('SELECT NOW()', (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack);
            }
            console.log(result.rows)
        });
    });
    /*executeQuery(query).then((v) => {
        return v;
    });*/
}

function executeQuery(query): any {
    let promise = new Promise((resolve, reject) => {
        pool.query(query, (err, res) => {
            if (err) throw err;
            console.log(res.rows);
            resolve(res);
        });
    });
    return promise;
}