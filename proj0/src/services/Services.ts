let loggedIn: boolean = false;
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
});

export function getUserStatus(): boolean {
  return loggedIn;
}

export function setUserStatus(val) {
  loggedIn = val;
}

export function sendQuery(query): any {
    return pool.query(query);
}

export function hasPermission(request, response, requiredRole, requiredId?): boolean {
    const role = request.cookies.permissions.role;
    const userIdPermission = request.cookies.permissions.userId;

    let result = requiredId ? role == requiredRole || userIdPermission == requiredId : role == requiredRole;
    if (result) {
        return true;
    } else {
        console.log('Bad permissions.');
        response.status(403).send({ message: 'Permission denied!' });
        return false;
    }
}

export function isLoggedIn(response) {
    if (!getUserStatus()) {
        console.log('Login required.');
        response.status(400).send({ message: 'User not logged in!' });
        return false;
    }
    return true;
}
