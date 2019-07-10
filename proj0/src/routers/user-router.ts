import express, { Request, Response } from 'express';
import { permissions } from '../models/Role';
import { isLoggedIn, hasPermission, sendQuery } from '../services/Services';

const userRouter = express.Router();

// Gets all users
userRouter.get('', (request: Request, response: Response) => {
    console.log('\nUser Router: Handling get all users');

    if (!isLoggedIn(response)) return;
    if (!hasPermission(request, response, permissions.FINANCE_MANAGER)) return;

    let query = 'SELECT * FROM users';
    console.log(query);
    sendQuery(query).then((resolve) => {
        response.json(resolve.rows);
    }, (error) => { 
        console.log(error);
        response.sendStatus(404);
    });
});

// Gets specific user by ID
userRouter.get('/:id', (request: Request, response: Response) => {
    console.log('\nUser Router: Handling get user by ID');
    const id = parseInt(request.params.id);

    if (!isLoggedIn(response)) return;
    if (!hasPermission(request, response, permissions.FINANCE_MANAGER, id)) return;

    let query = `SELECT * FROM users WHERE user_id = ${id}`;
    console.log(query);
    sendQuery(query).then((resolve) => {
        response.json(resolve.rows);
    }, (error) => {
        console.log('Get user err: ', error);
        response.sendStatus(404);
    });
});

// Update user
userRouter.patch('', (request: Request, response: Response) => {
    console.log('\nUser Router: Handling user update');

    if (!isLoggedIn(response)) return;
    if (!hasPermission(request, response, permissions.ADMIN)) return;

    let body = request.body[0];
    let id: number = body.user_id;
    delete body.user_id;

    // Format body
    let properties: string = '';
    for (let a in body) {
        if (!body[a]) continue;
        properties += `${a} = '${body[a]}', `;
    }
    if (properties.length > 0) {
        properties = properties.substr(0, properties.length - 2);
    }

    let query = `UPDATE users SET ${properties} WHERE user_id = ${id}`;
    console.log(query);
    sendQuery(query).then((resolve) => {
        query = `SELECT * FROM users WHERE user_id = ${id}`;
        sendQuery(query).then((resolve) => {
            response.json(resolve.rows);
        });
    }, (error) => {
        console.log('Get user err', error);
        response.sendStatus(404);
    });
});

export default userRouter;