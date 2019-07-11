import { roles } from "../models/Roles";

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

export function hasPermission(request, response, requiredRole, requiredId?): boolean {
    if (!request.cookies.user) {
        console.log('Login required.');
        response.status(401).send({ message: 'User not logged in!' });
        return false;
    }

    const role = request.cookies.permissions.role;
    const userId = request.cookies.user.userId;

    let result = requiredRole == roles.ALL || (requiredId ? role == requiredRole || userId == requiredId : role == requiredRole);
    if (result) {
        return true;
    } else {
        console.log('Bad permissions.');
        response.status(403).send({ message: 'Permission denied!' });
        return false;
    }
}
