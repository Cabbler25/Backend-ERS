import User from '../models/User';
import * as queries from '../Queries';

const users: Array<User> = new Array;

export function initializeUsers() {
    console.log('Initializing users');
    console.log(getAllUsers());
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
    /*let query = {
        text: 'INSERT INTO users (username, password, first_name, last_name, email, role) VALUES ($1,$2,$3,$4,$5,$6)',
        values: ['employee', 'password', 'Bobby', 'test', 'testing@aol.com', 'employee'],
    };*/
    //queries.sendQuery('SELECT * FROM users');
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