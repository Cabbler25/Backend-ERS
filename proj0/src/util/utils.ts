import { roles } from "../models/Role";

export function hasPermission(request, response, roleRequired, idRequired?): boolean {
    if (!request.cookies.user) {
        console.log('Login required.');
        response.status(401).send({ message: 'User not logged in!' });
        return false;
    }
    if (roleRequired == roles.ALL) return true;
    
    const userId = request.cookies.user.id;
    const userRole = request.cookies.permissions.role;
   
    let result: boolean;
    if (idRequired) result = userId == idRequired;
    if (!result)    result = userRole == roleRequired;
    
    if (!result) {
        console.log('Bad permissions.');
        response.status(403).send({ message: 'Permission denied!' });
        return false;
    }
    return true;
}