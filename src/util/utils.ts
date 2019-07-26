import Role, { roles } from "../models/Role";

export function hasPermission(req, res, requiredRole, requiredId?): boolean {
    if (!req.cookies.user) {
        console.log('Login required.');
        res.status(401).send({ message: 'User not logged in!' });
        return false;
    }
    if (requiredRole == roles.ALL) return true;
    switch (requiredRole) {
        case roles.ADMIN:
            requiredRole = 1;
            break;
        case roles.FINANCE_MANAGER:
            requiredRole = 2;
            break;
        case roles.USER:
            requiredRole = 3;
            break;
    }

    const userId = req.cookies.user.id;
    const userRole = req.cookies.permissions.id;
    console.log(req.cookies.permissions);

    let result;
    if (userId) result = userId == requiredId;
    if (!result) result = Role.hasPermission(userRole, requiredRole);
    if (!result) {
        console.log('Bad permissions.');
        res.status(401).send({ message: 'You are not authorized for this operation' });
        return false;
    }
    return true;
}

export function logQuery(query: string, values?: any) {
    const queryColor: string = '\x1b[32m%s\x1b[0m';
    console.log(queryColor, `${query}`);
    if (values) {
        console.log(`Values: [ ${values} ]`);
    }
}

export function refreshCookies(req) {
    const cookies = req.cookies;
    if (req.cookies.user) {
        req.cookies.set
    }
}