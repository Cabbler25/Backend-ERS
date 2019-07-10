import express, { Request, Response } from 'express';
import * as userService from '../services/user-service';
import * as queries from '../Queries';
import User from 'models/User';

const userRouter = express.Router();

// Gets all users
userRouter.get('', (request: Request, response: Response) => {
    console.log('User Router: Handling get all users');
    
    queries.sendQuery('SELECT * FROM users').then((resolve) => {
        response.json(resolve.rows);
    }, (error) => {
        response.sendStatus(404);
    });
});

// Gets specific user by ID
userRouter.get('/:id', (request: Request, response: Response) => {
    console.log('User Router: Handling get user by ID');
    const id = parseInt(request.params.id);
    
    queries.sendQuery('SELECT * FROM users WHERE user_id = ' + id).then((resolve) => {
        response.json(resolve.rows);
    }, (error) => {
        console.log('Get user err', error);
        response.sendStatus(404);
    });
});

// Update user
userRouter.patch('', (request: Request, response: Response) => {
    console.log('User Router: Handling user update');

    let body = request.body[0];
    let id = body.userId;
    let properties: string;
    for (let a in body) {

        properties += `${a} = ${body[a]}`;
    }

    queries.sendQuery('UPDATE users WHERE user_id = ' + id + ' FOR ' + properties).then((resolve) => {
        response.json(resolve.rows);
    }, (error) => {
        console.log('Get user err', error);
        response.sendStatus(404);
    });

    if (updatedUser) {
        response.json(updatedUser);
    } else {
        response.sendStatus(404);
    }

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
});

export default userRouter;