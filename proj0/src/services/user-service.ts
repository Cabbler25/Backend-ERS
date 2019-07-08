import Role from 'models/Role';
import User from 'models/User';

const userMap: Map<Number, User> = new Map();

let userCount = 1;
let adminUser: User = new User(0, 'DAdams', 'password', 'Dylan', 'Adams', 'dadams10642@outlook.com', new Role(0, 'admin'))
let financeManagerUser: User = new User(1, 'DKoenig', 'moneymoney', 'Dylan', 'Koenig', 'bigDK@gmail.com', new Role(1, 'finance-manager'))
let firstEmployee: User = new User(2, 'BAdams', 'perfume', 'Becca', 'Adams', 'becca.boo@aol.com', new Role(2, 'employee'))
userMap.set(userCount++, adminUser);
userMap.set(userCount++, financeManagerUser);
userMap.set(userCount++, firstEmployee);

export function getUserById (id): User {
    return userMap.get(id);
}

export function getAllUsers(): Map<Number, User> {
    return userMap;
}