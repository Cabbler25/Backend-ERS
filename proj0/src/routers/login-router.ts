import express, { Request, Response } from 'express';
import { setUserStatus, sendQuery } from '../services/Services';

const loginRouter = express.Router();

loginRouter.post('', (request: Request, response: Response) => {
    console.log('\nLogin Router: Handling user sign in');


    const err = { message: "Invalid Credentials" };
    const body = request.body[0];
    const userIn = { username: body.username, password: body.password };

    let query = `SELECT * FROM users WHERE username = '${userIn.username}' AND password = '${userIn.password}'`;
    console.log(query);
    sendQuery(query).then((resolve) => {
        if (resolve.rows.length == 0) throw err;

        for (let a in response.cookie) {
            response.clearCookie(a);
        }
 
        const usr = resolve.rows[0];
        // Lookup users role
        query = `SELECT * FROM roles WHERE role_id = ${usr.role}`;
        sendQuery(query).then((res) => {
            const usrRole = res.rows[0];
            console.log("Login successful.");
            setUserStatus(true);
            response.cookie('permissions', { roleId: usrRole.role_id, role: usrRole.role, userId: usr.user_id }).json(resolve.rows);
        });
    }).catch((error) => {
        console.log(error);
        response.status(400).json(err);
    }), (error) => {
        console.log(error);
        response.status(400).json(err);
    }
});

export default loginRouter;
