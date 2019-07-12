import User from "../models/User";
import db from "../util/pg-connection";

export async function createUser(user: User): Promise<User> {
    // Not implemented
    return new User({});
}

export async function getAllUsers(): Promise<User[]> {
    let query = `SELECT ${User.getColumns()} FROM users`;
    console.log(query);

    const result = await db.query(query);
    return result.rows;
}

export async function getUserById(id): Promise<User> {
    let query = `SELECT ${User.getColumns()} FROM users WHERE id = $1`;
    console.log(query + "\n" + id);
    
    const result = await db.query(query, [id]);
    return result.rows[0];
}

export async function updateUser(user: User): Promise<User> {
    let id: number = user.id;
    delete user.id;

    let columns: string = '';
    let values: any[] = [];
    let count: number = 1;
    for (let a in user) {
        if (user[a] === undefined || user[a] === null) {
            delete user[a];
            continue;
        }
        switch (a) {
            case 'firstName':
                columns += `first_name = $${count++}, `;
                break;
            case 'lastName':
                columns += `last_name = $${count++}, `;
                break;
            default:
                columns += `${a} = $${count++}, `;
        }
        values.push(user[a]);
    }
    columns = columns.substr(0, columns.lastIndexOf(','));
    values.push(id);

    const query = {
        text: `UPDATE users SET ${columns} WHERE id = $${count} RETURNING ${User.getColumns()}`,
        values: values,
    }

    console.log(query.text + '\n' + query.values);
    const result = await db.query(query);
    return result.rows[0];
}


