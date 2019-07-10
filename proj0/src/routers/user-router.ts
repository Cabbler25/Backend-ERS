import express, { Request, Response } from 'express';
import * as userService from '../services/user-service';
import User from 'models/User';

const userRouter = express.Router();

// Gets all users
userRouter.get('', (request: Request, response: Response) => {
    console.log('User Router: Handling get all users');

    const users: User[] = userService.getAllUsers();

    if (users) {
        // response.json(users);
    } else {
        response.sendStatus(404);
    }
});

// Gets specific user by ID
userRouter.get('/:id', (request: Request, response: Response) => {
    console.log('User Router: Handling get user by ID');

    const id = parseInt(request.params.id);
    const user: User = userService.getUserById(id);

    if (user) {
        response.json(user);
    } else {
        response.sendStatus(404);
    }
});

// Update user
userRouter.patch('', (request: Request, response: Response) => {
    console.log('User Router: Handling user update');

    let body = request.body[0];
    const updatedUser: User = userService.updateUser(body);

    if (updatedUser) {
        response.json(updatedUser);
    } else {
        response.sendStatus(404);
    }
});

export default userRouter;