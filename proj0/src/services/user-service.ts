import User from "../models/User";
import db from "../util/pg-connection";

const bcrypt = require('bcrypt');
const saltRounds: number = 12;

// TODO: implement
// For now the users are pre-existing, one for each unique role
export async function createUser(user: User): Promise<User> { return user; }

export async function getAllUsers(): Promise<User[]> {
    let query = `SELECT ${User.getColumns()} FROM users ORDER BY id`;
    console.log(query);

    const result = await db.query(query);
    return result.rows;
}

export async function getUserById(id: number): Promise<User> {
    let query = `SELECT ${User.getColumns()} FROM users WHERE id = $1`;
    console.log(`${query}\nValues: [ ${id} ]`);

    const result = await db.query(query, [id]);
    return result.rows[0];
}

// Update user
export async function updateUser(user: User): Promise<User> {
    let id: number = user.id;
    delete user.id;

    // Gather all properties and values 
    // into a SQL query. Fun
    const values: any[] = [];
    let columns: string = '';
    let count: number = 1;
    for (let a in user) {
        if (user[a] === undefined || user[a] === null) continue;
        switch (a) {
            case 'firstName':
                columns += `first_name = $${count++}, `;
                break;
            case 'lastName':
                columns += `last_name = $${count++}, `;
                break;
            case 'password':
                columns += `${a} = $${count++}, `;
                user[a] = await bcrypt.hash(user[a], saltRounds);
                break;
            default:
                columns += `${a} = $${count++}, `;
        }
        values.push(user[a]);
    }
    columns = columns.slice(0, -2);
    values.push(id);

    let query = `UPDATE users SET ${columns} WHERE id = $${count} RETURNING ${User.getColumns()}`;
    console.log(`${query}\nValues: [ ${values} ]`);

    const result = await db.query(query, values);
    return result.rows[0];
}


