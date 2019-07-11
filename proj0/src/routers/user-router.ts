import express, { Request, Response } from 'express';
import { roles } from '../models/Roles';
import { hasPermission, sendQuery } from '../services/Services';

const userRouter = express.Router();

// Gets all users
userRouter.get('', (request: Request, response: Response) => {
    console.log('\nUser Router: Handling get all users');

    if (!hasPermission(request, response, roles.FINANCE_MANAGER)) return;

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

    if (!hasPermission(request, response, roles.FINANCE_MANAGER, id)) return;

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

    if (!hasPermission(request, response, roles.ADMIN)) return;

    let body = request.body[0];
    let id: number = body.user_id;
    delete body.user_id;

    // Format body
    let properties: string = '';
    for (let a in body) {
        properties += `${a} = ${typeof body[a] === 'number' ? `${body[a]}` : `'${body[a]}'`}, `;
    }
    properties = properties.substr(0, properties.lastIndexOf(','));

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