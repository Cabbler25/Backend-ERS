import db from "../util/pg-connection";
import User from "../models/User";
import Role from "../models/Role";

export async function logIn(username, password): Promise<User> {
    const query = {
        text: `SELECT ${User.getColumns()} FROM users WHERE username = $1 AND password = $2`,
        values: [username, password]
    }
    console.log(query.text + '\n' + query.values);

    const result = await db.query(query);
    return new User(result.rows[0]);
}

export async function getRole(id): Promise<Role> {
    let query = `SELECT ${Role.getColumns()} FROM roles WHERE id = $1`;
    console.log(query + '\n' + id);

    const result = await db.query(query, [id]);
    return result.rows[0];
}