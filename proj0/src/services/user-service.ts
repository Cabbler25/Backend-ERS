import User from '../models/User';
import * as queries from '../Queries';

let users: Array<User>;

export function initializeUsers() {
    console.log('Initializing users');
    queries.sendQuery('SELECT * FROM users').then((v) => {
        users = v.rows;
        console.log(users);
    });
    // console.log(queries.sendQuery('SELECT * FROM users'));
}

export function loginUser(body: any): User {
    let username = body.username;
    let password = body.password;

    return users.find((v) => {
        return v.username == username && v.password == password;
    });
}

export function getUserById(id): User {
    return users.find((v) => {
        return v.userId == id;
    });
}

export function getAllUsers(): User[]{
    return queries.sendQuery('SELECT * FROM users');
}

export function updateUser(body): User {
    let id = body.userId;
    let idx = users.findIndex((v) => {
        return v.userId == id;
    });
    if (!idx) return;

    const usr: User = users[idx];

    for (let a in body) {
        usr[a] = body[a];
    }

    users[idx] = usr;
    return usr;
}