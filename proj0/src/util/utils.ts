import { roles } from "../models/Role";

export function hasPermission(request, response, requiredRole, requiredId?): boolean {
    if (!request.cookies.user) {
        console.log('Login required.');
        response.status(401).send({ message: 'User not logged in!' });
        return false;
    }

    const userId = request.cookies.user.id;
    const role = request.cookies.permissions.role;

    let result = requiredRole == roles.ALL || (requiredId ? role == requiredRole || userId == requiredId : role == requiredRole);
    if (result) {
        return true;
    } else {
        console.log('Bad permissions.');
        response.status(403).send({ message: 'Permission denied!' });
        return false;
    }
}